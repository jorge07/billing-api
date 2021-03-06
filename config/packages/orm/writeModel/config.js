const migrationsDir = "src/Billing/Shared/Infrastructure/Postgres/WriteModel/Migrations";

module.exports = {
   name: "default",
   type: "postgres",
   host: process.env.PG_WRITE_HOST || "127.0.0.1",
   port: 5432,
   username: process.env.PG_WRITE_USER || "postgres",
   password: process.env.PG_WRITE_PASS || "changeme",
   database: "write_model",
   entities: [
      "src/Billing/Shared/Infrastructure/EventStore/Mapping/*",
   ],
   migrations: [
      migrationsDir,
   ],
   synchronize: true,
   logging: false,
   cli: {
      migrationsDir,
   },
};
