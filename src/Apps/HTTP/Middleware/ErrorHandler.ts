import ConflictException from "@Shared/Domain/Exceptions/ConflictException";
import InvalidArgumentException from "@Shared/Domain/Exceptions/InvalidArgumentException";
import NotFoundException from "@Shared/Domain/Exceptions/NotFoundException";
import type {ILog} from "@Shared/Infrastructure/Audit/Logger";
import {FastifyReply, FastifyRequest} from "fastify";

export default function errorHandler(logger: ILog) {
    return (err: any, req: FastifyRequest, res: FastifyReply) => {
        switch (true) {
            case (err instanceof InvalidArgumentException):
                res.status(400).send(err.message);
                break;
            case (err instanceof ConflictException):
                res.status(409).send(err.message);
                break;
            case (err instanceof NotFoundException):
                res.status(404).send();
                break;
            default:
                logger.error(err.message);
                res.status(500).send(`Internal Server Error: ${err.message}`);
        }
    };
}
