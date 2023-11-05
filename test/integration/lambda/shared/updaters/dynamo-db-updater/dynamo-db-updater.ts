import {
  AttributeValue,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";

import { dbClient } from "../../dynamodb/client";
import { DYNAMO_DB_TABLE } from "../../environment";

export class DynamoDbUpdater {
  protected async executeUpdate(
    pk: AttributeValue,
    sk: AttributeValue,
    updateExpression: string,
    expressionAttributeNames: Record<string, string>,
    expressionAttributeValues: Record<string, AttributeValue>
  ): Promise<void> {
    const updateItemCommandInput: UpdateItemCommandInput = {
      TableName: DYNAMO_DB_TABLE,
      UpdateExpression: updateExpression,
      Key: {
        PK: pk,
        SK: sk,
      },
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    const updateItemCommand = new UpdateItemCommand(updateItemCommandInput);
    await dbClient.send(updateItemCommand);
  }
}
