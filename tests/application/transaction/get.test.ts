import CreateCommand from 'application/transaction/create/command';
import Transaction from 'domain/transaction/transaction';
import { Application } from "hollywood-js";
import InMemoryTransactionRepository from '../../infrastructure/transaction/inMemoryRepository';
import GetOne from 'application/transaction/get/query';
import Price from 'domain/transaction/valueObject/price';
import KernelFactory, { Kernel } from "../../../src/kernel";
import { getConnectionManager } from 'typeorm';

describe("Get Transaction", () => {

    let kernel: Kernel;

    beforeEach(async () => {
        kernel = await KernelFactory(false);
        const repository = kernel.container.get<InMemoryTransactionRepository>('domain.transaction.repository');
        await repository.save(Transaction.create("255edcfe-0622-11ea-8d71-362b9e155667", "", new Price(1, 'EUR')));
    })
    
    afterAll(async () => {
        await getConnectionManager().connections.forEach((conn)=> conn.close());
    })
    
    test("Get a valid transaction", async () => {
        expect.assertions(3);
        const transaction: any = await kernel.app.ask(new GetOne("255edcfe-0622-11ea-8d71-362b9e155667"))
        expect(transaction).not.toBe(null)
        expect(transaction).not.toBe(undefined)
        expect(transaction.data.uuid).toBe("255edcfe-0622-11ea-8d71-362b9e155667")
    })
})
