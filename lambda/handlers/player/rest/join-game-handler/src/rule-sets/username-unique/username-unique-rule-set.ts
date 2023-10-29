import { RuleSetResult } from "@oigamez/rule-sets";

export const runUniqueUsernameRuleSet = (
  username: string,
  existingUsernames: string[]
): RuleSetResult => {
  const isUsernameUsed = existingUsernames.includes(username);

  if (isUsernameUsed) {
    return {
      isSuccessful: false,
      errorMessages: [
        `Can't join the game session. The username is already used. Try another username`,
      ],
    };
  }

  return { isSuccessful: true, errorMessages: [] };
};
