const runGameSessionRuleSet = (gameSession) => {
  if (!gameSession) {
    return {
      isSuccessful: false,
      errorMessage: "Cannot connect to game. No game was found.",
    };
  }

  return { isSuccessful: true };
};

export default runGameSessionRuleSet;
