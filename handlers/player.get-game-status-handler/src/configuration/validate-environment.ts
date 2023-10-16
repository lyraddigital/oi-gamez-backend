import {
  verifyCorsAllowedOrigin,
  verifyDynamoTableName,
  verifyGameCodeLength,
} from "@oigamez/configuration";

export const validateEnvironment = (): void => {
  verifyCorsAllowedOrigin();
  verifyDynamoTableName();
  verifyGameCodeLength();
};
