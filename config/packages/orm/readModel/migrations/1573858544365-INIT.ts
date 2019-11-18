import {MigrationInterface, QueryRunner} from "typeorm";

export class INIT1573858544365 implements MigrationInterface {
    name = 'INIT1573858544365'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "transactions" ("uuid" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "product" character varying NOT NULL, "price.amount" double precision NOT NULL, "price.currency" character varying NOT NULL, CONSTRAINT "PK_71ee7072c1ba2c23edc34fabfee" PRIMARY KEY ("uuid"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "transactions"`, undefined);
    }
}
