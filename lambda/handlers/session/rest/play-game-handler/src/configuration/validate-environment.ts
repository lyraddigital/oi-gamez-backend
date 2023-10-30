import { verifyDynamoTableName } from "@oigamez/configuration/dynamo-table-name";
import { verifyConnectionWindowInSeconds } from "@oigamez/configuration/connect-window-in-seconds";
import { verifyGameCodeLength } from "@oigamez/configuration/game-code-length";

import { verifyMinPlayers } from "./min-players";
import { verifyMaxPlayers } from "./max-players";

export const validateEnvironment = (): void => {
  verifyDynamoTableName();
  verifyGameCodeLength();
  verifyConnectionWindowInSeconds();
  verifyMinPlayers();
  verifyMaxPlayers();
};
