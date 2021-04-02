import { Framework } from "hollywood-js";
import * as prom from "prom-client";
import { TestKernelFactory } from "../../../TestKernelFactory";
import { InMemoryTransactionRepository } from "@Tests/Transaction/Infrastructure/InMemoryRepository";
import BillingAPI from "@Apps/HTTP/BillingAPI";
import Transaction from "@Transaction/Domain/Transaction";
import TransactionId from "@Transaction/Domain/ValueObject/TransactionId";
import Price from "@Transaction/Domain/ValueObject/Price";

describe("GET /transaction/:uuid", () => {
  let transactionRepository: InMemoryTransactionRepository;
  let kernel: Framework.Kernel;
  let api: BillingAPI;

  beforeEach(async () => {
      kernel = await TestKernelFactory();
      api = new BillingAPI(kernel);
      prom.register.clear();
      transactionRepository = kernel.container.get<InMemoryTransactionRepository>("domain.transaction.repository");
      kernel.container.snapshot();
  });

  afterEach(async () => {
      kernel.container.restore();
      await api.http.close();
  });

  it("GetOne /ae081e7a-ec8c-4ff1-9de5-f70383fe03a7", async () => {
    const txnuuid = "ae081e7a-ec8c-4ff1-9de5-f70383fe03a7";
    await transactionRepository.save(Transaction.create(new TransactionId(txnuuid), "uuu", new Price(1, "EUR")));

    const result: any = await api.http.inject({
      method: "GET",
      path: "/transaction/" + txnuuid
    });

    const expectedResponse = {
      data: {
        uuid: txnuuid,
        product: "uuu",
        priceAmount: "1",
        priceCurrency: "EUR",
      },
      meta: [],
    };

    const jsonResponse = JSON.parse(result.body);

    delete jsonResponse.data.createdAt;

    expect(jsonResponse).toEqual(expectedResponse);
    expect(result.statusCode).toEqual(200);
  });

  it("GetOne /ae081e7a-ec8c-4ff1-9de5-f70383fe03a7 expect status 404", async () => {
    const { statusCode } = await api.http.inject({
      method: "GET",
      path: "/transaction/ae081e7a-ec8c-4ff1-9de5-f70383fe03a7"
    });
    expect(statusCode).toBe(404);
  });
});
