import { okResponseWithData, fatalErrorResponse } from "@oigamez/responses";

import { validateEnvironment } from "./configuration/index.js";

validateEnvironment();

export const handler = async (event) => {
  try {
    return okResponseWithData({});
  } catch (e) {
    console.log(e);

    return fatalErrorResponse(
      "Unknown issue while trying to connect to the game session socket server."
    );
  }
};

(async () => {
  const event = {
    requestContext: {
      requestTimeEpoch: Date.now(),
    },
  };

  const response = await handler(event);

  console.log(response);
})();
