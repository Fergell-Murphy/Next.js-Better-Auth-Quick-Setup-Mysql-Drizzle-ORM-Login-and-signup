import "dotenv/config";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const url = new URL(process.env.DATABASE_URL);

const pool = mysql.createPool({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: url.username,
  password: url.password,
  database: url.pathname.replace(/^\//, ""),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 10_000,
});

export const db = drizzle(pool);
