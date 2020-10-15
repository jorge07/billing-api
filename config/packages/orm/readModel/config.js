const migrationsDir = "src/Infrastructure/Shared/Postgres/ReadModel/Migrations";

module.exports = {
   name: "readModel",
   type: "postgres",
   host: process.env.PG_READ_HOST || "127.0.0.1",
   port: 5432,
   username: process.env.PG_READ_USER || "postgres",
   password: process.env.PG_READ_PASS || "changeme",
   database: "read_model",
   entities: [
      "src/Infrastructure/Transaction/ReadModel/Mapping/*",
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
