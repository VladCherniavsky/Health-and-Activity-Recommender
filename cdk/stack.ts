#!/usr/bin/env node
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { EndpointType } from 'aws-cdk-lib/aws-apigateway';
import {
  EnvProps,
  CdkPropsApigwLambda,
  Lambda,
  ApiGateway,
  getEnvironment,
  generateFullServiceName,
} from 'core-aws-cdk';
import { LambdaProps } from 'core-aws-cdk/bin/kit/lambda';
import { ApiGatewayProps } from 'core-aws-cdk/bin/kit/apigw';

export class AppStack extends Stack {
  recommendationLambdaFunction: Lambda;
  apiGateway: ApiGateway;
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const envProps = new EnvProps();
    const environment = getEnvironment(envProps.envName);
    const contextProps = new CdkPropsApigwLambda(this, environment, envProps.region);

    const helloWorldLambdaName = generateFullServiceName(
      contextProps.serviceName,
      'getRecommendations',
      contextProps.serviceVersion,
      envProps.envName,
    );

    this.recommendationLambdaFunction = new Lambda(this, 'GetRecommendations', {
      environment,
      functionName: helloWorldLambdaName,
      region: envProps.region,
      semanticServiceVersion: envProps.semanticServiceVersion,
      gitCommitSha: envProps.gitCommitSha,
      ...contextProps,
      handler: 'getRecommendations',
      codeSource: 'src/handlers/recommendation/handler.ts',
      functionEnvVars: {
        ...contextProps.functionEnvVars,
      },
    } as LambdaProps);

    this.apiGateway = new ApiGateway(this, 'ApiGw', {
      environment,
      endpointConfigurationType: EndpointType.EDGE,
      stageName: envProps.envName,
      oasTemplateVars: {
        recommendationLambdaArn: this.recommendationLambdaFunction.lambdaFunction.functionArn,
      },
      stageVars: {
        TEST_KEY: `${contextProps.serviceName}-${contextProps.serviceVersion}-${envProps.envName}-${envProps.gitCommitSha}`,
      },
      region: envProps.region,
      ...contextProps,
      defaultCorsPreflightOptions: {
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['*'],
      },
    } as ApiGatewayProps);

    this.recommendationLambdaFunction.lambdaFunction.addInvokePermissions(
      'apigateway.amazonaws.com',
      this.apiGateway.apiGw.arnForExecuteApi(),
    );
  }
}
