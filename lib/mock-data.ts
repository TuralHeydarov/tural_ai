export interface Page {
  id: string;
  title: string;
  content: string;
  icon: string;
  createdAt: string;
}

export interface TableColumn {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select';
}

export interface TableRow {
  id: string;
  data: Record<string, any>;
}

export interface Table {
  id: string;
  name: string;
  icon: string;
  columns: TableColumn[];
  rows: TableRow[];
  createdAt: string;
}

// In-memory storage
export const mockPages: Page[] = [
  {
    id: '1',
    title: 'Добро пожаловать',
    content: 'Это ваша первая страница в Workspace',
    icon: '👋',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Заметки',
    content: 'Здесь можно делать заметки',
    icon: '📝',
    createdAt: new Date().toISOString(),
  },
];

export const mockTables: Table[] = [
  {
    id: '1',
    name: 'Проекты',
    icon: '📊',
    columns: [
      { id: 'col1', name: 'Название', type: 'text' },
      { id: 'col2', name: 'Статус', type: 'select' },
      { id: 'col3', name: 'Дата', type: 'date' },
    ],
    rows: [
      {
        id: 'row1',
        data: {
          col1: 'Проект 1',
          col2: 'В работе',
          col3: new Date().toISOString(),
        },
      },
      {
        id: 'row2',
        data: {
          col1: 'Проект 2',
          col2: 'Завершен',
          col3: new Date().toISOString(),
        },
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

// Helper functions
export const findPageById = (id: string): Page | undefined => {
  return mockPages.find((page) => page.id === id);
};

export const findTableById = (id: string): Table | undefined => {
  return mockTables.find((table) => table.id === id);
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};
