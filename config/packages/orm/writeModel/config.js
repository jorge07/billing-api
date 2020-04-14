const migrationsDir = "config/packages/orm/writeModel/migrations";

module.exports = {
   name: "default",
   type: "postgres",
   host: process.env.PG_WRITE_HOST || "192.168.99.106",
   port: 5432,
   username: process.env.PG_WRITE_USER || "postgres",
   password: process.env.PG_WRITE_PASS || "changeme",
   database: "write_model",
   entities: [
      __dirname + '/../../../../src/infrastructure/shared/eventStore/mapping/*'
   ],
   migrations: [
      migrationsDir
   ],
   synchronize: true,
   logging: false,
   cli: {
      migrationsDir,
   }
}
