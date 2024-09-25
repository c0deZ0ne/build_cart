import { Order } from 'src/modules/order/models';

export type SupplierType = {
  VendorId: string;
  name: string;
  totalSpent: number;
  logo: string;
  location: string;
};

export type FundManagerOrderType = {
  VendorId: string;
  name: string;
  totalCost: number;
  totalBudget: number;
  margin: number;
  logo: string;
  location: string;
  VendorOrders?: Order[];
  vat: number;
  totalNumberOfPayment: number;
};

export enum FundOrderType {
  VAULT = 'vault',
  PROJECT_WALLET = 'projecWallet',
}
