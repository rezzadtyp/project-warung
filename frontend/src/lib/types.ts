export type UserRole = 'merchant' | 'user';

export interface Chat {
  id: string;
  title: string;
  preview: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Transaction {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  from: string;
  to: string;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  role: UserRole | null;
}