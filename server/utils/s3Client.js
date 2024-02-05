import { S3Client } from "@aws-sdk/client-s3";
import {NodeHttpHandler} from "@aws-sdk/node-http-handler"
import { ProxyAgent } from "proxy-agent";

const config = useRuntimeConfig();
// const s3Client = new S3Client({ region: config.region });
const agent =new ProxyAgent();


//PROXY対策入りのS3Client
const s3Client = new S3Client({
    region:config.region,
    requestHandler: new NodeHttpHandler({
        httpAgent: agent,
        httpsAgent: agent,
    }),
});

export default s3Client;
