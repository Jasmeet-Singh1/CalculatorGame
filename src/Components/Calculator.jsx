import React, { useEffect, useRef, useState } from 'react';
import classes from './Calculator.module.css';
import { ToastContainer, toast } from 'react-toastify';

const Calculator = () => {
  const [numberInputX, setnumberInputX] = useState([]);
  const [operatorinputX, setOperatorinputX] = useState([]);

  const [numberInputY, setnumberInputY] = useState([]);
  const [operatorinputY, setOperatorinputY] = useState([]);

  const [expectedResultX, setExpectedResultX] = useState([]);
  const [expectedResultY, setExpectedResultY] = useState([]);

  const [labelRandomX, setLabelRandomX] = useState(null);
  const [labelRandomY, setLabelRandomY] = useState(null);

  const [isPlayerXActive, setIsPlayerXActive] = useState(true);

  const [startTime, setStartTime] = useState(null);

  const [durationX, setDurationX] = useState([]);
  const [durationY, setDurationY] = useState([]);

  const [totalDurationX, setTotalDurationX] = useState(0);
  const [totalDurationY, setTotalDurationY] = useState(0);

  const [roundX, setRoundX] = useState(1);
  const [roundY, setRoundY] = useState(1);

  const [isNumberActive, setIsNumberActive] = useState(true);

  const [winner, setWinner] = useState();
  let randomLabel;

  const handleKeyDown = (e) => {
    const key = e.key;

    e.preventDefault();

    if (!isNaN(key)) handleNumberInput(Number(key));
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleStartGame = () => {
    const start = new Date();
    setStartTime(start);
  };

  const handleFinishGame = () => {
    const finish = new Date();

    let totalDurationType = isPlayerXActive ? setTotalDurationX : setTotalDurationY;
    let durationType = isPlayerXActive ? setDurationX : setDurationY;

    if (startTime) {
      const timeDifference = finish - startTime;
      durationType((prev) => [...prev, timeDifference]);
      totalDurationType((prevState) => prevState + timeDifference);
    }
  };

  const handleNumberInput = (num) => {
    if (isNumberActive) {
      if (isPlayerXActive) {
        let duplicateArray = [...numberInputX];
        let string = duplicateArray.pop() || '';

        let updatedString = `${string}${num}`;

        duplicateArray.push(updatedString);

        setnumberInputX(duplicateArray);
      } else {
        let duplicateArray = [...numberInputY];
        let string = duplicateArray.pop() || '';

        let updatedString = `${string}${num}`;

        duplicateArray.push(updatedString);

        setnumberInputY(duplicateArray);
      }
    } else {
      if (isPlayerXActive) {
        setnumberInputX((prev) => [...prev, `${num}`]);
      } else {
        setnumberInputY((prev) => [...prev, `${num}`]);
      }
      setIsNumberActive(true);
    }
  };

  const handleOperatorInput = (op) => {
    if (isPlayerXActive) {
      setOperatorinputX((prev) => [...prev, op]);
    } else {
      setOperatorinputY((prev) => [...prev, op]);
    }
    setIsNumberActive(false);
  };

  const getInputLabel = (() => {
    let newString = winner || Number(isPlayerXActive ? labelRandomX : labelRandomY);
    const numberInput = isPlayerXActive ? numberInputX : numberInputY;
    const operatorInput = isPlayerXActive ? operatorinputX : operatorinputY;

    for (let i = 0; i <= operatorInput.length - 1; i++) {
      const appendOperator = `${newString} ${operatorInput[i]}`;

      newString = `${appendOperator} ${numberInput[i] || ''}`;
    }
    console.log('newString', newString);

    return newString;
  })();

  const getRandomNumber = (player) => {
    // let randomNumber = Math.floor(Math.random() * 1000);
    // randomLabel = Math.floor(Math.random() * 1000);
    let randomNumber = 100;
    randomLabel = 50;

    if (player === 'SHOW_X') {
      setExpectedResultX((prev) => [...prev, randomNumber]);
      setLabelRandomX(randomLabel);
    } else {
      setExpectedResultY((prev) => [...prev, randomNumber]);
      setLabelRandomY(randomLabel);
    }

    return randomNumber;
  };

  useEffect(() => {
    getRandomNumber('SHOW_X');
    handleStartGame();
  }, []);

  const renderingExpectedResult = (playerNumber) => {
    let expected = playerNumber === 'SHOW_X' ? expectedResultX : expectedResultY;

    if (playerNumber === 'SHOW_X') console.log('expected', expected);

    return expected.map((item, i) => {
      return <div key={i}>{item}</div>;
    });
  };

  const handleCalculteTotal = async () => {
    let result = Number(isPlayerXActive ? labelRandomX : labelRandomY);
    const operatorInput = isPlayerXActive ? operatorinputX : operatorinputY;
    const numberInput = isPlayerXActive ? numberInputX : numberInputY;
    const expectedResult = isPlayerXActive ? expectedResultX : expectedResultY;
    const setRound = isPlayerXActive ? setRoundX : setRoundY;
    const round = isPlayerXActive ? roundX : roundY;

    // TODO - Refactor to remove duplicate code
    for (let i = 0; i < operatorInput.length; i++) {
      const currentOperator = operatorInput[i];
      const nextNumber = Number(numberInput[i]);

      switch (currentOperator) {
        case '+':
          result = result + nextNumber;
          break;
        case '-':
          result = result - nextNumber;
          break;
        case '÷':
          result = result / nextNumber;
          break;
        case 'x':
          result = result * nextNumber;
          break;
      }
    }

    if (roundX == 10 && roundY + 1 == 10) {
      const winnerPlayer = totalDurationX < totalDurationY ? 'X' : 'Y';

      setRoundX(winnerPlayer);
      setRoundY(winnerPlayer);
      setWinner(winnerPlayer);

      const updateX = async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      };

      for (let i = 0; i < expectedResultX.length; i++) {
        setExpectedResultX((prev) => {
          const updatedWinner = [...prev];

          updatedWinner[i] = winnerPlayer;

          return updatedWinner;
        });

        setExpectedResultY((prev) => {
          const updatedWinner = [...prev];

          updatedWinner[i] = winnerPlayer;

          return updatedWinner;
        });

        await updateX();
      }

      return;
    }

    if (result === expectedResult[expectedResult.length - 1]) {
      console.log('HOOOHOOO YOU GOT THIS !');
      setRound((prevCount) => prevCount + 1);
      handleFinishGame();
      handleStartGame();
      resetValues();
      getRandomNumber(isPlayerXActive ? 'SHOW_Y' : 'SHOW_X');

      isPlayerXActive ? setIsPlayerXActive(false) : setIsPlayerXActive(true);
    } else {
      handleFinishGame();
      handleStartGame();
      resetValues();
    }
  };

  const resetValues = () => {
    setOperatorinputX([]);
    setOperatorinputY([]);
    setnumberInputX([]);
    setnumberInputY([]);
  };

  return (
    <div className={`${classes.top}`}>
      <div className={`${classes.wholeDiv}`}>
        <div className={`${classes.roundTop}`}>
          <div className={`${classes.round}`}>{winner || 'Rounds'}</div>
          <div className={`${classes.playerTop}`}>
            <div className={`${classes.alphaTop}`}>
              <div>{winner || 'Player X'}</div>
              <div className={`${classes.roundAlpha}`}>{roundX}</div>
            </div>
            <div className={`${classes.alphaTop}`}>
              <div>{winner || 'Player Y'}</div>
              <div className={`${classes.roundAlpha}`}>{roundY}</div>
            </div>
          </div>
        </div>
        <div className={`${classes.mainDiv}`}>
          <div className={`${classes.mainExpectedResult}`}>
            <div className={`${classes.expectedResult}`}>
              <div> Expected Result X: </div>
              <div className={`${classes.numberResult}`}> {renderingExpectedResult('SHOW_X')}</div>
            </div>
            <div className={`${classes.expectedResult}`}>
              <div> Expected Result Y: </div>
              <div className={`${classes.numberResult}`}> {renderingExpectedResult('SHOW_Y')}</div>
            </div>
          </div>
          <div className={`${classes.calculator}`}>
            <div className={`${classes.display}`}>{getInputLabel}</div>
            <div className={`${classes.buttons}`}>
              <button onClick={() => handleNumberInput(7)}>{winner || 7}</button>
              <button onClick={() => handleNumberInput(8)}>{winner || 8}</button>
              <button onClick={() => handleNumberInput(9)}>{winner || 9}</button>
              <button onClick={() => handleOperatorInput('÷')}>{winner || '÷'}</button>
              <button>{winner || null}</button>

              <button onClick={() => handleNumberInput(4)}>{winner || 4}</button>
              <button onClick={() => handleNumberInput(5)}>{winner || 5}</button>
              <button onClick={() => handleNumberInput(6)}>{winner || 6}</button>
              <button onClick={() => handleOperatorInput('x')}>{winner || 'x'}</button>
              <button>{winner || null}</button>

              <button onClick={() => handleNumberInput(1)}>{winner || 1}</button>
              <button onClick={() => handleNumberInput(2)}>{winner || 2}</button>
              <button onClick={() => handleNumberInput(3)}>{winner || 3}</button>
              <button onClick={() => handleOperatorInput('-')}>{winner || '-'}</button>
              <button onClick={handleCalculteTotal}>{winner || '='}</button>

              <button>{winner || '.'}</button>
              <button onClick={() => handleNumberInput(0)}>{winner || 0}</button>
              <button>{winner || null}</button>
              <button onClick={() => handleOperatorInput('+')}>{winner || '+'}</button>
            </div>
          </div>
        </div>
        <div className={`${classes.tableMain}`}>
          <div className={`${classes.tableTop}`}>Table</div>
          <div className={`${classes.tableType}`}>
            <div className={`${classes.pointsTop}`}>
              <div style={{ fontWeight: isPlayerXActive ? '600' : '' }}>Player X</div>
              <div>
                <div className={`${classes.points}`}>
                  {durationX.map((item, i) => {
                    return <div key={i}>{winner || item / 1000} s</div>;
                  })}
                </div>
                <div className={`${classes.totalDuration}`}>{totalDurationX / 1000} s</div>
              </div>
            </div>
            <div className={`${classes.pointsTop}`}>
              <div style={{ fontWeight: !isPlayerXActive ? '600' : '' }}>Player Y</div>
              <div>
                <div className={`${classes.points}`}>
                  {' '}
                  {durationY.map((item, i) => {
                    return <div key={i}>{winner || item / 1000} s</div>;
                  })}
                </div>
                <div className={`${classes.totalDuration}`}>{totalDurationY / 1000} s</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
