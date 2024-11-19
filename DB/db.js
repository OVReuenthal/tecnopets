import pg from "pg";
const { Pool } = pg;

import { config } from "dotenv"; // Library to ENV
config();
export const client = new Pool({
  host: process.env.POSTGRESQL_HOST,
  user: process.env.POSTGRESQL_USER,
  port: process.env.POSTGRESQL_PORT,
  password: process.env.POSTGRESQL_PASSWORD,
  database: process.env.POSTGRESQL_DB_NAME,
});

export const db = async () => {
  try {
    await client.connect();
    console.log("Connected", client._clients[0]._connected);
  } catch (err) {
    console.log("connect failed", false);
  }
};
