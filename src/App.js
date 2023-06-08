import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [typedKeys, setTypedKeys] = useState('');
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [firstMistakeFound, setFirstMistakeFound] = useState(false);

  const targetSentence = 'asdfjkl';
  const accuracy = Math.floor((score / (score + mistakes)) * 100);

  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;

      if (key === 'Backspace') {
        if (typedKeys.length > 0) {
          const lastKey = typedKeys.slice(-1);
          setTypedKeys((typedKeys) => typedKeys.slice(0, -1));

          if (!targetSentence.includes(typedKeys.slice(0, -1) + lastKey)) {
            if (firstMistakeFound) {
              setMistakes((mistakes) => Math.max(mistakes - 1, 0));
            } else {
              setFirstMistakeFound(true);
            }
          }
        }
      } else if (/^[a-zA-Z0-9 ]$/.test(key)) {
        const newTypedKeys = typedKeys + key;
        setTypedKeys(newTypedKeys);

        if (targetSentence.startsWith(newTypedKeys)) {
          setScore(newTypedKeys.length);
          setFirstMistakeFound(false);
        } else {
          if (!firstMistakeFound) {
            setMistakes((mistakes) => mistakes + 1);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [typedKeys, firstMistakeFound]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    const diff = value.length - typedKeys.length;

    if (diff > 0) {
      const newTypedKeys = typedKeys + value.slice(-diff);

      if (targetSentence.startsWith(newTypedKeys)) {
        setTypedKeys(newTypedKeys);
        setScore(newTypedKeys.length);
        setFirstMistakeFound(false);
      } else {
        if (!firstMistakeFound) {
          // setMistakes((mistakes) => mistakes + diff);
        }
      }
    } else if (diff < 0) {
      const deletedKeys = typedKeys.slice(diff);
      setTypedKeys((typedKeys) => typedKeys.slice(0, diff));

      if (!targetSentence.includes(typedKeys.slice(0, diff))) {
        if (firstMistakeFound) {
          setMistakes((mistakes) => Math.max(mistakes - deletedKeys.length, 0));
        } else {
          setFirstMistakeFound(true);
        }
      }
    }
  };

  const handleInputClick = () => {
    inputRef.current.focus();
  };

  const handleReset = () => {
    setTypedKeys('');
    setScore(0);
    setMistakes(0);
    setFirstMistakeFound(false);
    inputRef.current.value = '';
    inputRef.current.focus();
  };

  return (
    <div className="App">
      <h1>Touch Typing Practice</h1>
      <h2>Type the following sentence:</h2>
      <p>{targetSentence}</p>
      <input
        ref={inputRef}
        type="text"
        placeholder={targetSentence
          .split('')
          .map((char) => (/^[a-zA-Z0-9 ]$/.test(char) ? char : ''))
          .slice(0, typedKeys.length)
          .join('')}
        value={typedKeys}
        onChange={handleInputChange}
        onClick={handleInputClick}
        className={firstMistakeFound ? 'input-error' : ''}
      />
      <p>Accuracy: {accuracy}%</p>
      <p>Score: {score}</p>
      <p>Mistakes: {mistakes}</p>
      <button onClick={handleReset}>Reset</button>

     
    </div>
  );
};

export default App;
