import { verifyDynamoTableName } from "@oigamez/configuration";

import { verifyUpdatedConnectWindowInSeconds } from "./updated-connect-window";

export const validateEnvironment = (): void => {
  verifyDynamoTableName();
  verifyUpdatedConnectWindowInSeconds();
};
