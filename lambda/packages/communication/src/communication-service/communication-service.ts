import { PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";

import { getClient } from "../client";

export const sendCommunicationEvent = async <T>(
  endpoint: string,
  connectionId: string,
  action: string,
  communicationEventPayload?: T
): Promise<void> => {
  if (connectionId && action) {
    try {
      const payload = communicationEventPayload || ({} as T);
      const command = new PostToConnectionCommand({
        ConnectionId: connectionId,
        Data: JSON.stringify({
          action,
          ...payload,
        }),
      });

      await getClient(endpoint).send(command);
    } catch (e: unknown) {
      console.log(
        "Error while trying to send a communication message to a socket",
        e
      );
    }
  }
};
