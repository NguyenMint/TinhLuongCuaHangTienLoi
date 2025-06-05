export const formatCurrency = (amount) => {
  const amountNumber = Number(amount);
  return amountNumber.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};
