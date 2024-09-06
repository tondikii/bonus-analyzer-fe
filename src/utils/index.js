export const getDateMinusOneMonth = () => {
  const newDate = new Date();
  newDate.setMonth(newDate.getMonth() - 1);
  return newDate;
};
