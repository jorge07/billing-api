import request from "supertest";
import Kernel from '../../../../../src/kernel';
import InMemoryTransactionRepository from "../../../infrastructure/transaction/inMemoryRepository";
import Transaction from "../../../../../src/domain/transaction/transaction";

describe("POST /transaction", () => {
  const kernel = new Kernel(true);

  const transactionRepository = kernel.container.get<InMemoryTransactionRepository>('domain.transaction.repository');
  
  beforeEach(() => {
    kernel.container.snapshot();
  });

  afterEach(() => {
      kernel.container.restore();
  });

  it("Create a transaction", async () => {
    await request(kernel.http.getExpress())
      .post("/transaction")
      .send({
        uuid: 111, 
        price: { 
          amount: 12, 
          currency: "EUR" 
        }, 
        product: "test"
      })
      .set('Accept', 'application/json')
      .expect(201);

    expect(await transactionRepository.get("111")).toBeInstanceOf(Transaction)
  });
});
