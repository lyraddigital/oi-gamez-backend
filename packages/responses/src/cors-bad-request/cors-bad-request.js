export const corsBadRequestResponse = (errorMessages) => {
  return {
    statusCode: 400,
    headers: {
      "access-control-allow-origin": origin,
      "content-type": "application/json",
    },
    body: JSON.stringify({ errorMessages }),
  };
};
