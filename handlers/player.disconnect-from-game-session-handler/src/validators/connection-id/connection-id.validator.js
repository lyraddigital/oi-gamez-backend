export const validateConnectionId = (connectionId) => {
  if (!connectionId) {
    return {
      isSuccessful: false,
      errorMessages: [
        "Connection id could not be found. Make sure you've sent it",
      ],
    };
  }

  return { isSuccessful: true };
};
