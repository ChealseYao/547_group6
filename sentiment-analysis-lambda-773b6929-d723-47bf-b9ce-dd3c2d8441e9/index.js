const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const comprehend = new AWS.Comprehend();

const languageCode = process.env.COMPREHEND_LANG || "en";

exports.handler = async (event) => {
    try {
        console.log("Received S3 event:", JSON.stringify(event, null, 2));

        // 从 S3 事件中提取文件信息
        const record = event.Records[0]; // 每次触发处理一个文件
        const bucketName = record.s3.bucket.name;
        const s3Key = record.s3.object.key;

        console.log(`Processing file from bucket: ${bucketName}, key: ${s3Key}`);

        // 获取文件内容
        const data = await s3.getObject({ Bucket: bucketName, Key: s3Key }).promise();
        const rawData = JSON.parse(data.Body.toString());

        // 执行情感分析
        const results = await Promise.all(
            rawData.map(async (item) => {
                const params = {
                    Text: item.text,
                    LanguageCode: languageCode,
                };
                const sentiment = await comprehend.detectSentiment(params).promise();
                return {
                    text: item.text,
                    sentiment: sentiment.Sentiment,
                    sentimentScore: sentiment.SentimentScore,
                };
            })
        );

        console.log("Analysis results:", results);

        // 保存结果到 S3
        const resultKey = `analysis_results/${s3Key.split("/").pop()}`;
        await s3.putObject({
            Bucket: bucketName,
            Key: resultKey,
            Body: JSON.stringify(results, null, 2),
            ContentType: "application/json",
        }).promise();

        console.log(`Results saved to S3: ${resultKey}`);

        return {
            status: "success",
            message: `Sentiment analysis completed for file: ${s3Key}`,
            resultKey,
        };
    } catch (error) {
        console.error("Error processing S3 event:", error);
        return {
            status: "error",
            message: error.message,
        };
    }
};
