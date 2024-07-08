import { config } from 'dotenv'
import { Client } from 'pg'

// Загрузка переменных окружения из файла .env
config()

// Подключение к PostgreSQL
const client = new Client({
  connectionString: process.env.BD_CONNECTION_STRING
})
client.connect()

export default client
