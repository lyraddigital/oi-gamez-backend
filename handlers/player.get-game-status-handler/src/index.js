import {
  corsBadRequestResponse,
  corsOkResponseWithData,
  fatalErrorResponse,
} from "@oigamez/responses";

import { validateEnvironment } from "./configuration/index.js";
import { validateRequest } from "./validators/index.js";

export const handler = async (event) => {
  try {
    validateEnvironment();

    const origin = event?.headers ? event.headers["origin"] : undefined;
    const gameCode = event?.pathParameters
      ? event.pathParameters["code"]
      : undefined;
    const requestValidationResult = validateRequest(origin, gameCode);

    if (!requestValidationResult.isSuccessful) {
      return corsBadRequestResponse(requestValidationResult.errorMessages);
    }

    return corsOkResponseWithData(origin, {
      canJoin: true,
      reason: "",
    });
  } catch (e) {
    return fatalErrorResponse(
      "Unknown issue while trying to check the status of a game code."
    );
  }
};

(async () => {
  return await handler({
    headers: { origin: "https://oigamez.com" },
    pathParameters: { code: "ABCD" },
  });
})().then((response) => console.log(response));
