import { v4 } from "uuid";

const createUniqueSessionId = () => {
  return v4().replaceAll("-", "");
};

export default createUniqueSessionId;
