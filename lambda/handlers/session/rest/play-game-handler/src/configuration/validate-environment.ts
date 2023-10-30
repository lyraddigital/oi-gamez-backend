import {
  verifyConnectionWindowInSeconds,
  verifyDynamoTableName,
  verifyGameCodeLength,
} from "@oigamez/configuration";

import { verifyMinPlayers } from "./min-players";
import { verifyMaxPlayers } from "./max-players";

export const validateEnvironment = (): void => {
  verifyDynamoTableName();
  verifyGameCodeLength();
  verifyConnectionWindowInSeconds();
  verifyMinPlayers();
  verifyMaxPlayers();
};
