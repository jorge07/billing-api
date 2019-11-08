import Kernel from "../../../../src/kernel";
import CreateCommand from '../../../../src/application/transaction/create/command';
import Transaction from '../../../../src/domain/transaction/transaction';
import { Application } from "hollywood-js";
import InMemoryTransactionRepository from '../../infrastructure/transaction/inMemoryRepository';
import GetOne from '../../../../src/application/transaction/get/query';
import Price from '../../../../src/domain/transaction/valueObject/price';

describe("Get Transaction", () => {

    const kernel: Kernel = new Kernel(false);

    beforeEach(async () => {
        kernel.container.snapshot();
        const repository = kernel.container.get<InMemoryTransactionRepository>('domain.transaction.repository');
        await repository.save(Transaction.create("111", "", new Price(1, 'EUR')));
    })
    
    afterEach(() => {
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
