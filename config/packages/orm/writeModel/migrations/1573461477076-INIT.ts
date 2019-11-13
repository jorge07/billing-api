import {MigrationInterface, QueryRunner} from "typeorm";

export class INIT1573461477076 implements MigrationInterface {
    name = 'INIT1573461477076'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "events" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "uuid" uuid NOT NULL, 
            "playhead" integer DEFAULT 0,
            "event" jsonb NOT NULL, 
            "metadata" jsonb NOT NULL, 
            "ocurredOn" TIMESTAMP WITH TIME ZONE NOT NULL, 
            "eventType" character varying NOT NULL, 
            CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" 
            PRIMARY KEY ("id")
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "events"`);
    }

}
