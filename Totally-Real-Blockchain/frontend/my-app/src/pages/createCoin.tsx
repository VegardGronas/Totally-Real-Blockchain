import React, { useState } from 'react';
import '../styles/createCoin.css';

const CreateCoin: React.FC = () => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [volatility, setVolatility] = useState('');
  const [supply, setSupply] = useState('');
  const [isCrypto, setIsCrypto] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return alert('Not authenticated');

    try {
      const res = await fetch('http://localhost:3000/coin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          value: parseFloat(value),
          volatility: parseFloat(volatility),
          supply: parseInt(supply),
          isCrypto: isCrypto ? 1 : 0,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Coin created!');
        setName('');
        setValue('');
        setVolatility('');
        setSupply('');
        setIsCrypto(true);
      } else {
        alert(data.message || 'Failed to create coin');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to server');
    }
  };

  return (
    <div className="create-coin-page">
      <h2>Create a New Coin</h2>
      <form onSubmit={handleSubmit} className="create-coin-form">
        <input
          type="text"
          placeholder="Coin Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Initial Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Volatility"
          value={volatility}
          onChange={(e) => setVolatility(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Supply"
          value={supply}
          onChange={(e) => setSupply(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={isCrypto}
            onChange={() => setIsCrypto(!isCrypto)}
          />
          Is Crypto
        </label>
        <button type="submit">Create Coin</button>
      </form>
    </div>
  );
};

export default CreateCoin;
