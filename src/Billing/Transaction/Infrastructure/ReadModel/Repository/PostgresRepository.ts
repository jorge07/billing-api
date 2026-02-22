import NotFoundException from "@Shared/Domain/Exceptions/NotFoundException";
import TransactionId from "@Transaction/Domain/ValueObject/TransactionId";
import { TransactionStatus } from "@Transaction/Domain/ValueObject/TransactionStatus";
import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";
import IRepository, { ITransactionReadDTO } from "../../../Domain/Repository";
import { Transactions } from "../Mapping/Transactions";

@injectable()
export default class PostgresRepository implements IRepository {
    constructor(
        @inject("infrastructure.transaction.readModel.dbal") private readonly connection: Repository<Transactions>,
     ) {}

    public async save(dto: ITransactionReadDTO): Promise<void> {
        const entity = new Transactions();
        entity.createdAt = dto.createdAt;
        entity.priceAmount = dto.priceAmount;
        entity.priceCurrency = dto.priceCurrency;
        entity.product = dto.product;
        entity.status = dto.status;
        entity.uuid = dto.uuid;
        await this.connection.save(entity);
    }

    public async updateStatus(uuid: string, status: TransactionStatus): Promise<void> {
        await this.connection.update({ uuid }, { status });
    }

    public async get(id: TransactionId): Promise<ITransactionReadDTO | null> {
        try {
            const entity = await this.connection.findOneOrFail({ where: { uuid: id.toString() }, cache: 60000 });
            return {
                createdAt: entity.createdAt,
                priceAmount: entity.priceAmount,
                priceCurrency: entity.priceCurrency,
                product: entity.product,
                status: entity.status,
                uuid: entity.uuid,
            };
        } catch (err) {
            if (err instanceof EntityNotFoundError) {
                throw new NotFoundException("Transaction not found");
            }
            throw err;
        }
    }
}
