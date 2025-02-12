import AWS from "aws-sdk";

const S3 = new AWS.S3();
const BUCKET_NAME = "marketplace-uploads-12345";

let pool;

const initializePool = async () => {
  if (!pool) {
    const { Pool } = (await import('pg')).default;
    pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: 5432,
      ssl: { rejectUnauthorized: false },
    });
  }
};

export const handler = async (event) => {
  await initializePool(); // Ensure the pool is initialized before the query

  try {
  
    // Determine which endpoint is being called
    const path = event.rawPath || event.path;
    if (path === "/test") {
      // Database query logic
      const result = await pool.query("SELECT * FROM test_data LIMIT 10");
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
        },
        body: JSON.stringify({ success: true, data: result.rows }),
      };
    }

    else if (path === "/upload" && event.httpMethod === "POST") {
      // File upload logic
      const { fileName, fileType } = JSON.parse(event.body);

      const params = {
        Bucket: BUCKET_NAME,
        Key: `uploads/${fileName}`,
        ContentType: fileType,
        Expires: 60, // URL expires in 60 seconds
      };

      const signedUrl = await S3.getSignedUrlPromise("putObject", params);

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
        },
        body: JSON.stringify({ success: true, uploadUrl: signedUrl }),
      };
    }

    // Default response for unknown paths
    return {
      statusCode: 404,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, error: "Endpoint not found" }),
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
