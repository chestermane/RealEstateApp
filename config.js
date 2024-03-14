const SES = require("aws-sdk/clients/ses");

const AWS_ACCESS_KEY_ID = "AKIAYFRBAZPDHORF6UFW";
const AWS_SECRET_ACCESS_KEY = "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";

const EMAIL_FROM = "chestermane@gmail.com";
const EMAIL_TO = "evan.chesterman@icloud.com";

const awsConfig = {
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
  apiVersion: "2010-12-01",
};
const sesConnection = new SES(awsConfig);

const JWT_SECRET = "4309dfdagkljlfsdajlkj";

module.exports = { sesConnection, EMAIL_FROM, EMAIL_TO, JWT_SECRET };
