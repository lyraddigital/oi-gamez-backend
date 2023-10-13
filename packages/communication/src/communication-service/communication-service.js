import { PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";

import { client } from "../client/index.js";

export const sendCommunicationEvent = async (
  connectionId,
  action,
  communicationEventPayload
) => {
  if (connectionId && action) {
    const payload = communicationEventPayload || {};
    const command = new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: JSON.stringify({
        action,
        ...payload,
      }),
    });

    await client.send(command);
  }
};
