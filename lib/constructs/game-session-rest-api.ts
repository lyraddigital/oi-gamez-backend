import { Construct } from "constructs";
import { RestApi } from "aws-cdk-lib/aws-apigateway";

import { ResourcePaths } from "../constants";
import { GameSessionRestApiProps } from "../props";
import { PlayGameLambda } from "./handlers";

export class GameSessionRestApi extends Construct {
  public stageName: string;

  constructor(scope: Construct, id: string, props: GameSessionRestApiProps) {
    super(scope, id);

    const api = new RestApi(scope, "GameSessionApi", {
      description:
        "HTTP API that will be utilized by the Unity Game to create and manage game sessions.",
    });

    const gameResource = api.root.addResource(ResourcePaths.gameSession.game);
    // const answersResource = gameResource.addResource(
    //   resourcePaths.gameSession.answers
    // );
    // const questionsResource = gameResource.addResource(
    //   resourcePaths.gameSession.questions
    // );
    // const endGameResource = gameResource.addResource(
    //   resourcePaths.gameSession.end
    // );

    new PlayGameLambda(this, "PlayGameHandler", {
      table: props.table,
      resource: gameResource,
    });
  }
}
