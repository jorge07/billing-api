import request from "supertest";
import Kernel from '../../../../../src/kernel';
import InMemoryTransactionRepository from "../../../infrastructure/transaction/inMemoryRepository";
import Transaction from "../../../../../src/domain/transaction/transaction";
import Price from '../../../../../src/domain/transaction/valueObject/price';

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
    await transactionRepository.save(Transaction.create("111", "uuu", new Price(1, "EUR")));

    const result: any = await request(kernel.http.getExpress()).get("/transaction/111");

    const expectedResponse = {
      "data": {
        "aggregateRootId":"111",
        "methodPrefix":"apply",
        "aggregates":[],
        "playhead":0,
        "events":[],
        "product":"uuu",
        "price": {
          "amount": 1,
          "currency": "EUR",
        }
      },
      "meta":[]
    };

    expect(result.text).toEqual(JSON.stringify(expectedResponse));
    expect(result.statusCode).toEqual(200);
  });
  
  it("Get /444 expect status 404", async () => {
    await request(kernel.http.getExpress())
      .get("/transaction/4444")
      .expect(404)
    ;
  });
});
