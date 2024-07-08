import { Client } from 'pg'

// Подключение к PostgreSQL
const client = new Client({
  connectionString: 'postgresql://aldarbazarov:kut29hvm@localhost:5432/everyday-todo-bot'
})
client.connect()

export default client
