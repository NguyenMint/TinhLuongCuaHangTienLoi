export const calculatePhat = (lateMinutes, luong) => {
  
  return ((lateMinutes / 60) * luong).toFixed(2);
};
