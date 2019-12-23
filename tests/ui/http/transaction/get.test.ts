import * as request from "supertest";
import KernelFactory, { Kernel } from '../../../../src/kernel';
import InMemoryTransactionRepository from "../../../infrastructure/transaction/inMemoryRepository";
import Transaction from "domain/transaction/transaction";
import Price from 'domain/transaction/valueObject/price';
import TransactionID from 'domain/transaction/valueObject/transactionId';

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
  
  it("Get /ae081e7a-ec8c-4ff1-9de5-f70383fe03a7", async () => {
    const txnuuid = "ae081e7a-ec8c-4ff1-9de5-f70383fe03a7"; 
    await transactionRepository.save(Transaction.create(new TransactionID(txnuuid), "uuu", new Price(1, "EUR")));

    const result: any = await request(kernel.http.getExpress()).get("/transaction/" + txnuuid);

    const expectedResponse = {
      "data": {
        "uuid":txnuuid,
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
  
  it("Get /ae081e7a-ec8c-4ff1-9de5-f70383fe03a7 expect status 404", async () => {
    await request(kernel.http.getExpress())
      .get("/transaction/ae081e7a-ec8c-4ff1-9de5-f70383fe03a7")
      .expect(404)
    ;
  });
});
