import { DYNAMO_TABLE_NAME } from "./dynamo-table-name";

export const verifyDynamoTableName = (): void => {
  if (!DYNAMO_TABLE_NAME) {
    throw new Error("DYNAMO_TABLE_NAME environment variable is not set");
  }
};
