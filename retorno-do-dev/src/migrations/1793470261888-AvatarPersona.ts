import { MigrationInterface, QueryRunner } from "typeorm";

export class AvatarPersona1793470261888 implements MigrationInterface {
    name = 'AvatarPersona1793470261888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`avatar\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`avatar\` varchar(20) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`avatar\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`avatar\` mediumtext NULL`);
    }

}
