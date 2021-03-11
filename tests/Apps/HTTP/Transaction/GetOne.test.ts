import { Framework } from "hollywood-js";
import * as prom from "prom-client";
import * as request from "supertest";
import { TestKernelFactory } from "../../../TestKernelFactory";
import {InMemoryTransactionRepository} from "../../../Billing/Transaction/Infrastructure/InMemoryRepository";
import BillingAPI from "@Apps/HTTP/BillingAPI";
import Transaction from "@Transaction/Domain/Transaction";
import TransactionId from "@Transaction/Domain/ValueObject/TransactionId";
import Price from "@Transaction/Domain/ValueObject/Price";

describe("GET /transaction/:uuid", () => {

  let transactionRepository: InMemoryTransactionRepository;
  let kernel: Framework.Kernel;
  let api: BillingAPI;

  beforeEach(async () => {
      kernel = await TestKernelFactory(false);
      api = new BillingAPI(kernel);
      prom.register.clear();
      transactionRepository = kernel.container.get<InMemoryTransactionRepository>("domain.transaction.repository");
      kernel.container.snapshot();
  });

  afterEach(() => {
      kernel.container.restore();
  });

  it("GetOne /ae081e7a-ec8c-4ff1-9de5-f70383fe03a7", async () => {
    const txnuuid = "ae081e7a-ec8c-4ff1-9de5-f70383fe03a7";
    await transactionRepository.save(Transaction.create(new TransactionId(txnuuid), "uuu", new Price(1, "EUR")));

    const result: any = await request(
        api.http,
    ).get("/transaction/" + txnuuid);

    const expectedResponse = {
      data: {
        uuid: txnuuid,
        product: "uuu",
        priceAmount: 1,
        priceCurrency: "EUR",
      },
      meta: [],
    };

    const jsonResponse = JSON.parse(result.text);

    delete jsonResponse.data.createdAt;

    expect(jsonResponse).toEqual(expect.objectContaining(expectedResponse));
    expect(result.statusCode).toEqual(200);
  });

  it("GetOne /ae081e7a-ec8c-4ff1-9de5-f70383fe03a7 expect status 404", async () => {
    await request(api.http)
      .get("/transaction/ae081e7a-ec8c-4ff1-9de5-f70383fe03a7")
      .expect(404)
    ;
  });
});
