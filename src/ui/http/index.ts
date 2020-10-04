import "reflect-metadata";
import BillingAPI from "ui/http/BillingAPI";
import KernelFactory from "../../kernel";

export default async function http(debug: boolean = false) {

    try {
        const kernel = await KernelFactory(debug);
        await kernel.container.get<BillingAPI>("ui.httpServer").up();
    } catch (err) {
        console.error(err);
    }
}
