import { Construct } from "constructs";
import { RestApi } from "aws-cdk-lib/aws-apigateway";

import { ResourcePaths } from "../constants";
import { GameSessionRestApiProps } from "../props";

import {
  CompleteGameLambda,
  EndGameLambda,
  GetAnswerLambda,
  GetNextQuestionLambda,
  PlayGameLambda,
  StartGameLambda,
} from "./handlers";

export class GameSessionRestApi extends Construct {
  constructor(scope: Construct, id: string, props: GameSessionRestApiProps) {
    super(scope, id);

    const api = new RestApi(scope, "GameSessionApi", {
      description:
        "HTTP API that will be utilized by the Unity Game to create and manage game sessions.",
    });

    const gameResource = api.root.addResource(ResourcePaths.gameSession.game);
    const startGameResource = gameResource.addResource(
      ResourcePaths.gameSession.start
    );
    const answersResource = gameResource.addResource(
      ResourcePaths.gameSession.answers
    );
    const questionsResource = gameResource.addResource(
      ResourcePaths.gameSession.questions
    );
    const endGameResource = gameResource.addResource(
      ResourcePaths.gameSession.end
    );
    const completeGameResource = gameResource.addResource(
      ResourcePaths.gameSession.complete
    );

    new PlayGameLambda(this, "PlayGameHandler", {
      table: props.table,
      resource: gameResource,
    });

    new StartGameLambda(this, "StartGameHandler", {
      table: props.table,
      resource: startGameResource,
      webSocketApiId: props.playerSocketApi.apiId,
      webSocketAccount: props.account,
      webSocketRegion: props.region,
      webSocketStage: props.playerWebSocketStageName,
    });

    new GetAnswerLambda(this, "GetAnswerHandler", {
      table: props.table,
      resource: answersResource,
      webSocketApiId: props.playerSocketApi.apiId,
      webSocketAccount: props.account,
      webSocketRegion: props.region,
      webSocketStage: props.playerWebSocketStageName,
    });

    new GetNextQuestionLambda(this, "GetNextQuestionHandler", {
      table: props.table,
      resource: questionsResource,
      webSocketApiId: props.playerSocketApi.apiId,
      webSocketAccount: props.account,
      webSocketRegion: props.region,
      webSocketStage: props.playerWebSocketStageName,
    });

    new EndGameLambda(this, "EndGameHandler", {
      table: props.table,
      resource: endGameResource,
      webSocketApiId: props.playerSocketApi.apiId,
      webSocketAccount: props.account,
      webSocketRegion: props.region,
      webSocketStage: props.playerWebSocketStageName,
    });

    new CompleteGameLambda(this, "CompleteGameLambda", {
      table: props.table,
      resource: completeGameResource,
      webSocketApiId: props.playerSocketApi.apiId,
      webSocketAccount: props.account,
      webSocketRegion: props.region,
      webSocketStage: props.playerWebSocketStageName,
    });
  }
}
