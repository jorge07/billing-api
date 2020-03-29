import CreateCommand from 'application/useCase/transaction/create/command';
import Transaction from 'domain/transaction/transaction';
import { Application, Framework } from "hollywood-js";
import InMemoryTransactionRepository from '../../../infrastructure/transaction/inMemoryRepository';
import GetOne from 'application/useCase/transaction/get/query';
import Price from 'domain/transaction/valueObject/price';
import KernelFactory from "../../../../src/kernel";
import { getConnectionManager } from 'typeorm';
import TransactionID from '../../../../src/domain/transaction/valueObject/transactionId';

describe("Get Transaction", () => {

    let kernel: Framework.Kernel;

    beforeEach(async () => {
        kernel = await KernelFactory(false);
        const repository = kernel.container.get<InMemoryTransactionRepository>('domain.transaction.repository');
        await repository.save(Transaction.create(new TransactionID("ae081e7a-ec8c-4ff1-9de5-f70383fe03a7"), "", new Price(1, 'EUR')));
    })
    
    afterAll(async () => {
        await getConnectionManager().connections.forEach((conn)=> conn.close());
    })
    
    test("Get a valid transaction", async () => {
        expect.assertions(3);
        const transaction: any = await kernel.ask(new GetOne("ae081e7a-ec8c-4ff1-9de5-f70383fe03a7"))
        expect(transaction).not.toBe(null)
        expect(transaction).not.toBe(undefined)
        expect(transaction.data.uuid).toBe("ae081e7a-ec8c-4ff1-9de5-f70383fe03a7")
    })
})
