import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  RenovationJob: a.model({
    jobId: a.string().required(),
    prompt: a.string().required(),
    imageKey: a.string().required(),
    resultImageKey: a.string(),
    status: a.string().required(),
    createdAt: a.datetime(),
  })
});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({ schema });
