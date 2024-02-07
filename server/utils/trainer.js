import { 
  GetObjectAclCommand,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  RestoreRequestFilterSensitiveLog,
  DeleteObjectCommand
 } from "@aws-sdk/client-s3";
import s3Client from "./s3Client";

const config = useRuntimeConfig();

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

/** トレーナーの一覧の取得 */
export const findTrainers = async () => {
  const objects = await s3Client.send(
    new ListObjectsCommand({ Bucket: config.bucketName }),
  );
  return objects.Contents ?? [];
};

/** トレーナーの取得 */
// [x]TODO: トレーナーを取得する S3 クライアント処理の実装
export const findTrainer = async (name) => {
  const bucketParams ={
    Bucket: config.bucketName,
    Key:`${name}.json`,
  }
  const object = await s3Client.send(
    new GetObjectCommand(bucketParams)
  );
  const trainer = JSON.parse(await streamToString(object.Body));
  console.log("🚀 ~ file: trainer.js:34 ~ findTrainer ~ trainer:", trainer)
  
  return trainer;
}

/** トレーナーの追加更新 */
export const upsertTrainer = async (name, trainer) => {
  const result = await s3Client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: `${name}.json`,
      Body: JSON.stringify({ name: "", pokemons: [], ...trainer }),
    }),
  );
  return result;
};

/** トレーナーの削除 */
// [ ] TODO: トレーナーを削除する S3 クライアント処理の実装
export const deleteTrainer = async(name) => {
  const bucketParams ={
    Bucket: config.bucketName,
    Key:`${name}.json`,
  }
  const result = await s3Client.send(
    new DeleteObjectCommand(bucketParams)
  );
  return result;
}
