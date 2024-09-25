import { Order } from 'sequelize';
import { FundManager } from 'src/modules/fund-manager/models/fundManager.model';
import { OrderStatus } from 'src/modules/order/models';
import { BidStatus } from 'src/modules/project/models/project-tender-bids.model';
import { Project } from 'src/modules/project/models/project.model';
import { RfqQuote, RfqRequestPaymentTerm } from 'src/modules/rfq/models';

export type BuilderOrderType = {
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

export type bestCat = {
  title: string;
  id: string;
  total: number;
};

export type ICompanyProject = {
  allProjects: number;
  activeProjects: number;
  pendingProjects: number;
  completedProjects: number;
  transactionResolutionProjects: number;
};

export type SubmittedBids = {
  id: string;
  projectTenderId: string;
  projectId: string;
  fundManagerName: string;
  logo: string;
  projectName: string;
  tenderType: string;
  location: string;
  startDate: Date;
  status: BidStatus;
};

export type ExtendedSubmittedBids = Pick<
  SubmittedBids,
  | 'id'
  | 'projectTenderId'
  | 'projectId'
  | 'fundManagerName'
  | 'logo'
  | 'location'
  | 'startDate'
  | 'status'
  | 'projectName'
> & {
  projectType: string;
  projectTenders?: Record<string, string>[];
  description: string;
  fundManager: Record<string, string>;
};

export type FundManagersResponseData = {
  completedProjectsCount: number;
  id: string;
  FundManagerId: string;
  BuilderId: string;
  ProjectId: string;
  createdAt: Date;
  updatedAt: Date;
  CreatedById: string;
  FundManager: Partial<FundManager> | null;
  Project: Partial<Project> | null;
};
export type MyFundManagersResponseData = {
  FundManagers: unknown[] | null;
  totalFundManagersLength: number;
};

export type vendorBid = {
  quoteId: string;
  vendorName: string;
  quantity: number;
  amount: number;
  deliveryDate: Date;
};

export type rfqMaterialDetails = {
  title: string;
  id: string;
  category: string;
  budget: number;
  deliveryAddress: string;
  estimatedDeliveryDate: Date;
  ongoing: number;
  completed: number;
  paymentType: RfqRequestPaymentTerm;
  bids: vendorBid[];
};

export type BuilderRfqOrderType = Omit<rfqMaterialDetails, 'bids' | 'title'> & {
  rfqMaterialName: string;
  amount: number;
  totalQuantity: number;
  metric: string | null;
  vendorName: string;
  deliverySchedule_Orders: {
    id: string;
    status: string;
    quantity: number;
    description: string;
    deliveryDate: Date;
  }[];
};
