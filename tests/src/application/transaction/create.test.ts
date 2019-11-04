import Kernel from "../../../../src/infrastructure/kernel";
import CreateCommand from '../../../../src/application/transaction/create/command';
import Transaction from '../../../../src/domain/transaction/transaction';
import { Application } from "hollywood-js";
import InMemoryTransactionRepository from '../../infrastructure/transaction/inMemoryRepository';

describe("Create Transaction", () => {

    const kernel: Kernel = new Kernel(false);

    beforeEach(() => {
        kernel.container.snapshot();
    })
    afterEach(() => {
        kernel.container.restore();
    });
    
    test("Create Transactiona valid", async () => {
        expect.assertions(2);
        await kernel.app.handle(new CreateCommand("111", "", ""));
        const repository = kernel.container.get<InMemoryTransactionRepository>('domain.transaction.repository');
        const transaction = await repository.get("111") as Transaction;
        expect(transaction).not.toBe(undefined)
        expect(transaction.getAggregateRootId()).toBe("111")
    })
})
