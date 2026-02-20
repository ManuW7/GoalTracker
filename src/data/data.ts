export type Goal = {
  ID: number;
  name: string;
  description: string;
  color: string;
  dateSet: Date;
};

export type Action = {
  ID: number;
  name: string;
  goalID: number;
  description: string;
  date: Date;
};

export const goals: Goal[] = [
  {
    ID: 1,
    name: "Изучить TypeScript",
    description: "Освоить основы TypeScript и начать использовать в проектах",
    color: "#3B82F6",
    dateSet: new Date("2026-01-15T10:00:00Z"),
  },
  {
    ID: 2,
    name: "Вести здоровый образ жизни",
    description: "Улучшить физическую форму и самочувствие",
    color: "#10B981",
    dateSet: new Date("2026-01-20T08:00:00Z"),
  },
  {
    ID: 3,
    name: "Прочитать 12 книг за год",
    description: "Развиваться профессионально и расширять кругозор",
    color: "#8B5CF6",
    dateSet: new Date("2026-01-10T12:00:00Z"),
  },
  {
    ID: 4,
    name: "Создать портфолио проектов",
    description: "Подготовить 5 завершенных проектов для демонстрации навыков",
    color: "#F59E0B",
    dateSet: new Date("2026-02-01T09:00:00Z"),
  },
  {
    ID: 5,
    name: "Накопить финансовую подушку",
    description: "Создать запас на 6 месяцев расходов",
    color: "#EF4444",
    dateSet: new Date("2026-01-05T14:00:00Z"),
  },
];

export const actions: Action[] = [
  // Действия для цели 1: Изучить TypeScript
  {
    ID: 1,
    name: "Прошёл курс по основам TypeScript",
    goalID: 1,
    description: "Завершил онлайн-курс на Stepik — 12 часов теории и практики",
    date: new Date("2026-01-16T10:00:00Z"),
  },
  {
    ID: 2,
    name: "Настроил TypeScript в проекте",
    goalID: 1,
    description: "Добавил tsconfig.json и типизировал все компоненты",
    date: new Date("2026-01-18T11:00:00Z"),
  },
  {
    ID: 3,
    name: "Изучил продвинутые типы",
    goalID: 1,
    description: "Разобрался с Generics, Utility Types и Conditional Types",
    date: new Date("2026-02-01T09:00:00Z"),
  },
  // Действия для цели 2: Вести здоровый образ жизни
  {
    ID: 4,
    name: "Записался в тренажерный зал",
    goalID: 2,
    description: "Выбрал зал рядом с домом и купил абонемент на 3 месяца",
    date: new Date("2026-01-21T08:00:00Z"),
  },
  {
    ID: 5,
    name: "Составил план тренировок",
    goalID: 2,
    description: "Программа на 3 тренировки в неделю с тренером",
    date: new Date("2026-01-22T10:00:00Z"),
  },
  {
    ID: 6,
    name: "Наладил режим сна",
    goalID: 2,
    description: "Сплю по 8 часов в сутки — ложусь в 23:00",
    date: new Date("2026-01-25T20:00:00Z"),
  },
  // Действия для цели 3: Прочитать 12 книг за год
  {
    ID: 7,
    name: "Составил список книг на год",
    goalID: 3,
    description: "Включил 12 книг по программированию и саморазвитию",
    date: new Date("2026-01-11T12:00:00Z"),
  },
  {
    ID: 8,
    name: "Прочитал 'Чистый код'",
    goalID: 3,
    description: "Роберт Мартин — 450 страниц полезных практик",
    date: new Date("2026-01-15T18:00:00Z"),
  },
  {
    ID: 9,
    name: "Прочитал 'Совершенный код'",
    goalID: 3,
    description: "Стив Макконнелл — углубленное изучение практик разработки",
    date: new Date("2026-02-10T18:00:00Z"),
  },
  // Действия для цели 4: Создать портфолио проектов
  {
    ID: 10,
    name: "Создал проект Goal Tracker",
    goalID: 4,
    description: "Приложение для отслеживания целей и действий на React + TypeScript",
    date: new Date("2026-02-05T09:00:00Z"),
  },
  {
    ID: 11,
    name: "Разместил проекты на GitHub",
    goalID: 4,
    description: "Заполнил README и добавил скриншоты к 3 проектам",
    date: new Date("2026-02-08T14:00:00Z"),
  },
  {
    ID: 12,
    name: "Создал сайт-портфолио",
    goalID: 4,
    description: "Лендинг с описанием проектов и контактами на Vercel",
    date: new Date("2026-02-15T10:00:00Z"),
  },
  // Действия для цели 5: Накопить финансовую подушку
  {
    ID: 13,
    name: "Открыл накопительный счет",
    goalID: 5,
    description: "Выбрал Тинькофф с ставкой 16% годовых",
    date: new Date("2026-01-06T14:00:00Z"),
  },
  {
    ID: 14,
    name: "Настроил автопополнение",
    goalID: 5,
    description: "20% от дохода автоматически переводятся на накопительный счет",
    date: new Date("2026-01-08T15:00:00Z"),
  },
  {
    ID: 15,
    name: "Вёл учет расходов",
    goalID: 5,
    description: "Использовал приложение CoinKeeper для контроля бюджета",
    date: new Date("2026-02-01T12:00:00Z"),
  },
];
