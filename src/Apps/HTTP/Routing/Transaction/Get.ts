import GetOneQuery from "@Transaction/Application/GetOne/Query";
import type {FastifyReply, FastifyRequest} from "fastify";
import { Application } from "hollywood-js";
import { IRoute } from "../index";
import { TransactionResponse } from "./Schema/Shared";

export default function get(app: Application.App): IRoute {
    return {
        action: async (req: FastifyRequest, res: FastifyReply) => {
            const { uuid } = req.params as any;

            const transaction = await app.ask(new GetOneQuery(
                uuid,
            ));

            res.status(200).send(transaction);
        },
        method: "get",
        options: {
            schema: {
                params: {
                    properties: {
                        uuid: {
                            description: "Transaction uuid",
                            type: "string",
                        },
                    },
                    type: "object",
                },
                response: {
                    200: {
                        properties: TransactionResponse,
                        type: "object",
                    },
                    404: {},
                },
                tags: [ "Transactions" ],
            },
        },
        path: "/transaction/:uuid",
    };
}
