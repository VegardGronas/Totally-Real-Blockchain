interface User {
    id: number;
    userName: string;
    password: string;
}

interface Wallet {
    wallet_id: string;
    user_id: number;
    createdAt: number;
}
  
interface WalletCoinBalance {
    id: number;
    wallet_id: string;
    coin_id: number;
    amount: number;
    updatedAt: number;
}

export type { User, Wallet, WalletCoinBalance };