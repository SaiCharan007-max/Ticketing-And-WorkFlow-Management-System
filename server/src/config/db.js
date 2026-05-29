import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config({
  path: new URL("../../.env", import.meta.url)
});

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME
});

export default pool;
