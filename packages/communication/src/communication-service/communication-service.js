import { PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";

import { getClient } from "../client/index.js";

export const sendCommunicationEvent = async (
  endpoint,
  connectionId,
  action,
  communicationEventPayload
) => {
  if (connectionId && action) {
    try {
      const payload = communicationEventPayload || {};
      const command = new PostToConnectionCommand({
        ConnectionId: connectionId,
        Data: JSON.stringify({
          action,
          ...payload,
        }),
      });

      await getClient(endpoint).send(command);
    } catch (e) {
      console.log(
        "Error while trying to send a communication message to a socket",
        e
      );
    }
  }
};
