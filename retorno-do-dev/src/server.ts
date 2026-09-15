// src/server.ts
import app from './app'
import { AppDataSource } from './data-source'

const PORT = process.env.PORT || 3000

AppDataSource.initialize()
  .then(async () => {
    await AppDataSource.runMigrations();
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
  })
  .catch(err => console.error('Erro ao conectar no banco:', err))