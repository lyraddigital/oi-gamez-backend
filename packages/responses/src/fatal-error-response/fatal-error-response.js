export const fatalErrorResponse = (error) => {
  return {
    statusCode: 500,
    body: JSON.stringify({
      errorMessages: [error],
    }),
  };
};
