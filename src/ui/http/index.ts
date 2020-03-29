import HTTPServer from "ui/http/server";
import KernelFactory from "../../kernel";

(async () => {
    const kernel = await KernelFactory(false);

    kernel.container.get<HTTPServer>("ui.httpServer").up();
})();
