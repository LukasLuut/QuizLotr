// Roda antes de cada arquivo de teste, antes de qualquer import do app.
// Os testes usam um banco separado (padrão: quiz_lotr_test), que é apagado e recriado.
process.env.NODE_ENV = 'test'
process.env.DB_NAME = process.env.TEST_DB_NAME || 'quiz_lotr_test'
process.env.JWT_SECRET = process.env.JWT_SECRET || 'segredo-de-teste'
process.env.BCRYPT_SALT_ROUNDS = '4'
