# Vpnp-iceSpeech

На скорую руку сделанный back\front для взаимодействия с Yandex API SpeechKit для преобразования текста в голос.

![alt text](https://ibb.co/4FzPmKY)
![alt text](https://ibb.co/F4wN9vs)


## Tech

Vpnp-iceSpeech в проекте использованы:

- [Star Admin2] - Free-Bootstrap-Admin-Template!
- [NestJS] - A progressive Node.js framework!


## Getting Started

### Установка зависимостей

```sh
cd vpnp-iceSpeech
npm i
```

### CLI Yandex.Cloud

1. [Установка CLI Яндекс.Облака](https://cloud.yandex.ru/docs/cli/quickstart#install)
2. Получить токен

```sh
yc iam create-token
```

3. Добавить токен в конфигурационный файл config/token.json

```json
{"iamToken":"TOKEN"}
```

### Project Conf

Все основные настройки находятся в файле config/config.json

Для корректного запуска проекта нужно добавить folderId в yandex.folderId


```json
    "yandex": {
        "ttsUrl": "https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize",
        "folderId": "YOUR-FOLDER-ID",
        "tokenFolder": "../src/config"
    },
```

Если подключение к back будет по внешнему IP, то в public/config.js нужно поменять localhost на него

```js
const host = 'localhost:7789';
```

### Start

```sh
npm run start

or

pm2 start ecosystem.config.js 
```
