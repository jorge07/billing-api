import "reflect-metadata";
import BillingAPI from "src/Apps/HTTP/BillingAPI";
import KernelFactory from "../../Kernel";

export default async function http(debug: boolean = false) {

    try {
        const kernel = await KernelFactory(debug);
        const server = new BillingAPI(kernel);
        await server.up();
    } catch (err) {
        console.error(err);
    }
}
