import { WebsocketApiConnectionEndpointProps } from "./websocket-api-connection-endpoint";
import { LambdaHandlerProps } from "./lambda-handler-props";

export interface CompleteGameLambdaProps
  extends LambdaHandlerProps,
    WebsocketApiConnectionEndpointProps {}
