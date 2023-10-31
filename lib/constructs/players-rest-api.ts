import { Construct } from "constructs";
import { RestApi } from "aws-cdk-lib/aws-apigateway";

import { HeaderNames, ResourcePaths } from "../constants";
import { PlayersRestApiProps } from "../props";

import { CorsResource } from "./api-resources";
import {
  ChooseOptionLambda,
  GetGameSessionStatusLambda,
  JoinGameLambda,
} from "./handlers";

export class PlayersRestApi extends Construct {
  constructor(scope: Construct, id: string, props: PlayersRestApiProps) {
    super(scope, id);

    const allowedOrigins = "https://oigamez.com";
    const api = new RestApi(scope, "PlayerApi", {
      description:
        "HTTP API that will be utilized by the Web application for players so that they can join and participate in games.",
    });

    const gameResource = api.root.addResource(ResourcePaths.player.game);
    const gameCodeResource = gameResource.addResource(
      ResourcePaths.player.gameCode
    );
    const statusResource = gameCodeResource.addResource(
      ResourcePaths.player.status
    );

    const playersCorsResource = new CorsResource(this, "PlayersCorsResource", {
      parentResource: gameCodeResource,
      resourceName: ResourcePaths.player.players,
      allowedOrigins,
    });

    const choicesResource = new CorsResource(this, "ChoicesCorsResource", {
      parentResource: api.root,
      resourceName: ResourcePaths.player.choices,
      allowedOrigins: allowedOrigins,
      allowedHeaders: HeaderNames.all.apiSessionId,
    });

    new JoinGameLambda(this, "JoinGameHandler", {
      table: props.table,
      resource: playersCorsResource.resource,
      allowedOrigins,
    });

    new GetGameSessionStatusLambda(this, "GetGameSessionStatusHandler", {
      table: props.table,
      resource: statusResource,
      allowedOrigins,
    });

    new ChooseOptionLambda(this, "ChooseOptionHandler", {
      table: props.table,
      resource: choicesResource.resource,
      allowedOrigins,
    });
  }
}
