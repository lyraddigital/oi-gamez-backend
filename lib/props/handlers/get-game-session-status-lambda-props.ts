import { CorsProps } from "../cors-props";

import { LambdaHandlerProps } from "./lambda-handler-props";

export interface GetGameSessionStatusLambdaProps
  extends CorsProps,
    LambdaHandlerProps {}
