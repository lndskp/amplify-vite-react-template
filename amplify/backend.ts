import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { renovationProcessor } from './functions/renovation-processor/resource';

const backend = defineBackend({
  data,
  storage,
  renovationProcessor
});

// Grant Lambda access to S3 and Bedrock
backend.renovationProcessor.resources.lambda.addToRolePolicy({
  effect: "Allow",
  actions: [
    "s3:GetObject",
    "s3:PutObject"
  ],
  resources: ["*"] // Scope this to your bucket in production
});

backend.renovationProcessor.resources.lambda.addToRolePolicy({
  effect: "Allow",
  actions: [
    "bedrock:InvokeModel"
  ],
  resources: ["*"] // Scope this to specific models in production
});
