import KernelFactory from "../src/kernel";
import GetOne from '../src/application/useCase/transaction/get/query';
import { v4 } from 'uuid';

(async () => {
    try {
        const kernel = await KernelFactory(false);

        const result = await kernel.ask(new GetOne(v4()))

        console.log(JSON.stringify(result));

    } catch(err) {
        console.log(err.message, err);
        throw err;
    }
})();
