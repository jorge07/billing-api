import KernelFactory from "../src/kernel";
import PostgresEventStoreDBAL from 'infrastructure/shared/eventStore/dbal';
import { EventStore } from 'hollywood-js';
import Transaction from "domain/transaction/transaction";
import CreateCommand from 'application/transaction/create/command';
import GetOne from 'application/transaction/get/query';

(async () => {
    try {
        const kernel = await KernelFactory(false);

        const result = await kernel.app.ask(new GetOne('255edcfe-0622-11ea-8d71-362b9e155667'))

        console.log(JSON.stringify(result));

    } catch(err) {
        console.log(err.message, err);
    }
})();
