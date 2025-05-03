export interface Coin {
    id: string;
    name: string;
    creator: string;
    value: number;
    volatility: number; // e.g., 0.05 means 5% fluctuation per tick
    createdAt: number;
}  