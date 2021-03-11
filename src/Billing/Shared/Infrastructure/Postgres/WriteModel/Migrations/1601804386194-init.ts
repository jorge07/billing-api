import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1601804386194 implements MigrationInterface {
    public name = "init1601804386194";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "events" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "uuid" character varying NOT NULL,
                "playhead" integer DEFAULT 0,
                "event" jsonb NOT NULL,
                "metadata" jsonb NOT NULL,
                "occurred" TIMESTAMP WITH TIME ZONE NOT NULL,
                "eventType" character varying NOT NULL,
                CONSTRAINT "UQ_f1ae990f4f98735f0285a949690" UNIQUE ("uuid"),
                CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f1ae990f4f98735f0285a94969" ON "events" ("uuid") `);
        await queryRunner.query(`
            CREATE TABLE "snapshots" (
                "uuid" uuid NOT NULL,
                "aggregateRoot" jsonb NOT NULL,
                CONSTRAINT "PK_30a0e79aff141e16f3bb74f3836" PRIMARY KEY ("uuid")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "snapshots"`);
        await queryRunner.query(`DROP INDEX "IDX_f1ae990f4f98735f0285a94969"`);
        await queryRunner.query(`DROP TABLE "events"`);
    }

}
