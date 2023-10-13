export const runUniqueUsernameRuleSet = (username, existingUsernames) => {
  const isUsernameUsed = existingUsernames.includes(username);

  if (isUsernameUsed) {
    return {
      isSuccessful: false,
      errorMessages: [
        `Can't join the game session. The username is already used. Try another username`,
      ],
    };
  }

  return { isSuccessful: true };
};
