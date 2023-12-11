import { App } from 'aws-cdk-lib';
import { AppStack } from './stack';

const { AWS_ACCOUNT: account, AWS_DEFAULT_REGION: region, ENVIRONMENT: envName } = process.env;
const environment = { account, region };

const app = new App();
const { serviceName } = app.node.tryGetContext('props');

new AppStack(app, 'AppStack', {
  env: environment,
  stackName: `${serviceName}-stack-${envName}`,
  description: 'Health and Activity Recommender',
});
