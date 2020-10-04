import Transaction from "domain/transaction/Transaction";
import TransactionID from "domain/transaction/valueObject/transactionId";
import { Framework } from "hollywood-js";
import * as prom from "prom-client";
import * as request from "supertest";
import BillingAPI from "ui/http/BillingAPI";
import * as v4 from "uuid/v4";
import KernelFactory from "../../../../src/kernel";
import InMemoryTransactionRepository from "../../../infrastructure/transaction/InMemoryRepository";

describe("POST /transaction", () => {
  let kernel: Framework.Kernel;
  let transactionRepository: InMemoryTransactionRepository;

  beforeEach(async () => {
    kernel = await KernelFactory(false);
    ((prom.Registry as any).globalRegistry as prom.Registry).clear();
    transactionRepository = kernel.container.get<InMemoryTransactionRepository>("domain.transaction.repository");
    kernel.container.snapshot();
  });

  afterEach(() => {
      kernel.container.restore();
  });

  it("Create a transaction", async () => {
    const txuuid = v4();

    await request(kernel.container.get<BillingAPI>("ui.httpServer").http)
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

    expect(await transactionRepository.get(new TransactionID(txuuid))).toBeInstanceOf(Transaction);
  });
});
