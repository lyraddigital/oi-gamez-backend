import { validateEnvironment } from "./configuration/index.js";
import { validateRequest } from "./validators/index.js";

validateEnvironment();

export const handler = async (event) => {
  try {
    const origin = event?.headers ? event.headers["origin"] : undefined;
    const gameCode = event?.pathParameters
      ? event.pathParameters["code"]
      : undefined;
    const requestValidationResult = validateRequest(origin, gameCode);

    if (!requestValidationResult.isSuccessful) {
      return {
        statusCode: 400,
        headers: {
          "access-control-allow-origin": origin,
          "content-type": "application/json",
        },
        errorMessages: requestValidationResult.errorMessages,
      };
    }

    return {
      statusCode: 200,
      headers: {
        "access-control-allow-origin": origin,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        canJoin: true,
        reason: "",
      }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        errorMessages: [
          "Unknown issue while trying to check the status of a game code.",
        ],
      }),
    };
  }
};

(async () => {
  return await handler({
    headers: { origin: "https://oigamez.com" },
    pathParameters: { code: "ABCD" },
  });
})().then((response) => console.log(response));
