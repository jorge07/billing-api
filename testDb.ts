import KernelFactory from "./src/kernel";
import PostgresEventStoreDBAL from './src/infrastructure/shared/eventStore/dbal';
import { EventStore } from 'hollywood-js';
import Transaction from "domain/transaction/transaction";
import CreateCommand from './src/application/transaction/create/command';
import GetOne from './src/application/transaction/get/query';

(async () => {
    try {
        const kernel = await KernelFactory(false);

         await kernel.app.handle(new CreateCommand(
            "255edcfe-0622-11ea-8d71-362b9e155667",
            "demo",
            { amount: 4, currency: "EUR" }
        ));

        const result = await kernel.app.ask(new GetOne('255edcfe-0622-11ea-8d71-362b9e155667'))

        console.log(result);

    } catch(err) {
        console.log(err.message, err);
    }
})();
