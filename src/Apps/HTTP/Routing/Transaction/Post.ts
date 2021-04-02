import CreateCommand from "@Transaction/Application/Create/Command";
import type {FastifyReply, FastifyRequest} from "fastify";
import { Application } from "hollywood-js";
import { IRoute } from "../index";

export default function create(app: Application.App): IRoute {
    return {
        action: async (req: FastifyRequest, res: FastifyReply) => {
            const { uuid, product, price } = req.body as any;

            await app.handle(new CreateCommand(
                uuid,
                product,
                price,
            ));

            res.status(201).send();
        },
        method: "post",
        options: {
            schema: {
                body: {
                    properties: {
                        price: {
                            properties: {
                                amount: { type: "integer" },
                                currency: { type: "string" },
                            },
                            type: "object",
                        },
                        product: { type: "string" },
                        uuid: { type: "string" },
                    },
                    type: "object",
                },
                response: {
                    204: {},
                },
                tags: ["Transactions"],
            },
        },
        path: "/transaction",
    };
}
