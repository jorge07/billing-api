import "reflect-metadata";
import BillingAPI from "ui/http/BillingAPI";
import KernelFactory from "../../kernel";

export default async function http(debug: boolean = false) {
    const kernel = await KernelFactory(debug);

    await kernel.container.get<BillingAPI>("ui.httpServer").up();
}
