import { LambdaHandlerProps } from "./lambda-handler-props";
import { WebsocketApiConnectionEndpointProps } from "./websocket-api-connection-endpoint";

export interface EndGameLambdaProps
  extends LambdaHandlerProps,
    WebsocketApiConnectionEndpointProps {}
