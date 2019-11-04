import "reflect-metadata";
import CreateCommand from "../../application/transaction/create/command";
import Create from "../../application/transaction/create/handler";
import GetOne from "../../application/transaction/get/query";
import Kernel from "../../infrastructure/kernel";
import App from "../../infrastructure/shared/app";
import Log from "../../infrastructure/shared/audit/logger";

const kernel = new Kernel(false);

async function test() {
    await kernel.app.handle(new CreateCommand("111", "1", "1E"));

    const message = await kernel.app.ask(new GetOne("111"));

    kernel.container.get<Log>("logger").info(JSON.stringify(message));
}

test();
