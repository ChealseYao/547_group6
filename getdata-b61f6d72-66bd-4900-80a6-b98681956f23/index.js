const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.handler = async (event) => {
  const bucketName = "bluesky-data-ee547"; // 替换为你的 S3 存储桶名称
  const prefix = "analysis_results/"; // 文件存储的目录路径
  const year = event.queryStringParameters?.year || "2024"; // 用户输入的年份，默认 2024 年
  const month = event.queryStringParameters?.month || "11"; // 用户输入的月份，默认 11 月

  try {
    // 列出 S3 中指定前缀的文件
    const listParams = {
      Bucket: bucketName,
      Prefix: prefix,
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    // 筛选出符合条件的文件（year-month-XX）
    const filteredKeys = listedObjects.Contents.filter((file) =>
      file.Key.includes(`${year}-${month}`)
    ).map((file) => file.Key);

    // 如果没有找到任何文件
    if (filteredKeys.length === 0) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // 确保 CORS Header 始终存在
          "Access-Control-Allow-Methods": "GET,OPTIONS", // 支持的 HTTP 方法
          "Access-Control-Allow-Headers": "Content-Type,Authorization", // 必要的请求头
        },
        body: JSON.stringify({ message: `No files found for ${year}-${month}` }),
      };
    }

    // 获取每个文件的内容
    const fileContents = await Promise.all(
      filteredKeys.map(async (key) => {
        const fileData = await s3
          .getObject({ Bucket: bucketName, Key: key })
          .promise();
        return { fileName: key, content: JSON.parse(fileData.Body.toString()) };
      })
    );

    // 返回结果
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // 确保 CORS Header 始终存在
        "Access-Control-Allow-Methods": "GET,OPTIONS", // 支持的 HTTP 方法
        "Access-Control-Allow-Headers": "Content-Type,Authorization", // 必要的请求头
      },
      body: JSON.stringify(fileContents),
    };
  } catch (error) {
    console.error("Error retrieving data from S3:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // 确保 CORS Header 始终存在
        "Access-Control-Allow-Methods": "GET,OPTIONS", // 支持的 HTTP 方法
        "Access-Control-Allow-Headers": "Content-Type,Authorization", // 必要的请求头
      },
      body: JSON.stringify({ error: "Failed to retrieve data from S3" }),
    };
  }
};

