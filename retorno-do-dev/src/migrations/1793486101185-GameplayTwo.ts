import { MigrationInterface, QueryRunner } from "typeorm";

export class GameplayTwo1793486101185 implements MigrationInterface {
    name = 'GameplayTwo1793486101185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`round_answers\` ADD \`usedRing\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`round_answers\` ADD \`skipped\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`rounds\` ADD \`journey\` varchar(20) NOT NULL DEFAULT 'main'`);
        await queryRunner.query(`ALTER TABLE \`rounds\` ADD \`persona\` varchar(20) NOT NULL DEFAULT 'gandalf'`);
        await queryRunner.query(`ALTER TABLE \`rounds\` ADD \`corruption\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`rounds\` ADD \`ringUses\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`rounds\` ADD \`helpsUsed\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`rounds\` ADD \`currentAssist\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`rounds\` ADD \`shieldUsed\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`rounds\` ADD \`streakShieldRegions\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`rounds\` ADD \`failReason\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`rounds\` ADD \`fastCorrect\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`rounds\` ADD \`livesLost\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rounds\` DROP COLUMN \`livesLost\``);
        await queryRunner.query(`ALTER TABLE \`rounds\` DROP COLUMN \`fastCorrect\``);
        await queryRunner.query(`ALTER TABLE \`rounds\` DROP COLUMN \`failReason\``);
        await queryRunner.query(`ALTER TABLE \`rounds\` DROP COLUMN \`streakShieldRegions\``);
        await queryRunner.query(`ALTER TABLE \`rounds\` DROP COLUMN \`shieldUsed\``);
        await queryRunner.query(`ALTER TABLE \`rounds\` DROP COLUMN \`currentAssist\``);
        await queryRunner.query(`ALTER TABLE \`rounds\` DROP COLUMN \`helpsUsed\``);
        await queryRunner.query(`ALTER TABLE \`rounds\` DROP COLUMN \`ringUses\``);
        await queryRunner.query(`ALTER TABLE \`rounds\` DROP COLUMN \`corruption\``);
        await queryRunner.query(`ALTER TABLE \`rounds\` DROP COLUMN \`persona\``);
        await queryRunner.query(`ALTER TABLE \`rounds\` DROP COLUMN \`journey\``);
        await queryRunner.query(`ALTER TABLE \`round_answers\` DROP COLUMN \`skipped\``);
        await queryRunner.query(`ALTER TABLE \`round_answers\` DROP COLUMN \`usedRing\``);
    }

}
