import { Construct } from "constructs";
import { RestApi } from "aws-cdk-lib/aws-apigateway";

import { ResourcePaths } from "../constants";
import { GameSessionRestApiProps } from "../props";

import {
  EndGameLambda,
  GetAnswerLambda,
  GetNextQuestionLambda,
  PlayGameLambda,
} from "./handlers";

export class GameSessionRestApi extends Construct {
  constructor(scope: Construct, id: string, props: GameSessionRestApiProps) {
    super(scope, id);

    const api = new RestApi(scope, "GameSessionApi", {
      description:
        "HTTP API that will be utilized by the Unity Game to create and manage game sessions.",
    });

    const gameResource = api.root.addResource(ResourcePaths.gameSession.game);
    const answersResource = gameResource.addResource(
      ResourcePaths.gameSession.answers
    );
    const questionsResource = gameResource.addResource(
      ResourcePaths.gameSession.questions
    );
    const endGameResource = gameResource.addResource(
      ResourcePaths.gameSession.end
    );

    new PlayGameLambda(this, "PlayGameHandler", {
      table: props.table,
      resource: gameResource,
    });

    new GetAnswerLambda(this, "GetAnswerHandler", {
      table: props.table,
      resource: answersResource,
      webSocketApiId: "",
      webSocketAccount: props.account,
      webSocketRegion: props.region,
      webSocketStage: "",
    });

    new GetNextQuestionLambda(this, "GetNextQuestionHandler", {
      table: props.table,
      resource: questionsResource,
      webSocketApiId: "",
      webSocketAccount: props.account,
      webSocketRegion: props.region,
      webSocketStage: "",
    });

    new EndGameLambda(this, "EndGameHandler", {
      table: props.table,
      resource: endGameResource,
      webSocketApiId: "",
      webSocketAccount: props.account,
      webSocketRegion: props.region,
      webSocketStage: "",
    });
  }
}
