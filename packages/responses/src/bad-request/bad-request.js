export const badRequestResponse = (errorMessages) => {
  return {
    statusCode: 400,
    body: JSON.stringify({ errorMessages }),
  };
};
