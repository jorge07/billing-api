import { TransactionModule } from "@Transaction/Infrastructure/TransactionModule";
import { Framework } from "hollywood-js";
import { parameters } from "../config/parameters";
import { testParameters } from "../config/parameters-test";

export default async function KernelFactory(): Promise<Framework.Kernel> {
     return Framework.Kernel.createFromModuleContext(
        process.env.NODE_ENV,
        parameters,
        TransactionModule,
        testParameters,
    );
}
