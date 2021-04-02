import type {FastifyReply, FastifyRequest} from "fastify";
import type { IRoute } from "../index";

export default function get(): IRoute {
    return {

        action: async (req: FastifyRequest, res: FastifyReply) => {
            res.status(200).send("UP");
        },
        method: "get",
        options: {
            schema: {
                response: {
                    200: {
                        type: "string",
                    },
                },
                tags: [ "Health" ],
            },
        },
        path: "/monitor/health",
    };
}
