import React, { useState } from 'react';

// Simple math CAPTCHA for demo
const generateCaptcha = () => {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, answer: a + b };
};

const Captcha: React.FC<{ onValidate: (valid: boolean) => void }> = ({ onValidate }) => {
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleCheck = () => {
    if (parseInt(input) === captcha.answer) {
      setError('');
      onValidate(true);
    } else {
      setError('Incorrect answer. Try again.');
      setCaptcha(generateCaptcha());
      setInput('');
      onValidate(false);
    }
  };

  return (
    <div className="mb-2">
      <label className="block text-xs text-chocolate-light mb-1">Anti-spam: What is {captcha.a} + {captcha.b}?</label>
      <div className="flex gap-2 items-center">
        <input
          type="number"
          className="border rounded px-2 py-1 w-20"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="button" className="bg-chocolate text-cream px-2 py-1 rounded text-xs" onClick={handleCheck}>
          Check
        </button>
      </div>
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  );
};

export default Captcha;
