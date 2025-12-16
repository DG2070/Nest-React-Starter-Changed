export const generatePaymentUUID = (): string => {
  const timestamp = Date.now();
  return `Payment-${timestamp}`;
};

//you can return uuid including different data related to the current payment being done
//for an example : RECRUIT-${vacancyId}-${applicationId}-${userId}-${timestamp}
