import { dynamoFieldNames, getDynamoString } from "@oigamez/dynamodb";

export const mapFromDynamoToPlayer = (dynamoRecord) => {
  return {
    username: getDynamoString(dynamoRecord[dynamoFieldNames.player.username]),
  };
};
