import { Coin } from '../models/coin';

const coins: Coin[] = [];

export function createCoin(name: string, creator: string): Coin {
  const coin: Coin = {
    id: Date.now().toString(),
    name,
    creator,
    value: Math.random() * 0.1 + 0.01, // random start value
    volatility: Math.random() * 0.2,   // 0 to 20%
    createdAt: Date.now()
  };

  coins.push(coin);
  return coin;
}

export function getCoins(): Coin[] {
  return coins;
}
