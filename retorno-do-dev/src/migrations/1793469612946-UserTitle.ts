import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTitle1793469612946 implements MigrationInterface {
    name = 'UserTitle1793469612946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`titleCode\` varchar(60) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`titleCode\``);
    }

}
