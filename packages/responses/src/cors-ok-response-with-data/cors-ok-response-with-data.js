export const corsOkResponseWithData = (origin, data) => {
  return {
    statusCode: 200,
    headers: {
      "access-control-allow-origin": origin,
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  };
};
