import { BUCKET_NAME, s3 } from "./aws";

export const getObjectKey = (activityId: string) => {
  return `activities/${activityId}`;
};

const MAX_IMAGE_SIZE = 25 * 1024 * 1024;

export async function getSignredUrl(activityId: string) {
  return await s3.getSignedUrlPromise("getObject", {
    Bucket: BUCKET_NAME,
    Key: getObjectKey(activityId),
  });
}

export async function createPresignedUrl(activityId: string) {
  return await new Promise((resolve, reject) => {
    s3.createPresignedPost(
      {
        Fields: {
          key: getObjectKey(activityId),
        },
        Conditions: [
          ["starts-with", "$Content-Type", ""],
          ["content-length-range", 0, MAX_IMAGE_SIZE],
        ],
        Expires: 30,
        Bucket: BUCKET_NAME,
      },
      (err, signed) => {
        if (err) return reject(err);
        resolve(signed);
      }
    );
  });
}
