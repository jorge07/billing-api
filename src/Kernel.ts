import { TransactionModule } from "@Transaction/Infrastructure/TransactionModule";
import { Framework } from "hollywood-js";
import { testParameters } from "../config/parameters-test";
import { parameters } from "../config/parameters";

export default async function KernelFactory(): Promise<Framework.Kernel> {
     return Framework.Kernel.createFromModuleContext(
        process.env.NODE_ENV,
        parameters,
        TransactionModule,
        testParameters,
    );
}
