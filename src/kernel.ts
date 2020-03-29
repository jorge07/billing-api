import { Framework } from "hollywood-js";
import "reflect-metadata";
import { parameters } from "../config/container/parameters";
import { services } from "../config/container/services";
import { testServices } from "../config/container/test";

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
