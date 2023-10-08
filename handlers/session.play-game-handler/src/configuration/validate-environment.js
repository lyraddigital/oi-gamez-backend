import {
  verifyGameCodeLength,
  verifyDynamoTableName,
} from "@oigamez/configuration";

import { verifyConnectionWindowInSeconds } from "./connection-window-in-seconds/index.js";
import { verifyMinPlayers } from "./min-players/index.js";
import { verifyMaxPlayers } from "./max-players/index.js";

export const validateEnvironment = () => {
  verifyDynamoTableName();
  verifyGameCodeLength();
  verifyConnectionWindowInSeconds();
  verifyMinPlayers();
  verifyMaxPlayers();
};
