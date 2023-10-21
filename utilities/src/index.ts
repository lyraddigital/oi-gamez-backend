import { ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";
import { DYNAMO_TABLE_NAME } from "@oigamez/configuration";
import { dbClient } from "@oigamez/dynamodb";

const scanTable = async () => {
  const input: ScanCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
  };

  const command = new ScanCommand(input);
  const response = await dbClient.send(command);

  console.log(
    JSON.stringify(
      response.Items.filter((i) => i["SessionId"]?.S).map((i) => ({
        sessionId: i["SessionId"]?.S,
        gameCode: i["GameCode"]?.S,
        status: i["Status"]?.S,
      })),
      undefined,
      2
    )
  );
};

(async () => {
  await scanTable();
})();
