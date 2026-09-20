# blockchain-app

Учебный блокчейн на TypeScript: как устроены блоки, цепочка и хэш «под капотом» Web3.

Сейчас это локальная симуляция в одном процессе Node.js — без сети и без настоящего SHA-256. Следующие шаги: Proof of Work, транзакции и несколько нод по HTTP.

Схема: [блокчейн в FigJam](https://www.figma.com/board/tHMlEnG9OvXdJMnViOPMQc).

## Как запустить

Нужны [Node.js](https://nodejs.org/) 18+ и npm.

```bash
git clone https://github.com/azamxvit/blockchain-app.git
cd blockchain-app
npm install
npm start
```

`npm start` сначала компилирует TypeScript (`tsc`), затем запускает `dist/blockchain.js`.

Полезные команды:

| Команда | Что делает |
| --- | --- |
| `npm install` | Ставит TypeScript и типы Node.js |
| `npm run build` | Компилирует `src/` в `dist/` |
| `npm start` | Собирает проект и печатает цепочку в консоль |

Ожидаемый вывод — JSON с тремя блоками: Genesis, First Block, Second Block. Хэши пока выглядят как склейка полей (`index + previousHash + timestamp + data`), а не как SHA-256.

## Как это работает

```mermaid
%%{init: {"theme": "neutral", "themeVariables": {"fontSize": "18px"}, "flowchart": {"nodeSpacing": 40, "rankSpacing": 64, "padding": 16, "useMaxWidth": false}}}%%
flowchart TD
    start(["npm start"])

    subgraph engine ["Ядро"]
        direction TB
        genesis["createGenesisBlock"]
        add["addBlock"]
        hashFn[["calculateHash"]]
    end

    subgraph anatomy ["Поля блока"]
        direction TB
        idx["index"]
        prev["previousHash"]
        ts["timestamp"]
        payload["data"]
        digest["hash"]
    end

    subgraph ledger ["Цепочка"]
        direction TB
        b0["Block 0 — Genesis"]
        b1["Block 1 — First Block"]
        b2["Block 2 — Second Block"]
    end

    subgraph next ["Дальше по курсу"]
        direction TB
        sha["SHA-256"]
        pow["Proof of Work"]
        tx["Транзакции"]
        p2p["P2P HTTP"]
    end

    start --> genesis
    start --> add
    genesis --> b0
    add --> idx
    add --> prev
    add --> ts
    add --> payload
    prev -->|"берёт хэш прошлого блока"| hashFn
    idx --> hashFn
    ts --> hashFn
    payload --> hashFn
    hashFn --> digest
    digest --> b1
    digest --> b2
    b0 -->|"previousHash"| b1
    b1 -->|"previousHash"| b2
    b2 -.-> sha
    sha --> pow
    pow --> tx
    tx --> p2p
```

1. При старте создаётся **генезис-блок** — нулевой блок с `previousHash = "0"`.
2. Каждый новый блок берёт хэш предыдущего и пишет его в `previousHash`.
3. `calculateHash` склеивает поля блока в строку. Позже заменим это на SHA-256.
4. Цепочка хранится в массиве `chain`. Если изменить данные в середине, хэши перестанут сходиться.

Структура блока:

```
Block
├── index          номер в цепочке
├── previousHash   хэш предыдущего блока
├── timestamp      время создания
├── data           полезная нагрузка
└── hash           отпечаток этого блока
```

## Структура проекта

```
blockchain-app/
├── src/blockchain.ts   исходник цепочки
├── tsconfig.json       настройки компилятора
├── package.json        скрипты запуска
└── README.md
```

## Куда идём дальше

По гайдам Eddie / Savjee / freeCodeCamp:

1. Настоящий SHA-256 вместо склейки строк.
2. Proof of Work: подбор `nonce`, пока хэш не начнётся с нулей.
3. Транзакции, награды майнерам и подписи ECDSA (`elliptic`).
4. Express API и обмен блоками между несколькими терминалами.

Стек, к которому идём: TypeScript, `crypto` / `crypto-js`, `elliptic`, Express, WebSockets.
