import ConfirmCommand from "@Transaction/Application/Confirm/Command";
import FailCommand from "@Transaction/Application/Fail/Command";
import RefundCommand from "@Transaction/Application/Refund/Command";
import type {FastifyReply, FastifyRequest} from "fastify";
import { Application } from "hollywood-js";
import { IRoute } from "../index";

export function confirm(app: Application.App): IRoute {
    return {
        action: async (req: FastifyRequest, res: FastifyReply) => {
            const { uuid } = req.params as any;
            await app.handle(new ConfirmCommand(uuid));
            res.status(204).send();
        },
        method: "patch",
        options: {
            schema: {
                params: {
                    properties: { uuid: { type: "string" } },
                    type: "object",
                },
                response: { 204: {}, 404: {}, 409: {} },
                tags: ["Transactions"],
            },
        },
        path: "/transaction/:uuid/confirm",
    };
}

export function fail(app: Application.App): IRoute {
    return {
        action: async (req: FastifyRequest, res: FastifyReply) => {
            const { uuid } = req.params as any;
            const { reason } = req.body as any;
            await app.handle(new FailCommand(uuid, reason ?? ""));
            res.status(204).send();
        },
        method: "patch",
        options: {
            schema: {
                body: {
                    properties: { reason: { type: "string" } },
                    type: "object",
                },
                params: {
                    properties: { uuid: { type: "string" } },
                    type: "object",
                },
                response: { 204: {}, 404: {}, 409: {} },
                tags: ["Transactions"],
            },
        },
        path: "/transaction/:uuid/fail",
    };
}

export function refund(app: Application.App): IRoute {
    return {
        action: async (req: FastifyRequest, res: FastifyReply) => {
            const { uuid } = req.params as any;
            await app.handle(new RefundCommand(uuid));
            res.status(204).send();
        },
        method: "patch",
        options: {
            schema: {
                params: {
                    properties: { uuid: { type: "string" } },
                    type: "object",
                },
                response: { 204: {}, 404: {}, 409: {} },
                tags: ["Transactions"],
            },
        },
        path: "/transaction/:uuid/refund",
    };
}
