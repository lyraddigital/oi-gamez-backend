import {
  AttributeValue,
  GetItemCommand,
  GetItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { dbClient } from "../client";

export class DynamoDbQuery {
  private tableName: string =
    "OiGamezBackendStack-GameTableOIGamezData59BA9E79-1P0RG3ZPC2J6M";

  protected async executeGet(
    pk: AttributeValue,
    sk: AttributeValue
  ): Promise<Record<string, AttributeValue> | undefined> {
    const getItemCommandInput: GetItemCommandInput = {
      TableName: this.tableName,
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
