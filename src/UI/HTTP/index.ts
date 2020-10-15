import "reflect-metadata";
import BillingAPI from "src/UI/HTTP/BillingAPI";
import KernelFactory from "../../Kernel";

export default async function http(debug: boolean = false) {

    try {
        const kernel = await KernelFactory(debug);
        await kernel.container.get<BillingAPI>("ui.httpServer").up();
    } catch (err) {
        console.error(err);
    }
}
