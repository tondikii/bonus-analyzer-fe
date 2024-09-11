export const getDateMinusOneMonth = () => {
  const newDate = new Date();
  newDate.setMonth(newDate.getMonth() - 1);
  return newDate;
};

export const validateEmail = (str = "") => /.+@.+\..+/.test(str);

export const validatePassword = (str = "") => str.length > 6;
