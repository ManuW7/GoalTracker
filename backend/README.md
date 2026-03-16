# Backend

Бэкенд проекта GoalTracker написан на `FastAPI` и отвечает за:

- регистрацию и логин пользователей;
- работу с целями (`goals`);
- работу с действиями по целям (`actions`);
- хранение данных в PostgreSQL;
- миграции схемы через Alembic.

## Стек

- `FastAPI`
- `Uvicorn`
- `SQLAlchemy`
- `Alembic`
- `PostgreSQL`
- `python-jose` для JWT
- `pwdlib[argon2]` для хеширования паролей

## Структура

```text
backend/
├── app/
│   ├── core/        # конфиг и безопасность
│   ├── db/          # engine, session, base
│   ├── models/      # SQLAlchemy модели
│   ├── routers/     # API роуты
│   ├── services/    # бизнес-логика и ошибки
│   ├── main.py      # точка входа FastAPI
│   └── schemes.py   # Pydantic схемы
├── alembic/
│   └── versions/    # миграции
├── alembic.ini
├── requirements.txt
└── seed.py          # сид тестового пользователя
```

## Переменные окружения

Минимально нужны:

```env
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/goaltracker
ENV=dev
```

Что используется:

- `DATABASE_URL` обязателен, иначе приложение завершится с `RuntimeError`.
- `ENV=dev` включает SQLAlchemy `echo`.

## Установка и запуск

### 1. Установить зависимости

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Применить миграции

```bash
alembic upgrade head
```

### 3. При необходимости создать тестового пользователя

```bash
python seed.py
```

Скрипт создаёт пользователя с `id=100`, если его ещё нет.

### 4. Запустить сервер

```bash
uvicorn app.main:app --reload
```

По умолчанию сервер будет доступен на `http://127.0.0.1:8000`.

## CORS

Сейчас разрешены только фронтенд-адреса:

- `http://localhost:5173`
- `http://127.0.0.1:5173`

## Авторизация

Бэкенд использует Bearer JWT token.

### Получение токена

- `POST /auth/reg` регистрирует пользователя и сразу возвращает токен.
- `POST /auth/login` логинит пользователя и возвращает токен.

### Использование токена

Во всех защищённых эндпоинтах нужно передавать заголовок:

```http
Authorization: Bearer <access_token>
```

Параметры JWT в текущей реализации:

- алгоритм: `HS256`
- срок жизни токена: `120` минут

## API

После запуска интерактивная документация FastAPI доступна по адресам:

- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8000/redoc`

### Health check

#### `GET /db-check`

Проверяет подключение к базе и выполняет `SELECT 1`.

Пример ответа:

```json
{
  "select_1": 1
}
```

### Auth

#### `POST /auth/reg`

Создание пользователя.

Тело:

```json
{
  "username": "alice",
  "password": "strongpass123"
}
```

Ответ:

```json
{
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```

#### `POST /auth/login`

Логин через `OAuth2PasswordRequestForm`, то есть данные передаются как `form-data`:

```text
username=alice
password=strongpass123
```

Ответ:

```json
{
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```

### Goals

Все эндпоинты ниже требуют авторизацию.

#### `GET /goals/`

Возвращает список целей текущего пользователя.

Query-параметры:

- `start: datetime | null`
- `finish: datetime | null`

#### `GET /goals/{id}`

Возвращает цель по `id`.

#### `POST /goals/`

Создаёт цель.

Тело:

```json
{
  "name": "Read book",
  "description": "Read 20 pages",
  "color": "#22C55E",
  "date_set": "2026-03-16T00:00:00+00:00",
  "deadline": "2026-03-30T00:00:00+00:00",
  "everyday": true,
  "target_count": 14
}
```

Валидация:

- `color` должен быть в формате `#RRGGBB`;
- все даты должны быть в UTC, то есть с `+00:00`;
- `deadline` не может быть раньше `date_set`;
- для `everyday=true` дедлайн обязателен.

#### `PUT /goals/{id}`

Полностью обновляет цель. Принимает ту же схему, что и создание.

#### `DELETE /goals/{id}`

Удаляет цель и возвращает удалённый объект.

#### Формат ответа цели

```json
{
  "id": 1,
  "name": "Read book",
  "description": "Read 20 pages",
  "color": "#22C55E",
  "date_set": "2026-03-16T00:00:00+00:00",
  "deadline": "2026-03-30T00:00:00+00:00",
  "everyday": true,
  "target_count": 14,
  "current_count": 3,
  "streak": 2,
  "is_failed": false
}
```

Поля аналитики:

- `current_count` количество дней, в которые по цели было хотя бы одно действие;
- `streak` текущая серия дней подряд;
- `is_failed` вычисляется только для ежедневных целей.

### Actions

Все эндпоинты ниже требуют авторизацию.

#### `GET /actions/`

Возвращает действия по цели в заданном интервале.

Обязательные query-параметры:

- `goal_id: int`
- `start: datetime`
- `finish: datetime`

Правила:

- `start` и `finish` должны быть в UTC;
- `start < finish`.

#### `GET /actions/{id}`

Возвращает действие по `id`.

#### `POST /actions/`

Создаёт действие.

Тело:

```json
{
  "name": "Read chapter 1",
  "description": "20 pages completed",
  "date": "2026-03-16T10:30:00+00:00",
  "goal_id": 1
}
```

Валидация:

- дата должна быть в UTC;
- дата не может быть в будущем;
- дата не может быть раньше `date_set` цели;
- дата не может быть позже `deadline`, если он задан.

#### `PUT /actions/{id}`

Полностью обновляет действие. Принимает ту же схему, что и создание.

#### `DELETE /actions/{id}`

Удаляет действие и возвращает удалённый объект.

#### Формат ответа действия

```json
{
  "id": 1,
  "name": "Read chapter 1",
  "description": "20 pages completed",
  "date": "2026-03-16T10:30:00+00:00",
  "goal_id": 1
}
```

## Формат ошибок

Все кастомные ошибки приводятся к единому виду:

```json
{
  "error": {
    "code": "invalid_token",
    "message": "Invalid or expired token",
    "field": "token"
  }
}
```

Примеры кодов ошибок:

- `invalid_token`
- `permission_denied`
- `goal_not_found`
- `id_not_found`
- `invalid_timezone`
- `deadline_before_date_set`
- `action_before_goal`
- `action_after_deadline`
- `invalid_interval`
- `user_already_exists`
- `username_not_found`
- `invalid_password`
- `unique_violation`

## Миграции

Основные команды Alembic:

```bash
alembic revision --autogenerate -m "message"
alembic upgrade head
alembic downgrade -1
```

Текущая стартовая миграция создаёт таблицы:

- `users`
- `goals`
- `actions`

## Известные особенности текущей реализации

- `SECRET_KEY` для JWT сейчас захардкожен в коде в `app/core/secure.py`; для production это нужно вынести в переменные окружения.
- В `GoalResponse` и сервисах используется поле `target_count`, но в текущей миграции таблицы `goals` такого столбца нет. Если планируется хранить это поле в БД, нужна отдельная миграция.
- Для `POST /auth/login` используется form-based OAuth2 логин, а не JSON body.
- У `GET /actions/` параметры `start` и `finish` обязательны.

## Полезные файлы

- `app/main.py` - инициализация FastAPI и подключение роутеров
- `app/routers/auth.py` - авторизация
- `app/routers/goals.py` - API целей
- `app/routers/actions.py` - API действий
- `app/services/service.py` - бизнес-логика целей и действий
- `app/services/users.py` - бизнес-логика пользователей
- `app/core/secure.py` - JWT и текущий пользователь
- `app/db/session.py` - подключение к БД и сессии
