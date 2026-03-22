import { SQL_QUERIES } from './constants/sqlQueries';

export const MOCK_DASHBOARD_DATA = {
  salesByCategory: [
    { name: 'Художественная', value: 450000 },
    { name: 'Научпоп', value: 320000 },
    { name: 'Детская', value: 210000 },
    { name: 'Бизнес', value: 180000 },
    { name: 'Технологии', value: 150000 },
  ],
  monthlyRevenue: [
    { month: 'Янв', revenue: 120000 },
    { month: 'Фев', revenue: 135000 },
    { month: 'Мар', revenue: 150000 },
    { month: 'Апр', revenue: 140000 },
    { month: 'Май', revenue: 160000 },
    { month: 'Июн', revenue: 180000 },
    { month: 'Июл', revenue: 175000 },
    { month: 'Авг', revenue: 190000 },
    { month: 'Сен', revenue: 210000 },
    { month: 'Окт', revenue: 230000 },
    { month: 'Ноя', revenue: 250000 },
    { month: 'Дек', revenue: 320000 },
  ],
  cohortRetention: [
    { month: 'M0', rate: 100 },
    { month: 'M1', rate: 45 },
    { month: 'M2', rate: 32 },
    { month: 'M3', rate: 28 },
    { month: 'M4', rate: 25 },
    { month: 'M5', rate: 22 },
  ],
  topBooks: [
    { title: 'Чистый код', author: 'Роберт Мартин', sales: 1240 },
    { title: 'Sapiens', author: 'Юваль Харари', sales: 1100 },
    { title: 'Атлант расправил плечи', author: 'Айн Рэнд', sales: 950 },
    { title: '1984', author: 'Джордж Оруэлл', sales: 880 },
    { title: 'Думай медленно...', author: 'Даниэль Канеман', sales: 820 },
  ]
};

export const STAR_SCHEMA_NODES = [
  { id: 'fact_sales', name: 'fact_sales', type: 'fact', fields: ['sale_id', 'date_id', 'book_id', 'customer_id', 'store_id', 'quantity', 'total_amount'] },
  { id: 'dim_books', name: 'dim_books', type: 'dim', fields: ['book_id', 'title', 'author', 'category_id', 'price'] },
  { id: 'dim_customers', name: 'dim_customers', type: 'dim', fields: ['customer_id', 'name', 'email', 'city', 'reg_date'] },
  { id: 'dim_dates', name: 'dim_dates', type: 'dim', fields: ['date_id', 'full_date', 'year', 'month', 'day_of_week'] },
  { id: 'dim_stores', name: 'dim_stores', type: 'dim', fields: ['store_id', 'store_name', 'city', 'region'] },
  { id: 'dim_categories', name: 'dim_categories', type: 'dim', fields: ['category_id', 'category_name'] },
];
