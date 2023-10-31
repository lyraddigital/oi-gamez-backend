import { LambdaHandlerProps } from "./lambda-handler-props";
import { WebsocketApiConnectionEndpointProps } from "./websocket-api-connection-endpoint";

export interface StartGameLambdaProps
  extends LambdaHandlerProps,
    WebsocketApiConnectionEndpointProps {}
