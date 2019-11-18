const migrationsDir = "config/packages/orm/writeModel/migrations";

module.exports = {
   name: "default",
   type: "postgres",
   host: "localhost",
   port: 5432,
   username: "postgres",
   password: "changeme",
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
