const migrationsPath = "config/packages/orm/writeModel/migrations";

module.exports = {
   name: "default",
   type: "postgres",
   host: "localhost",
   port: 5432,
   username: "postgres",
   password: "changeme",
   database: "postgres",
   entities: [
      __dirname + '/../../../../src/infrastructure/shared/eventStore/mapping/events*'
   ],
   migrations: [
      migrationsPath
   ],
   synchronize: true,
   logging: false,
   cli: {
      migrationsDir: migrationsPath,
   }
}
