import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1793449840725 implements MigrationInterface {
    name = 'InitialSchema1793449840725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`achievements\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(60) NOT NULL, \`title\` varchar(120) NOT NULL, \`userId\` int NOT NULL, \`unlockedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`UQ_user_achievement\` (\`userId\`, \`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`round_answers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`roundId\` int NOT NULL, \`questionId\` int NOT NULL, \`answerId\` int NULL, \`region\` tinyint UNSIGNED NOT NULL, \`isCorrect\` tinyint NOT NULL, \`points\` int NOT NULL DEFAULT '0', \`elapsedSeconds\` int NOT NULL DEFAULT '0', \`answeredAt\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), UNIQUE INDEX \`UQ_round_question\` (\`roundId\`, \`questionId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rounds\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`mode\` varchar(20) NOT NULL DEFAULT 'normal', \`status\` varchar(20) NOT NULL DEFAULT 'active', \`questionIds\` text NOT NULL, \`currentIndex\` int NOT NULL DEFAULT '0', \`currentServedAt\` datetime(3) NULL, \`scoreRound\` int NOT NULL DEFAULT '0', \`correctCount\` int NOT NULL DEFAULT '0', \`streak\` int NOT NULL DEFAULT '0', \`maxStreak\` int NOT NULL DEFAULT '0', \`lives\` int NULL, \`activeSeconds\` int NOT NULL DEFAULT '0', \`completionBonus\` int NOT NULL DEFAULT '0', \`startedAt\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`finishedAt\` datetime(3) NULL, INDEX \`IDX_3ec9461b8be9c9d2a56ac2aeec\` (\`status\`, \`mode\`, \`scoreRound\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(120) NOT NULL, \`email\` varchar(160) NOT NULL, \`password\` varchar(100) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`bestScore\` int NOT NULL DEFAULT '0', UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`answers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`answer\` varchar(400) NOT NULL, \`correct\` tinyint NOT NULL, \`questionId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`questions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`question\` varchar(400) NOT NULL, \`region\` tinyint UNSIGNED NOT NULL, \`difficulty\` tinyint UNSIGNED NOT NULL DEFAULT '1', \`explanation\` varchar(400) NULL, INDEX \`IDX_2ce5638ff465d8abc0a87f8938\` (\`region\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`achievements\` ADD CONSTRAINT \`FK_a4c9761e826d07a1f4c51ca1d2b\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`round_answers\` ADD CONSTRAINT \`FK_d8a73cfa573a37469cc85f9d6c5\` FOREIGN KEY (\`roundId\`) REFERENCES \`rounds\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rounds\` ADD CONSTRAINT \`FK_3a215664337ba61147fb832cec1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`answers\` ADD CONSTRAINT \`FK_c38697a57844f52584abdb878d7\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_c38697a57844f52584abdb878d7\``);
        await queryRunner.query(`ALTER TABLE \`rounds\` DROP FOREIGN KEY \`FK_3a215664337ba61147fb832cec1\``);
        await queryRunner.query(`ALTER TABLE \`round_answers\` DROP FOREIGN KEY \`FK_d8a73cfa573a37469cc85f9d6c5\``);
        await queryRunner.query(`ALTER TABLE \`achievements\` DROP FOREIGN KEY \`FK_a4c9761e826d07a1f4c51ca1d2b\``);
        await queryRunner.query(`DROP INDEX \`IDX_2ce5638ff465d8abc0a87f8938\` ON \`questions\``);
        await queryRunner.query(`DROP TABLE \`questions\``);
        await queryRunner.query(`DROP TABLE \`answers\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_3ec9461b8be9c9d2a56ac2aeec\` ON \`rounds\``);
        await queryRunner.query(`DROP TABLE \`rounds\``);
        await queryRunner.query(`DROP INDEX \`UQ_round_question\` ON \`round_answers\``);
        await queryRunner.query(`DROP TABLE \`round_answers\``);
        await queryRunner.query(`DROP INDEX \`UQ_user_achievement\` ON \`achievements\``);
        await queryRunner.query(`DROP TABLE \`achievements\``);
    }

}
