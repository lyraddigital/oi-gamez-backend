import {
  verifyCorsAllowedOrigin,
  verifyConnectionWindowInSeconds,
  verifyDynamoTableName,
  verifyGameCodeLength,
} from "@oigamez/configuration";

export const validateEnvironment = () => {
  verifyCorsAllowedOrigin();
  verifyConnectionWindowInSeconds();
  verifyDynamoTableName();
  verifyGameCodeLength();
};
