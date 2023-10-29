#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { OiGamezBackendStack } from "../lib/oi-gamez-backend-stack";

const app = new cdk.App();
new OiGamezBackendStack(app, "OiGamezBackendStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
