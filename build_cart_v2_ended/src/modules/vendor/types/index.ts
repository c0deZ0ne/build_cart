export type VendorTransactionType = {
  id: string;
  description: string;
  amount: number;
  paymentType: string;
  status: string;
  date: Date;
  type: string;
  customerName: string;
  itemName?: string;
};

export type vendorWalletData = {
  currentBalance: number;
  id: string;
  escrowIncome: number;
  withdrawals: number;
};
