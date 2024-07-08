import TelegramBot from 'node-telegram-bot-api'
import { config } from 'dotenv'
import { startBot } from './bot'

// Загрузка переменных окружения из файла .env
config()

// Получение токена из переменных окружения
const token = process.env.TELEGRAM_BOT_TOKEN

if (!token) {
  console.error(
    'Не удалось загрузить токен бота. Убедитесь, что переменные окружения настроены правильно.'
  )
  process.exit(1)
}

// Создание экземпляра бота
const bot = new TelegramBot(token, { polling: true })

// Запуск бота
startBot(bot)
