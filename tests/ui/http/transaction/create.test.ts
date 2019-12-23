import * as request from "supertest";
import KernelFactory, { Kernel } from '../../../../src/kernel';
import InMemoryTransactionRepository from "../../../infrastructure/transaction/inMemoryRepository";
import Transaction from "domain/transaction/transaction";
import * as v4 from 'uuid/v4';

describe("POST /transaction", () => {
  let kernel: Kernel;
  let transactionRepository;

  beforeEach(async () => {
    kernel = await KernelFactory(false);
    transactionRepository = kernel.container.get<InMemoryTransactionRepository>('domain.transaction.repository');
    kernel.container.snapshot();
  });

  afterEach(() => {
      kernel.container.restore();
  });

  it("Create a transaction", async () => {
    const txuuid = v4();

    await request(kernel.http.getExpress())
      .post("/transaction")
      .send({
        uuid: txuuid, 
        price: { 
          amount: 12, 
          currency: "EUR" 
        }, 
        product: "test"
      })
      .set('Accept', 'application/json')
      .expect(201);

    expect(await transactionRepository.get(txuuid)).toBeInstanceOf(Transaction)
  });
});
