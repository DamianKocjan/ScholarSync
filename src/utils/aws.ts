import * as aws from "aws-sdk";
import { env } from "~/env.mjs";

export const BUCKET_NAME = "thisplace-hackheroes";

aws.config.update({
  accessKeyId: "idk", //env.AMAZON_WS_ACCESS_KEY_ID,
  secretAccessKey: "idk",//env.AMAZON_WS_SECRET_ACCESS_KEY,
  region: "idk", //env.AMAZON_WS_REGION,
  signatureVersion: "v4",
});

aws.config.credentials = new aws.CognitoIdentityCredentials({
  IdentityPoolId: "no", //,
});

export const AWS = aws;

export const s3 = new aws.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: BUCKET_NAME },
});
