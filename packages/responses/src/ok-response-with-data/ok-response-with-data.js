export const okResponseWithData = (data) => {
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
