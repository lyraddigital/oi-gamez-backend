import { CORS_ALLOWED_ORIGINS } from "@oigamez/configuration";

export const validateOrigin = (origin) => {
  if (!CORS_ALLOWED_ORIGINS.toLowerCase().includes(origin?.toLowerCase())) {
    return {
      isSuccessful: false,
      errorMessages: ["Not allowed to access resource. CORS ERROR"],
    };
  }

  return {
    isSuccessful: true,
  };
};
