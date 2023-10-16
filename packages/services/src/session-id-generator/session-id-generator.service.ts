import { v4 } from "uuid";

export const createUniqueSessionId = () => {
  return v4().replaceAll("-", "");
};
