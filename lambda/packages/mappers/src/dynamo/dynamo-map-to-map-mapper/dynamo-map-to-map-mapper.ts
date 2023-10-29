import { AttributeValue } from "@aws-sdk/client-dynamodb";

export const convertDynamoMapToMapMapper = (
  dynamoMap?: Record<string, AttributeValue>
): Map<number, string> => {
  const map: Map<number, string> = new Map<number, string>();

  if (!dynamoMap) {
    return map;
  }

  Object.keys(dynamoMap).forEach((key: string) => {
    map.set(parseInt(key, 10), dynamoMap[key].S || "");
  });

  return map;
};
