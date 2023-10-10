import { runGameSessionRuleSet } from "./game-session/index.js";
import { runUniqueUsernameRuleSet } from "./username-unique/index.js";

export const runJoinGameRuleSet = (
  gameSession,
  username,
  existingUsernames
) => {
  const errorMessages = [];
  const gameSessionRuleResult = runGameSessionRuleSet(gameSession);
  const usernameUniqueRuleResult = runUniqueUsernameRuleSet(
    username,
    existingUsernames
  );

  if (!gameSessionRuleResult.isSuccessful) {
    errorMessages.push(...gameSessionRuleResult.errorMessages);
  }

  if (!usernameUniqueRuleResult.isSuccessful) {
    errorMessages.push(...usernameUniqueRuleResult.errorMessages);
  }

  if (errorMessages.length > 0) {
    return { isSuccessful: false, errorMessages };
  }

  return { isSuccessful: true };
};
