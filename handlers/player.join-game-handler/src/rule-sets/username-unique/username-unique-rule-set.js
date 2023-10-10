export const runUniqueUsernameRuleSet = (username, existingUsernames) => {
  const isUsernameUnique = !existingUsernames.includes(
    (un) => un.toLowerCase() === username.toLowerCase()
  );

  if (!isUsernameUnique) {
    return {
      isSuccessful: false,
      errorMessges: [
        `Can't join the game session. The username is already used. Try another username`,
      ],
    };
  }

  return { isSuccessful: true };
};
