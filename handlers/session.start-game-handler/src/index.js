import {
  okResponseWithData,
  fatalErrorResponse,
  badRequestResponse,
} from "@oigamez/responses";
import { validateSessionId } from "@oigamez/validators";

import { validateEnvironment } from "./configuration/index.js";

validateEnvironment();

export const handler = async (event) => {
  try {
    const sessionId = event.headers
      ? event.headers["api-session-id"]
      : undefined;

    const validationResult = validateSessionId(sessionId);

    if (!validationResult.isSuccessful) {
      return badRequestResponse(validationResult.errorMessages);
    }

    return okResponseWithData({});
  } catch (e) {
    console.log(e);

    return fatalErrorResponse("Unknown issue while trying to start the game.");
  }
};

(async () => {
  const event = {
    headers: {
      ["api-session-id"]: "owfjwoifjwofjwoifjwfi",
    },
    requestContext: {
      requestTimeEpoch: Date.now(),
    },
  };

  const response = await handler(event);

  console.log(response);
})();
