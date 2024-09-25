export class PaymentReceivedDto {
  vendorEmail: string;
  vendorName: string;
  buyerName: string;
  constructionMaterial: string;
  amountPaid: number;
  contractValue?: number;
  contractTerms?: string;
  paymentDate?: string;
}
