import {
  fatalErrorResponse,
  generateEmptyOkResponse,
} from "@oigamez/responses";

import { validateEnvironment } from "./configuration/index.js";

export const handler = async (event) => {
  try {
    validateEnvironment();

    return generateEmptyOkResponse();
  } catch (e) {
    console.log(e);

    return fatalErrorResponse(
      "Unknown issue while trying to check the status of a game code."
    );
  }
};

(async () => {
  const response = await handler({});

  console.log(response);
})();
