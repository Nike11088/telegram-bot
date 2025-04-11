const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options')

const token = '8005249885:AAHqF1HNSEeMQIa1FboMd8JUqUZn8e67ixg'
const bot = new TelegramApi(token, { polling: true })
const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ей угадать!')
  chats[chatId] = Math.floor(Math.random() * 10)
  return bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветсвтие' },
    { command: '/info', description: 'Получить информацию о пользователе' },
    { command: '/game', description: 'Игра угадай цифру' },
  ])

  bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id

    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://cdn2.combot.org/tidytietom/webp/4xf09f918b.webp')
      return  bot.sendMessage(chatId, 'Добро пожаловать в тестовый бот!')
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}  ${msg.from.last_name ?? ''}`)
    }

    if (text === '/game') {
      startGame(chatId)
    }

    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз.')
  })

  bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id

    if (data === '/again') {
      return startGame(chatId)
    }

    console.log('data', data)
    console.log('chats[chatId]', chats[chatId])
    if (data == chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chats[chatId]}`,
        againOptions
      )
    } else {
      return await bot.sendMessage(
        chatId,
        `К сожалению ты не угадал, бот загадал цифрy ${chats[chatId]}`,
        againOptions
      )
    }
  })
}

start()
