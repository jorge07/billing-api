import { Framework } from "hollywood-js";
import * as prom from "prom-client";
import { v4 } from "uuid";
import {TestKernelFactory} from "../../../../../TestKernelFactory";
import CreateCommand from "@Transaction/Application/Create/Command";
import ConfirmCommand from "@Transaction/Application/Confirm/Command";
import FailCommand from "@Transaction/Application/Fail/Command";
import RefundCommand from "@Transaction/Application/Refund/Command";
import GetOneQuery from "@Transaction/Application/GetOne/Query";
import InvalidStateException from "@Shared/Domain/Exceptions/InvalidStateException";
import NotFoundException from "@Shared/Domain/Exceptions/NotFoundException";
import { TransactionStatus } from "@Transaction/Domain/ValueObject/TransactionStatus";

describe("Transaction Lifecycle", () => {
    let kernel: Framework.Kernel;
    let txuuid: string;

    beforeEach(async () => {
        prom.register.clear();
        kernel = await TestKernelFactory();
        kernel.container.snapshot();
        txuuid = v4();
        await kernel.app.handle(new CreateCommand(txuuid, "product", { amount: 10, currency: "EUR" }));
    });

    afterEach(() => {
        kernel.container.restore();
    });

    test("newly created transaction has PENDING status", async () => {
        const result: any = await kernel.app.ask(new GetOneQuery(txuuid));
        expect(result.data.status).toBe(TransactionStatus.PENDING);
    });

    test("confirm() transitions read model to CONFIRMED", async () => {
        await kernel.app.handle(new ConfirmCommand(txuuid));
        const result: any = await kernel.app.ask(new GetOneQuery(txuuid));
        expect(result.data.status).toBe(TransactionStatus.CONFIRMED);
    });

    test("fail() transitions read model to FAILED", async () => {
        await kernel.app.handle(new FailCommand(txuuid, "payment declined"));
        const result: any = await kernel.app.ask(new GetOneQuery(txuuid));
        expect(result.data.status).toBe(TransactionStatus.FAILED);
    });

    test("confirm() then refund() transitions read model to REFUNDED", async () => {
        await kernel.app.handle(new ConfirmCommand(txuuid));
        await kernel.app.handle(new RefundCommand(txuuid));
        const result: any = await kernel.app.ask(new GetOneQuery(txuuid));
        expect(result.data.status).toBe(TransactionStatus.REFUNDED);
    });

    test("confirming a non-existent transaction throws NotFoundException", async () => {
        await expect(kernel.app.handle(new ConfirmCommand(v4())))
            .rejects.toThrow(NotFoundException);
    });

    test("double-confirming a transaction throws InvalidStateException", async () => {
        await kernel.app.handle(new ConfirmCommand(txuuid));
        await expect(kernel.app.handle(new ConfirmCommand(txuuid)))
            .rejects.toThrow(InvalidStateException);
    });

    test("refunding a PENDING transaction throws InvalidStateException", async () => {
        await expect(kernel.app.handle(new RefundCommand(txuuid)))
            .rejects.toThrow(InvalidStateException);
    });
});
