const migrationsDir = "config/packages/orm/readModel/migrations";

module.exports = {
   name: "readModel",
   type: "postgres",
   host: "192.168.99.106",
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
