import KernelFactory from "../src/kernel";
import CreateCommand from '../src/application/useCase/transaction/create/command';
import GetOne from '../src/application/useCase/transaction/get/query';

(async () => {
    try {
        const kernel = await KernelFactory(false);

         await kernel.handle(new CreateCommand(
            "255edcfe-0622-11ea-8d71-362b9e155667",
            "demo",
            { amount: 4, currency: "EUR" }
        ));

        const result = await kernel.ask(new GetOne('255edcfe-0622-11ea-8d71-362b9e155667'))

        console.log(result);

    } catch(err) {
        console.log(err.message, err);
    }
})();
