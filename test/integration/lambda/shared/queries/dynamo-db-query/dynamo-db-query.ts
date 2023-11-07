import {
  AttributeValue,
  GetItemCommand,
  GetItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { setTimeout } from "node:timers/promises";

import { dbClient } from "../../dynamodb/client";
import { DYNAMO_DB_TABLE } from "../../environment";

export class DynamoDbQuery {
  protected async executeGet(
    pk: AttributeValue,
    sk: AttributeValue
  ): Promise<Record<string, AttributeValue> | undefined> {
    await setTimeout(1000);

    const getItemCommandInput: GetItemCommandInput = {
      TableName: DYNAMO_DB_TABLE,
      Key: {
        PK: pk,
        SK: sk,
      },
    };

    const getItemCommand = new GetItemCommand(getItemCommandInput);
    const response = await dbClient.send(getItemCommand);

    return response?.Item;
  }
}
