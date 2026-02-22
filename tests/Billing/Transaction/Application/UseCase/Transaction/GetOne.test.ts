import { Framework } from "hollywood-js";
import * as prom from "prom-client";
import { getConnectionManager } from "typeorm";
import {TestKernelFactory} from "../../../../../TestKernelFactory";
import GetOneQuery from "@Transaction/Application/GetOne/Query";
import Transaction from "@Transaction/Domain/Transaction";
import TransactionId from "@Transaction/Domain/ValueObject/TransactionId";
import Price from "@Transaction/Domain/ValueObject/Price";
import NotFoundException from "@Shared/Domain/Exceptions/NotFoundException";
import {InMemoryTransactionRepository} from "../../../Infrastructure/InMemoryRepository";

const EXISTING_UUID = "ae081e7a-ec8c-4ff1-9de5-f70383fe03a7";
const MISSING_UUID  = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

describe("GetOne Transaction", () => {
    let kernel: Framework.Kernel;

    beforeEach(async () => {
        prom.register.clear();
        kernel = await TestKernelFactory();
        const repository = kernel.container.get<InMemoryTransactionRepository>("domain.transaction.repository");
        await repository.save(Transaction.create(
            new TransactionId(EXISTING_UUID),
            "",
            new Price("1", "EUR"),
        ));
    });

    afterAll(async () => {
        await getConnectionManager().connections.forEach((conn) => conn.close());
    });

    test("GetOne a valid transaction", async () => {
        expect.assertions(3);
        const transaction: any = await kernel.app.ask(new GetOneQuery(EXISTING_UUID));
        expect(transaction).not.toBe(null);
        expect(transaction).not.toBe(undefined);
        expect(transaction.data.uuid).toBe(EXISTING_UUID);
    });

    test("GetOne a non-existent transaction throws NotFoundException", async () => {
        expect.assertions(1);
        await expect(kernel.app.ask(new GetOneQuery(MISSING_UUID)))
            .rejects.toThrow(NotFoundException);
    });
});
