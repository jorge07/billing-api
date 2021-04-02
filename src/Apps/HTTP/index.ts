import BillingAPI from "@Apps/HTTP/BillingAPI";
import "reflect-metadata";
import KernelFactory from "../../Kernel";

export default async function http(): Promise<void> {
    try {
        const kernel = await KernelFactory();
        const server = new BillingAPI(kernel);
        await server.up();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
