import { Framework } from "hollywood-js";
import * as prom from "prom-client";
import * as request from "supertest";
import * as v4 from "uuid/v4";
import { TestKernelFactory } from "../../../TestKernelFactory";
import {InMemoryTransactionRepository} from "../../../Billing/Transaction/Infrastructure/InMemoryRepository";
import BillingAPI from "@Apps/HTTP/BillingAPI";
import TransactionId from "@Transaction/Domain/ValueObject/TransactionId";
import Transaction from "@Transaction/Domain/Transaction";

describe("POST /transaction", () => {
  let kernel: Framework.Kernel;
  let api: BillingAPI;
  let transactionRepository: InMemoryTransactionRepository;

  beforeEach(async () => {
    kernel = await TestKernelFactory();
    api = new BillingAPI(kernel);
    prom.register.clear();
    transactionRepository = kernel.container.get<InMemoryTransactionRepository>("domain.transaction.repository");
    kernel.container.snapshot();
  });

  afterEach(() => {
      kernel.container.restore();
  });

  it("Create a transaction", async () => {
    const txuuid = v4();

    await request(api.http)
      .post("/transaction")
      .send({
        uuid: txuuid,
        price: {
          amount: 12,
          currency: "EUR",
        },
        product: "test",
      })
      .set("Accept", "application/json")
      .expect(201);

    expect(await transactionRepository.get(new TransactionId(txuuid))).toBeInstanceOf(Transaction);
  });
});
