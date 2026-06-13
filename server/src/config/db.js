import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config({
  path: new URL("../../.env", import.meta.url)
});

console.log({
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME
});

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME
});

export default pool;
