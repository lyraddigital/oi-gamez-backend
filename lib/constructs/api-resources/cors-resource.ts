import { Construct } from "constructs";

import { HeaderNames } from "../../constants";
import { CorsResourceProps } from "../../props";
import { IResource } from "aws-cdk-lib/aws-apigateway";

export class CorsResource extends Construct {
  public resource: IResource;

  constructor(scope: Construct, id: string, props: CorsResourceProps) {
    super(scope, id);

    const allowedHeaders = [HeaderNames.all.contentType];
    const hasCorsHeaders = !!props.allowedHeaders;

    if (hasCorsHeaders) {
      allowedHeaders.push(props.allowedHeaders!);
    }

    this.resource = props.parentResource.addResource(props.resourceName, {
      defaultCorsPreflightOptions: {
        allowOrigins: [props.allowedOrigins],
        allowHeaders: allowedHeaders,
      },
    });
  }
}
