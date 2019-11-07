import request from "supertest";
import Kernel from '../../../../../src/kernel';
import InMemoryTransactionRepository from "../../../infrastructure/transaction/inMemoryRepository";
import Transaction from "../../../../../src/domain/transaction/transaction";

describe("GET /transaction/:uuid", () => {
  const kernel = new Kernel(true);

  const transactionRepository = kernel.container.get<InMemoryTransactionRepository>('domain.transaction.repository');
  
  beforeEach(() => {
    kernel.container.snapshot();
  });

  afterEach(() => {
      kernel.container.restore();
  });
  it("Get /111", async () => {
    await transactionRepository.save(Transaction.create("111", "uuu", "ooo"));

    const result: any = await request(kernel.http.getExpress()).get("/transaction/111");

    const expectedResponse = {
      "data": {
        "aggregateRootId":"111",
        "methodPrefix":"apply",
        "aggregates":[],
        "playhead":0,
        "events":[],
        "product":"uuu",
        "price":"ooo"
      },
      "meta":[]
    };

    expect(result.text).toEqual(JSON.stringify(expectedResponse));
    expect(result.statusCode).toEqual(200);
  });
});
