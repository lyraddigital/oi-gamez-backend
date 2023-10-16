import { verifyDynamoTableName } from "@oigamez/configuration";

import { verifyUpdatedConnectWindowInSeconds } from "./updated-connect-window/index.js";

export const validateEnvironment = (): void => {
  verifyDynamoTableName();
  verifyUpdatedConnectWindowInSeconds();
};
