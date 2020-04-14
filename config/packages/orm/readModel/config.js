const migrationsDir = "config/packages/orm/readModel/migrations";

module.exports = {
   name: "readModel",
   type: "postgres",
   host: process.env.PG_READ_HOST || "192.168.99.106",
   port: 5432,
   username: process.env.PG_READ_USER ||"postgres",
   password: process.env.PG_READ_PASS ||"changeme",
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
