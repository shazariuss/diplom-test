import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./configs/schema.jsx",
    out: "./drizzle",
    dbCredentials: {
        url: "postgresql://coursedb_owner:gdfF9wHYrKj3@ep-crimson-flower-a13kioj2.ap-southeast-1.aws.neon.tech/coursedb?sslmode=require",
    },
});
