import { Framework } from "hollywood-js";
import { parameters } from "../config/parameters";
import { services } from "../config/services";
import { testServices } from "../config/test";

export default async function KernelFactory(debug: boolean): Promise<Framework.Kernel> {
    return await Framework.Kernel.create(
        process.env.NODE_ENV,
        debug,
        services,
        parameters,
        testServices,
        new Map(),
    );
}
