import { handleError, handleSuccess } from "../../utility/helpers";
import instance from "../../utility/webservices";

const fundProjectWalletWithVault = async (
  amount,
  projectId,
  setLoading,
  onClose,
  refresh,
) => {
  setLoading(true);
  try {
    await instance.post(`/projects/${projectId}/vault`, { amount: amount });

    setLoading(false);
    handleSuccess("Payment successful");
    refresh();
    onClose();
  } catch (error) {
    handleError(error);
    setLoading(false);
  }
};

const fundOrder = async (
  amount,
  orderId,
  setLoading,
  onClose,
  refresh,
  paymentType,
) => {
  setLoading(true);
  try {
    await instance.patch(`/builder/order/${orderId}/pay?type=${paymentType}`, {
      amount: amount,
    });

    setLoading(false);
    handleSuccess("Payment successful");
    refresh();
    onClose();
  } catch (error) {
    handleError(error);
    setLoading(false);
  }
};

// export const PayWithVault = async (
//   amount,
//   paymentType, // FUND_PROJECT_WALLET,FUND_ORDER
//   projectId,
//   orderId,
//   setLoading,
//   onClose,
//   refresh,
// ) => {
//   const payload = {
//     amount,
//     projectId,
//     setLoading,
//     onClose,
//     refresh,
//     orderId,
//     paymentType,
//   };
//   setLoading(true);
//   try {
//     await instance.post(`/payment/vault/pay`, payload);
//     setLoading(false);
//     handleSuccess("Payment successful");
//     refresh();
//     onClose();
//   } catch (error) {
//     handleError(error);
//     setLoading(false);
//   }
// };

export { fundProjectWalletWithVault, fundOrder };
