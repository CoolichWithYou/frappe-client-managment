### Client Management

## Содержание

1. [Описание](#1-описание)
2. [Переменные среды](#2-переменные-среды)

## 1. Описание

Модуль frappe для валидации клиентской базы.

Демонстрацию работы можно посмотреть тут `demonstration/2025-08-08%2015-34-24.mkv`

Для запуска:

Создаём bench, добавляем в него текущий репозиторий
и [репозиторий сайта](https://github.com/CoolichWithYou/frappe-sites)

Запускаем postgresql:

`docker compose up --build -d`

Подключаем сайт к нашему приложению

`bench --site clients.localhost install-app client_management`

Устанавливаем зависимости

`bench pip install -r requirements.txt`

Переходим на `clients.localhost:8000`, создаём таблицу Client с полями:

|   Label | Type         | Name    |
|--------:|:-------------|---------|
|    name | autocomplete | name1   |
|     inn | autocomplete | inn     |
|     kpp | autocomplete | kpp     |
| address | small_text   | address |



## 2. Переменные среды

Переменные среды для запуска базы данных

| Секрет/перменная среды | Значение по умолчанию | Краткое описание     |
|-----------------------:|:----------------------|----------------------|
|            POSTGRES_DB | frappe                | название базы данных |
|          POSTGRES_USER | frappe                | пользователь бд      |
|      POSTGRES_PASSWORD | 13252                 | пароль бд            |

