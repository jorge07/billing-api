import GetOneQuery from "Application/UseCase/Transaction/GetOne/Query";
import Transaction from "Domain/Transaction/Transaction";
import Price from "Domain/Transaction/ValueObject/Price";
import TransactionId from "Domain/Transaction/ValueObject/TransactionId";
import {  Framework } from "hollywood-js";
import InMemoryTransactionRepository from "tests/Infrastructure/Transaction/InMemoryRepository";
import { getConnectionManager } from "typeorm";
import KernelFactory from "../../../../src/Kernel";

describe("GetOne Transaction", () => {

    let kernel: Framework.Kernel;

    beforeEach(async () => {
        kernel = await KernelFactory(false);
        const repository = kernel.container.get<InMemoryTransactionRepository>("domain.transaction.repository");
        await repository.save(Transaction.create(
            new TransactionId("ae081e7a-ec8c-4ff1-9de5-f70383fe03a7"),
            "",
            new Price(1, "EUR"),
        ));
    });

    afterAll(async () => {
        await getConnectionManager().connections.forEach((conn) => conn.close());
    });

    test("GetOne a valid transaction", async () => {
        expect.assertions(3);
        const transaction: any = await kernel.ask(new GetOneQuery("ae081e7a-ec8c-4ff1-9de5-f70383fe03a7"));
        expect(transaction).not.toBe(null);
        expect(transaction).not.toBe(undefined);
        expect(transaction.data.uuid).toBe("ae081e7a-ec8c-4ff1-9de5-f70383fe03a7");
    });
});
