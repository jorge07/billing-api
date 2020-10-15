import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1601804428637 implements MigrationInterface {
    public name = "init1601804428637";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "transactions" (
                "uuid" uuid NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
                "product" character varying NOT NULL,
                "price.amount" double precision NOT NULL,
                "price.currency" character varying NOT NULL,
                CONSTRAINT "PK_71ee7072c1ba2c23edc34fabfee" PRIMARY KEY ("uuid")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transactions"`);
    }

}
