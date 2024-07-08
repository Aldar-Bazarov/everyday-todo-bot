import { schedule, ScheduledTask } from 'node-cron'
import TelegramBot from 'node-telegram-bot-api'
import client from './db'
import { config } from 'dotenv'

// Загрузка переменных окружения из файла .env
config()

const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

let scheduledTask: ScheduledTask | null = null

// Периодическая отправка списка задач
export function startScheduler(bot: TelegramBot, taskKeyboard: object): void {
  if (TELEGRAM_CHAT_ID) {
    if (scheduledTask == null) {
      bot.sendMessage(TELEGRAM_CHAT_ID, 'Уведомления включены', taskKeyboard)
      scheduledTask = schedule('0 9,12,15,18,21 * * *', async () => {
        const res = await client.query('SELECT * FROM tasks')
        const tasks = res.rows.map((task) => `${task.id}: ${task.description}`).join('\n')
        bot.sendMessage(TELEGRAM_CHAT_ID, tasks || 'Нет активных задач')
      })
    } else {
      bot.sendMessage(TELEGRAM_CHAT_ID, 'Уведолмения уже включены', taskKeyboard)
    }
  }
}

// Остановка шедулера
export function stopScheduler(): void {
  if (scheduledTask) {
    scheduledTask.stop()
    scheduledTask = null
  }
}
