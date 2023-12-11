# Health and Activity Recommender


## Create an API Project & Setup
 - Clone the project
 - Install dependencies


## Development process

### Create the API Specification

- Once the Project setup is done the API specification MUST be designed, reviewed and deployed.

- Once the API is deployed in predev and tested. The development of the backend integration can be completed using x-amazon-apigateway-integration with either aws for lambda or http for proxying.

### Branching Strategy

Trunk-based branching model is used for managing development process both for backend microservices (APIs) and frontends.

[Trunk-based development](https://trunkbaseddevelopment.com/) is a branching model where all developers work on the same branch, also known as the "trunk" or "main". In trunk-based development, new features and bugfixes are developed on short-lived branches that are quickly merged into the trunk and hence it avoids merge hell. This is in contrast to other branching models, such as GitFlow which uses long-lived development branches.

#### Why Trunk-based Model
 - Time matters: We need to ensure that new features and bugfixes are delivered quickly and short-lived feature branches facilitate this.
 - Be agile: We need to be able to make changes and release them ad-hoc without waiting for other development branches to be finished.
 - Fast integration: Using long-lived development branches can lead to conflicts and delays when using the trunk-based model, we can minimise potential conflicts and ensure that changes are integrated into the trunk as soon as they are ready.
### Version Management

The APIs are semantically versioned (MAJOR.MINOR.PATCH). CI/CD pipeline uses [Semantic-release](https://github.com/semantic-release/semantic-release) NPM module, fully automated version management and package publishing.

Semantic-release uses the commit messages to determine the type of changes in the codebase. Semantic-release automatically determines the next semantic version number, generates a changelog and publishes the release.

### Commit Message Conventions

To guarantee that Semantic-release will manage to determine the next semantic version number and hence to build release candidate, a developer MUST follow at least the simplest format of the commit message like "`<type>: <subject>`".

`<type>` determines a type of code changes in a particular commit. The following type are defined:

- **build:** changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm). Doesn't trigger any release (0.0.0)
- **ci:** changes to our CI configuration files and scripts (examples: CircleCi, SauceLabs). Doesn't trigger any release (0.0.0)
- **feat:** a new feature. Corresponds to Minor release (0.1.0)
- **fix:** a bug fix. Corresponds to Patch release (0.0.1)
- **docs:** documentation only changes. Doesn't trigger any release (0.0.0)
- **refactor:** a code change that neither fixes a bug nor adds a feature. Doesn't trigger any release (0.0.0)
- **test:** adding missing tests or correcting existing tests. Doesn't trigger any release (0.0.0)

In addition three extra types were configured to simplify semantic version manipulation:

- **patch:** corresponds to Patch release (0.0.1)
- **minor:** corresponds to Minor release (0.1.0)
- **major:** corresponds to Major release (1.0.0)

`<subject>` is just an informative commit message


## Quality checks

To keep permanent quality of code, the following settings were done in the current template

### Git Hook: Pre-Commit

- This hook was set up to run eslint checks and unit tests. It takes no parameters, and is invoked before obtaining the proposed commit log message and making a commit.
- Exiting with a non-zero status from this script causes the `git commit` command to abort before creating a commit.
- In case of strong necessity it can be bypassed with the `--no-verify` option.

## Run Lambda functions locally

When developing Lambda functions, you can use the AWS SAM CLI to test it without needing to deploy it.

### Prerequisites

The following is required to run Lambda functions locally:

- Install [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- Install [Docker Engine](https://docs.docker.com/engine/install/)
- Install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

### Locally testing AWS CDK applications

You can use the AWS SAM CLI to locally test your AWS CDK applications by running the following commands from the project root directory of your AWS CDK application:

- [sam local invoke](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-local-invoke.html)
- [sam local start-api](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-local-start-api.html)
- [sam local start-lambda](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-local-start-lambda.html)

Before you run any of the `sam local` commands with a AWS CDK application, you **must run** `npm run cdk -- synth --no-staging`. By default it will be run for _dev_ environment and _us-east-1_ AWS region. If synth need to be run for another environment, the following environment variables should be exported:

- AWS_DEFAULT_REGION=<aws_region>
- ENVIRONMENT=<env_name>

When running `sam local invoke` you need **the function construct identifier** that you want to invoke, and the **path to your synthesized AWS CloudFormation template**.

**Usage:**

```
# Invoke the function FUNCTION_IDENTIFIER declared in the stack STACK_NAME
sam local invoke -t ./cdk.out/STACK_NAME.template.json [OPTIONS] FUNCTION_IDENTIFIER

# Start all APIs declared in the AWS CDK application in the stack STACK_NAME
sam local start-api -t ./cdk.out/STACK_NAME.template.json [OPTIONS]

# Start a local endpoint that emulates AWS Lambda in the stack STACK_NAME
sam local start-lambda -t ./cdk.out/STACK_NAME.template.json [OPTIONS]
```

For more information, see the documentation:

- [Getting started with AWS SAM and the AWS CDK](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-cdk-getting-started.html)
- [Using sam local](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-local.html)
- [Testing and debugging serverless applications](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-test-and-debug.html)

#### sam local invoke

You can invoke your AWS Lambda function locally by using the [sam local invoke](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-local-invoke.html) AWS SAM CLI command and providing the function's logical ID and [an event file](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-invoke.html#serverless-sam-cli-using-invoke-environment-file). Alternatively, `sam local invoke` also accepts `stdin` as an event

_Template example:_

`sam local invoke HelloWorldLambdaFunctionEB0A81D8 --no-event -t ./cdk.out/AppStack.template.json`

#### sam local start-api

To start a local instance of Amazon API Gateway that you can use to test HTTP request/response functionality, use the [sam local start-api](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-local-start-api.html) AWS SAM CLI command. This functionality features hot reloading so that you can quickly develop and iterate over your functions.

_Template example:_

`sam local start-api -t ./cdk.out/AppStack.template.json --warm-containers eager`
or simply run
`npm run api:local`

This command starts a local API endpoint at http://127.0.0.1:3000 that emulates Amazon API Gateway

#### sam local start-lambda

The [sam local start-lambda](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-local-start-lambda.html) command starts a local endpoint that emulates the AWS Lambda invoke endpoint. You can invoke it directly using a SDK or the AWS CLI or from your automated tests

_Template example:_

`sam local start-lambda -t ./cdk.out/AppStack.template.json`

This command starts a local endpoint at http://127.0.0.1:3001 that emulates AWS Lambda

## AWS Cloud Development Kit (AWS CDK)

[Developer Guide](https://docs.aws.amazon.com/cdk/v2/guide/home.html) |
[CDK Workshop](https://cdkworkshop.com/) |
[Getting Started](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html) |
[API Reference](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html) |
[Examples](https://github.com/aws-samples/aws-cdk-examples) |

The **AWS Cloud Development Kit (AWS CDK)** is an open-source software development
framework to define cloud infrastructure in code and provision it through AWS CloudFormation.
It offers a high-level object-oriented abstraction to define AWS resources imperatively using
the power of modern programming languages.

Developers use the [CDK framework] to define reusable cloud components called [constructs],
which are composed together into [stacks], forming a "CDK app".

[cdk framework]: https://docs.aws.amazon.com/cdk/api/v2/
[constructs]: https://docs.aws.amazon.com/cdk/v2/guide/constructs.html
[stacks]: https://docs.aws.amazon.com/cdk/v2/guide/stacks.html
