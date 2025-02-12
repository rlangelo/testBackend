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
    // Test database connection by running a simple query
    const result = await pool.query("SELECT * FROM test_data LIMIT 10");
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
      body: JSON.stringify({ success: true, data: result.rows }),
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
