import * as request from "supertest";
import KernelFactory, { Kernel } from '../../../../src/kernel';
import InMemoryTransactionRepository from "../../../infrastructure/transaction/inMemoryRepository";
import Transaction from "domain/transaction/transaction";
import Price from 'domain/transaction/valueObject/price';

describe("GET /transaction/:uuid", () => {

  let transactionRepository;
  let kernel: Kernel;

  beforeEach(async () => {
      kernel = await KernelFactory(false);
      transactionRepository = kernel.container.get<InMemoryTransactionRepository>('domain.transaction.repository')
      kernel.container.snapshot();
  });

  afterEach(() => {
      kernel.container.restore();
  });
  
  it("Get /255edcfe-0622-11ea-8d71-362b9e155667", async () => {
    await transactionRepository.save(Transaction.create("255edcfe-0622-11ea-8d71-362b9e155667", "uuu", new Price(1, "EUR")));

    const result: any = await request(kernel.http.getExpress()).get("/transaction/255edcfe-0622-11ea-8d71-362b9e155667");

    const expectedResponse = {
      "data": {
        "uuid":"255edcfe-0622-11ea-8d71-362b9e155667",
        "product":"uuu",
        "priceAmount": 1,
        "priceCurrency": "EUR",
      },
      "meta":[]
    };

    const jsonResponse = JSON.parse(result.text);

    delete jsonResponse.data.createdAt;

    expect(jsonResponse).toEqual(expect.objectContaining(expectedResponse));
    expect(result.statusCode).toEqual(200);
  });
  
  it("Get /255edcfe-0622-11ea-8d71-362b9e155600 expect status 404", async () => {
    await request(kernel.http.getExpress())
      .get("/transaction/255edcfe-0622-11ea-8d71-362b9e155600")
      .expect(404)
    ;
  });
});
