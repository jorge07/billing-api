import CreateCommand from 'application/transaction/create/command';
import Transaction from 'domain/transaction/transaction';
import { Application } from "hollywood-js";
import InMemoryTransactionRepository from '../../infrastructure/transaction/inMemoryRepository';
import GetOne from 'application/transaction/get/query';
import Price from 'domain/transaction/valueObject/price';
import KernelFactory, { Kernel } from "../../../src/kernel";

describe("Get Transaction", () => {

    let kernel: Kernel;

    beforeEach(async () => {
        kernel = await KernelFactory(false);
        kernel.container.snapshot();
        const repository = kernel.container.get<InMemoryTransactionRepository>('domain.transaction.repository');
        await repository.save(Transaction.create("111", "", new Price(1, 'EUR')));
    })
    
    afterEach(async () => {
        kernel.container.restore();
    });
    
    test("Get a valid transaction", async () => {
        expect.assertions(3);
        const transaction: any = await kernel.app.ask(new GetOne("111"))
        expect(transaction).not.toBe(null)
        expect(transaction).not.toBe(undefined)
        expect(transaction.data.aggregateRootId).toBe("111")
    })
})
