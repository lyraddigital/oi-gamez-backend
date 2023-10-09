import {
  verifyConnectionWindowInSeconds,
  verifyDynamoTableName,
  verifyGameCodeLength,
} from "@oigamez/configuration";

import { verifyMinPlayers } from "./min-players/index.js";
import { verifyMaxPlayers } from "./max-players/index.js";

export const validateEnvironment = () => {
  verifyDynamoTableName();
  verifyGameCodeLength();
  verifyConnectionWindowInSeconds();
  verifyMinPlayers();
  verifyMaxPlayers();
};
