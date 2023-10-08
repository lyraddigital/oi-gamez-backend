import {
  verifyCorsAllowedOrigin,
  verifyDynamoTableName,
  verifyGameCodeLength,
} from "@oigamez/configuration";

export const validateEnvironment = () => {
  verifyCorsAllowedOrigin();
  verifyDynamoTableName();
  verifyGameCodeLength();
};
