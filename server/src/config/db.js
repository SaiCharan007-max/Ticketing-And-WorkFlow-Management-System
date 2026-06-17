import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config({
  path: new URL("../../.env", import.meta.url)
});


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
