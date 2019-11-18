import KernelFactory from "../../kernel";

(async () => {
    const kernel = await KernelFactory(false);

    kernel.http.up();
})();
