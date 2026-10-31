import { MigrationInterface, QueryRunner } from "typeorm";

export class AvatarAndPause1793455145392 implements MigrationInterface {
    name = 'AvatarAndPause1793455145392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rounds\` ADD \`pausedAt\` datetime(3) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`avatar\` mediumtext NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`avatar\``);
        await queryRunner.query(`ALTER TABLE \`rounds\` DROP COLUMN \`pausedAt\``);
    }

}
