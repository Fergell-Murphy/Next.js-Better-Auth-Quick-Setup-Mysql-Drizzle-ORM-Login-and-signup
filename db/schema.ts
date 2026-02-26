import {
  boolean,
  datetime,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: varchar("image", { length: 512 }),
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: datetime("expiresAt").notNull(),
  ipAddress: varchar("ipAddress", { length: 255 }),
  userAgent: text("userAgent"),
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: varchar("accountId", { length: 255 }).notNull(),
  providerId: varchar("providerId", { length: 255 }).notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: datetime("accessTokenExpiresAt"),
  refreshTokenExpiresAt: datetime("refreshTokenExpiresAt"),
  scope: varchar("scope", { length: 255 }),
  password: varchar("password", { length: 255 }),
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 255 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  expiresAt: datetime("expiresAt").notNull(),
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
});
