import { Framework } from "hollywood-js";
import {TransactionModule} from "Infrastructure/Transaction/TransactionModule";
import { testParameters } from "../config/paramaters.test";
import { parameters } from "../config/parameters";

export default async function KernelFactory(debug: boolean): Promise<Framework.Kernel> {
     return await Framework.Kernel.createFromModuleContext(
        process.env.NODE_ENV,
        debug,
        parameters,
        TransactionModule,
        testParameters,
    );
}
