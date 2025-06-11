export const formatCurrency = (amount) => {
  const amountNumber = Number(amount);
  return amountNumber.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
export const formatTime = (timeString) => {
    return timeString.slice(0,5);
};