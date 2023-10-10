import { CORS_ALLOWED_ORIGINS } from "@oigamez/configuration";

export const corsBadRequestResponse = (errorMessages) => {
  return {
    statusCode: 400,
    headers: {
      "access-control-allow-origin": CORS_ALLOWED_ORIGINS,
      "content-type": "application/json",
    },
    body: JSON.stringify({ errorMessages }),
  };
};
