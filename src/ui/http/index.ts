import "reflect-metadata";
import BillingAPI from "ui/http/BillingAPI";
import KernelFactory from "../../kernel";

(async () => {
    const kernel = await KernelFactory(false);

    await kernel.container.get<BillingAPI>("ui.httpServer").up();
})();
