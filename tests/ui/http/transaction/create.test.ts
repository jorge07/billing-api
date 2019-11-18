import * as request from "supertest";
import KernelFactory, { Kernel } from '../../../../src/kernel';
import InMemoryTransactionRepository from "../../../infrastructure/transaction/inMemoryRepository";
import Transaction from "domain/transaction/transaction";

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
    await request(kernel.http.getExpress())
      .post("/transaction")
      .send({
        uuid: "255edcfe-0622-11ea-8d71-362b9e155667", 
        price: { 
          amount: 12, 
          currency: "EUR" 
        }, 
        product: "test"
      })
      .set('Accept', 'application/json')
      .expect(201);

    expect(await transactionRepository.get("255edcfe-0622-11ea-8d71-362b9e155667")).toBeInstanceOf(Transaction)
  });
});
