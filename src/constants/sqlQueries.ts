export interface SQLQuery {
  id: string;
  title: string;
  description: string;
  sql: string;
  category: 'Sales' | 'Product' | 'Customer' | 'Time' | 'Advanced';
}

export const SQL_QUERIES: SQLQuery[] = [
  {
    id: 'q1',
    title: 'Топ-10 самых продаваемых книг по выручке',
    description: 'Определяет книги, принесшие наибольший доход.',
    category: 'Product',
    sql: `SELECT 
    b.title, 
    SUM(f.total_amount) as total_revenue
FROM fact_sales f
JOIN dim_books b ON f.book_id = b.book_id
GROUP BY b.title
ORDER BY total_revenue DESC
LIMIT 10;`
  },
  {
    id: 'q2',
    title: 'Выручка по категориям (ABC-анализ)',
    description: 'Расчет доли каждой категории в общей выручке.',
    category: 'Product',
    sql: `WITH category_sales AS (
    SELECT 
        c.category_name,
        SUM(f.total_amount) as revenue
    FROM fact_sales f
    JOIN dim_books b ON f.book_id = b.book_id
    JOIN dim_categories c ON b.category_id = c.category_id
    GROUP BY c.category_name
),
total_sales AS (
    SELECT SUM(revenue) as grand_total FROM category_sales
)
SELECT 
    category_name,
    revenue,
    (revenue / grand_total * 100) as percentage,
    SUM(revenue) OVER(ORDER BY revenue DESC) / grand_total as cumulative_share
FROM category_sales, total_sales
ORDER BY revenue DESC;`
  },
  {
    id: 'q3',
    title: 'Сезонность: Продажи по месяцам и годам',
    description: 'Сравнение динамики продаж месяц к месяцу.',
    category: 'Time',
    sql: `SELECT 
    d.year,
    d.month,
    SUM(f.total_amount) as monthly_revenue,
    LAG(SUM(f.total_amount)) OVER (ORDER BY d.year, d.month) as prev_month_revenue,
    (SUM(f.total_amount) - LAG(SUM(f.total_amount)) OVER (ORDER BY d.year, d.month)) / 
        LAG(SUM(f.total_amount)) OVER (ORDER BY d.year, d.month) * 100 as growth_rate
FROM fact_sales f
JOIN dim_dates d ON f.date_id = d.date_id
GROUP BY d.year, d.month
ORDER BY d.year, d.month;`
  },
  {
    id: 'q4',
    title: 'Когортный анализ: Удержание клиентов',
    description: 'Анализ поведения групп клиентов по месяцу регистрации.',
    category: 'Advanced',
    sql: `WITH cohort_items AS (
    SELECT 
        customer_id,
        MIN(date_trunc('month', registration_date)) as cohort_month
    FROM dim_customers
    GROUP BY 1
),
user_activities AS (
    SELECT
        f.customer_id,
        date_part('month', age(date_trunc('month', d.full_date), c.cohort_month)) as month_number
    FROM fact_sales f
    JOIN dim_dates d ON f.date_id = d.date_id
    JOIN cohort_items c ON f.customer_id = c.customer_id
)
SELECT 
    cohort_month,
    month_number,
    COUNT(DISTINCT customer_id) as active_users
FROM user_activities
GROUP BY 1, 2
ORDER BY 1, 2;`
  },
  {
    id: 'q5',
    title: 'RFM-анализ клиентов',
    description: 'Сегментация клиентов по давности, частоте и сумме покупок.',
    category: 'Customer',
    sql: `WITH rfm AS (
    SELECT 
        customer_id,
        MAX(full_date) as last_order_date,
        COUNT(sale_id) as frequency,
        SUM(total_amount) as monetary
    FROM fact_sales f
    JOIN dim_dates d ON f.date_id = d.date_id
    GROUP BY customer_id
)
SELECT 
    customer_id,
    NTILE(5) OVER (ORDER BY last_order_date) as recency_score,
    NTILE(5) OVER (ORDER BY frequency) as frequency_score,
    NTILE(5) OVER (ORDER BY monetary) as monetary_score
FROM rfm;`
  },
  {
    id: 'q6',
    title: 'Средний чек по регионам',
    description: 'Сравнение эффективности магазинов в разных городах.',
    category: 'Sales',
    sql: `SELECT 
    s.city,
    COUNT(f.sale_id) as total_orders,
    AVG(f.total_amount) as avg_order_value
FROM fact_sales f
JOIN dim_stores s ON f.store_id = s.store_id
GROUP BY s.city
ORDER BY avg_order_value DESC;`
  },
  {
    id: 'q7',
    title: 'Книги, которые никогда не продавались',
    description: 'Поиск неликвидного товара.',
    category: 'Product',
    sql: `SELECT b.title, b.author
FROM dim_books b
LEFT JOIN fact_sales f ON b.book_id = f.book_id
WHERE f.sale_id IS NULL;`
  },
  {
    id: 'q8',
    title: 'Накопительный итог продаж по дням',
    description: 'Расчет кумулятивной выручки в течение года.',
    category: 'Time',
    sql: `SELECT 
    d.full_date,
    SUM(f.total_amount) OVER (ORDER BY d.full_date) as running_total
FROM fact_sales f
JOIN dim_dates d ON f.date_id = d.date_id
WHERE d.year = 2023;`
  },
  {
    id: 'q9',
    title: 'Самые активные часы продаж',
    description: 'Определение пиковых нагрузок на магазины.',
    category: 'Time',
    sql: `SELECT 
    EXTRACT(HOUR FROM d.full_date) as hour_of_day,
    COUNT(*) as sales_count
FROM fact_sales f
JOIN dim_dates d ON f.date_id = d.date_id
GROUP BY 1
ORDER BY 2 DESC;`
  },
  {
    id: 'q10',
    title: 'Клиенты с покупками более чем в 3 категориях',
    description: 'Выявление лояльных клиентов с широкими интересами.',
    category: 'Customer',
    sql: `SELECT 
    c.first_name, c.last_name,
    COUNT(DISTINCT b.category_id) as unique_categories
FROM fact_sales f
JOIN dim_customers c ON f.customer_id = c.customer_id
JOIN dim_books b ON f.book_id = b.book_id
GROUP BY c.customer_id, c.first_name, c.last_name
HAVING COUNT(DISTINCT b.category_id) > 3;`
  },
  {
    id: 'q11',
    title: 'Доля продаж новых книг (выпущенных в текущем году)',
    description: 'Анализ актуальности ассортимента.',
    category: 'Product',
    sql: `SELECT 
    (SUM(CASE WHEN b.publish_year = 2023 THEN f.total_amount ELSE 0 END) / SUM(f.total_amount)) * 100 as new_books_revenue_share
FROM fact_sales f
JOIN dim_books b ON f.book_id = b.book_id;`
  },
  {
    id: 'q12',
    title: 'Топ-3 автора в каждой категории',
    description: 'Использование оконных функций для ранжирования.',
    category: 'Product',
    sql: `WITH author_rankings AS (
    SELECT 
        c.category_name,
        b.author,
        SUM(f.total_amount) as revenue,
        RANK() OVER (PARTITION BY c.category_name ORDER BY SUM(f.total_amount) DESC) as rnk
    FROM fact_sales f
    JOIN dim_books b ON f.book_id = b.book_id
    JOIN dim_categories c ON b.category_id = c.category_id
    GROUP BY 1, 2
)
SELECT * FROM author_rankings WHERE rnk <= 3;`
  },
  {
    id: 'q13',
    title: 'Среднее время между покупками клиента',
    description: 'Анализ частоты возвращения покупателей.',
    category: 'Customer',
    sql: `WITH order_intervals AS (
    SELECT 
        customer_id,
        full_date,
        LAG(full_date) OVER (PARTITION BY customer_id ORDER BY full_date) as prev_date
    FROM fact_sales f
    JOIN dim_dates d ON f.date_id = d.date_id
)
SELECT 
    AVG(full_date - prev_date) as avg_days_between_orders
FROM order_intervals
WHERE prev_date IS NOT NULL;`
  },
  {
    id: 'q14',
    title: 'Продажи в выходные vs будни',
    description: 'Сравнение потребительского поведения.',
    category: 'Time',
    sql: `SELECT 
    CASE WHEN d.day_of_week IN (6, 7) THEN 'Weekend' ELSE 'Weekday' END as day_type,
    SUM(f.total_amount) as revenue,
    AVG(f.total_amount) as avg_sale
FROM fact_sales f
JOIN dim_dates d ON f.date_id = d.date_id
GROUP BY 1;`
  },
  {
    id: 'q15',
    title: 'Z-Score продаж по магазинам',
    description: 'Статистический анализ отклонений выручки.',
    category: 'Advanced',
    sql: `WITH store_stats AS (
    SELECT 
        store_id,
        SUM(total_amount) as revenue
    FROM fact_sales
    GROUP BY 1
),
metrics AS (
    SELECT 
        AVG(revenue) as avg_rev,
        STDDEV(revenue) as std_rev
    FROM store_stats
)
SELECT 
    s.store_id,
    (s.revenue - m.avg_rev) / m.std_rev as z_score
FROM store_stats s, metrics m;`
  },
  {
    id: 'q16',
    title: 'Популярные пары книг (Market Basket Analysis)',
    description: 'Какие книги чаще всего покупают вместе.',
    category: 'Advanced',
    sql: `SELECT 
    f1.book_id as book_a,
    f2.book_id as book_b,
    COUNT(*) as frequency
FROM fact_sales f1
JOIN fact_sales f2 ON f1.sale_id = f2.sale_id AND f1.book_id < f2.book_id
GROUP BY 1, 2
ORDER BY 3 DESC
LIMIT 10;`
  },
  {
    id: 'q17',
    title: 'Процент возвратов по категориям',
    description: 'Анализ качества или соответствия ожиданиям.',
    category: 'Sales',
    sql: `SELECT 
    c.category_name,
    COUNT(CASE WHEN f.status = 'returned' THEN 1 END)::float / COUNT(*) * 100 as return_rate
FROM fact_sales f
JOIN dim_books b ON f.book_id = b.book_id
JOIN dim_categories c ON b.category_id = c.category_id
GROUP BY 1
ORDER BY 2 DESC;`
  },
  {
    id: 'q18',
    title: 'LTV (Lifetime Value) по городам',
    description: 'Прогнозируемая ценность клиента в зависимости от локации.',
    category: 'Customer',
    sql: `SELECT 
    c.city,
    SUM(f.total_amount) / COUNT(DISTINCT c.customer_id) as avg_ltv
FROM fact_sales f
JOIN dim_customers c ON f.customer_id = c.customer_id
GROUP BY 1
ORDER BY 2 DESC;`
  },
  {
    id: 'q19',
    title: 'Продажи по кварталам с расчетом YoY',
    description: 'Годовой анализ роста.',
    category: 'Time',
    sql: `SELECT 
    d.year,
    d.quarter,
    SUM(f.total_amount) as revenue,
    LAG(SUM(f.total_amount), 4) OVER (ORDER BY d.year, d.quarter) as prev_year_revenue
FROM fact_sales f
JOIN dim_dates d ON f.date_id = d.date_id
GROUP BY 1, 2;`
  },
  {
    id: 'q20',
    title: 'Топ-5 самых дорогих проданных книг',
    description: 'Анализ премиум-сегмента.',
    category: 'Product',
    sql: `SELECT DISTINCT b.title, b.price
FROM fact_sales f
JOIN dim_books b ON f.book_id = b.book_id
ORDER BY b.price DESC
LIMIT 5;`
  },
  {
    id: 'q21',
    title: 'Эффективность скидок',
    description: 'Влияние дисконта на объем продаж.',
    category: 'Sales',
    sql: `SELECT 
    discount_level,
    COUNT(*) as sales_count,
    AVG(total_amount) as avg_revenue
FROM fact_sales
GROUP BY discount_level;`
  },
  {
    id: 'q22',
    title: 'Клиенты, совершившие покупку в первый день регистрации',
    description: 'Анализ конверсии новых пользователей.',
    category: 'Customer',
    sql: `SELECT COUNT(DISTINCT c.customer_id)
FROM dim_customers c
JOIN fact_sales f ON c.customer_id = f.customer_id
JOIN dim_dates d ON f.date_id = d.date_id
WHERE d.full_date::date = c.registration_date::date;`
  },
  {
    id: 'q23',
    title: 'Скользящее среднее выручки за 7 дней',
    description: 'Сглаживание ежедневных колебаний.',
    category: 'Advanced',
    sql: `SELECT 
    d.full_date,
    SUM(f.total_amount) as daily_revenue,
    AVG(SUM(f.total_amount)) OVER (ORDER BY d.full_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as moving_avg_7d
FROM fact_sales f
JOIN dim_dates d ON f.date_id = d.date_id
GROUP BY d.full_date;`
  },
  {
    id: 'q24',
    title: 'Самый прибыльный день недели для каждой категории',
    description: 'Оптимизация маркетинговых акций.',
    category: 'Time',
    sql: `WITH day_sales AS (
    SELECT 
        c.category_name,
        d.day_of_week,
        SUM(f.total_amount) as revenue,
        RANK() OVER (PARTITION BY c.category_name ORDER BY SUM(f.total_amount) DESC) as rnk
    FROM fact_sales f
    JOIN dim_dates d ON f.date_id = d.date_id
    JOIN dim_books b ON f.book_id = b.book_id
    JOIN dim_categories c ON b.category_id = c.category_id
    GROUP BY 1, 2
)
SELECT * FROM day_sales WHERE rnk = 1;`
  },
  {
    id: 'q25',
    title: 'Доля повторных покупок',
    description: 'Лояльность клиентской базы.',
    category: 'Customer',
    sql: `SELECT 
    (COUNT(DISTINCT CASE WHEN order_count > 1 THEN customer_id END)::float / COUNT(DISTINCT customer_id)) * 100 as repeat_buyer_rate
FROM (
    SELECT customer_id, COUNT(*) as order_count
    FROM fact_sales
    GROUP BY customer_id
) t;`
  },
  {
    id: 'q26',
    title: 'Анализ "брошенных" авторов',
    description: 'Авторы, чьи книги перестали покупать в последние 6 месяцев.',
    category: 'Product',
    sql: `SELECT b.author
FROM dim_books b
JOIN fact_sales f ON b.book_id = f.book_id
GROUP BY b.author
HAVING MAX(f.sale_date) < CURRENT_DATE - INTERVAL '6 months';`
  },
  {
    id: 'q27',
    title: 'Выручка на квадратный метр (условно)',
    description: 'Эффективность торговых площадей.',
    category: 'Sales',
    sql: `SELECT 
    s.store_name,
    SUM(f.total_amount) / s.square_meters as revenue_per_sqm
FROM fact_sales f
JOIN dim_stores s ON f.store_id = s.store_id
GROUP BY s.store_name, s.square_meters;`
  },
  {
    id: 'q28',
    title: 'Разница между ценой книги и средним чеком клиента',
    description: 'Понимание ценового сегмента покупателя.',
    category: 'Advanced',
    sql: `SELECT 
    f.customer_id,
    b.title,
    b.price - AVG(f.total_amount) OVER (PARTITION BY f.customer_id) as price_diff
FROM fact_sales f
JOIN dim_books b ON f.book_id = b.book_id;`
  },
  {
    id: 'q29',
    title: 'Продажи по возрастным группам (если есть данные)',
    description: 'Демографический анализ.',
    category: 'Customer',
    sql: `SELECT 
    CASE 
        WHEN age < 20 THEN 'Under 20'
        WHEN age BETWEEN 20 AND 40 THEN '20-40'
        ELSE 'Over 40'
    END as age_group,
    SUM(total_amount) as revenue
FROM fact_sales f
JOIN dim_customers c ON f.customer_id = c.customer_id
GROUP BY 1;`
  },
  {
    id: 'q30',
    title: 'Медианная стоимость покупки',
    description: 'Более точная метрика, чем среднее арифметическое.',
    category: 'Sales',
    sql: `SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_amount) as median_revenue
FROM fact_sales;`
  },
  {
    id: 'q31',
    title: 'Анализ влияния праздников на продажи',
    description: 'Сравнение праздничных дней с обычными.',
    category: 'Time',
    sql: `SELECT 
    is_holiday,
    AVG(total_amount) as avg_daily_revenue
FROM fact_sales f
JOIN dim_dates d ON f.date_id = d.date_id
GROUP BY is_holiday;`
  }
];
