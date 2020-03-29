const migrationsDir = "config/packages/orm/readModel/migrations";

module.exports = {
   name: "readModel",
   type: "postgres",
   host: "localhost",
   port: 5432,
   username: "postgres",
   password: "changeme",
   database: "read_model",
   entities: [
      __dirname + '/../../../../src/infrastructure/transaction/readModel/mapping/*'
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
