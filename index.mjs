import express from 'express';

const pool = await import('pg').then(pg => {
  const { Pool } = pg.default;
  return new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: { rejectUnauthorized: false },
  });
});

export const handler = async (event) => {
  try {
    const result = await pool.query('SELECT NOW()');
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, timestamp: result.rows[0].now }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
