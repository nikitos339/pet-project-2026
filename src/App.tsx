import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Database, 
  Code2, 
  TrendingUp, 
  Users, 
  BookOpen, 
  ChevronRight, 
  Search,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Github,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SQL_QUERIES, SQLQuery } from './constants/sqlQueries';
import { MOCK_DASHBOARD_DATA, STAR_SCHEMA_NODES } from './data';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = ['#141414', '#404040', '#737373', '#A3A3A3', '#D4D4D4'];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schema' | 'sql'>('dashboard');
  const [selectedQuery, setSelectedQuery] = useState<SQLQuery | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQueries = SQL_QUERIES.filter(q => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-[#141414] bg-[#E4E3E0] z-50 hidden md:flex flex-col">
        <div className="p-8 border-bottom border-[#141414]">
          <h1 className="font-serif italic text-2xl font-bold tracking-tight">BookStore.sql</h1>
          <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Analytics Platform v1.0</p>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all",
              activeTab === 'dashboard' ? "bg-[#141414] text-[#E4E3E0]" : "hover:bg-[#141414]/5"
            )}
          >
            <LayoutDashboard size={18} />
            Дашборд
          </button>
          <button 
            onClick={() => setActiveTab('schema')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all",
              activeTab === 'schema' ? "bg-[#141414] text-[#E4E3E0]" : "hover:bg-[#141414]/5"
            )}
          >
            <Database size={18} />
            Схема данных
          </button>
          <button 
            onClick={() => setActiveTab('sql')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all",
              activeTab === 'sql' ? "bg-[#141414] text-[#E4E3E0]" : "hover:bg-[#141414]/5"
            )}
          >
            <Code2 size={18} />
            SQL Лаборатория
          </button>
        </nav>

        <div className="p-8 border-t border-[#141414]">
          <div className="flex items-center gap-3 opacity-50 hover:opacity-100 cursor-pointer transition-opacity">
            <Github size={18} />
            <span className="text-xs font-mono">pet-project-2026</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border border-[#141414]">PostgreSQL</span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border border-[#141414]">Star Schema</span>
            </div>
            <h2 className="text-5xl font-serif italic font-bold">
              {activeTab === 'dashboard' && "Анализ продаж"}
              {activeTab === 'schema' && "Архитектура БД"}
              {activeTab === 'sql' && "SQL Запросы"}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono opacity-50">ПОСЛЕДНЕЕ ОБНОВЛЕНИЕ</p>
            <p className="text-sm font-medium">22 МАРТА 2026, 13:09</p>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[#141414] border border-[#141414]">
                {[
                  { label: 'ОБЩАЯ ВЫРУЧКА', value: '₽2.48M', trend: '+12.5%', up: true },
                  { label: 'СРЕДНИЙ ЧЕК', value: '₽1,420', trend: '+3.2%', up: true },
                  { label: 'АКТИВНЫЕ КЛИЕНТЫ', value: '12,402', trend: '-0.8%', up: false },
                  { label: 'ПРОДАНО КНИГ', value: '45,201', trend: '+18.4%', up: true },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#E4E3E0] p-6">
                    <p className="text-[10px] font-mono opacity-50 mb-2">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">{stat.value}</span>
                      <span className={cn("text-[10px] font-bold", stat.up ? "text-emerald-700" : "text-rose-700")}>
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="border border-[#141414] p-8 bg-[#E4E3E0]">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-serif italic text-xl font-bold">Выручка по месяцам</h3>
                    <TrendingUp size={18} className="opacity-50" />
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_DASHBOARD_DATA.monthlyRevenue}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#141414" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#141414" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#141414" strokeOpacity={0.1} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#141414', border: 'none', color: '#E4E3E0', fontFamily: 'monospace', fontSize: '10px' }}
                          itemStyle={{ color: '#E4E3E0' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#141414" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="border border-[#141414] p-8 bg-[#E4E3E0]">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-serif italic text-xl font-bold">Доля категорий</h3>
                    <PieChartIcon size={18} className="opacity-50" />
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={MOCK_DASHBOARD_DATA.salesByCategory}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent, x, y, cx }) => (
                            <text 
                              x={x} 
                              y={y} 
                              fill="#141414" 
                              textAnchor={x > cx ? 'start' : 'end'} 
                              dominantBaseline="central"
                              fontSize="10px"
                              fontFamily="monospace"
                            >
                              {`${name} ${(percent * 100).toFixed(0)}%`}
                            </text>
                          )}
                          labelLine={true}
                        >
                          {MOCK_DASHBOARD_DATA.salesByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#141414', border: 'none', color: '#E4E3E0', fontFamily: 'monospace', fontSize: '10px' }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          align="center"
                          iconType="circle"
                          wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '20px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 border border-[#141414] p-8 bg-[#E4E3E0]">
                  <h3 className="font-serif italic text-xl font-bold mb-8">Топ-5 бестселлеров</h3>
                  <div className="space-y-4">
                    {MOCK_DASHBOARD_DATA.topBooks.map((book, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border border-[#141414]/10 hover:bg-[#141414] hover:text-[#E4E3E0] transition-all group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xs opacity-50 group-hover:opacity-100">0{i+1}</span>
                          <div>
                            <p className="font-bold">{book.title}</p>
                            <p className="text-xs opacity-50 group-hover:opacity-70">{book.author}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm">{book.sales}</p>
                          <p className="text-[10px] opacity-50 uppercase tracking-widest">экз.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-[#141414] p-8 bg-[#E4E3E0]">
                  <h3 className="font-serif italic text-xl font-bold mb-8">Удержание (Когорты)</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={MOCK_DASHBOARD_DATA.cohortRetention}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#141414" strokeOpacity={0.1} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#141414', border: 'none', color: '#E4E3E0', fontFamily: 'monospace', fontSize: '10px' }}
                        />
                        <Bar dataKey="rate" fill="#141414" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] font-mono opacity-50 mt-4 uppercase text-center">Retention Rate % by Month</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'schema' && (
            <motion.div 
              key="schema"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative min-h-[600px] border border-[#141414] p-12 bg-[#E4E3E0] overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#141414 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                {/* Fact Table */}
                <div className="md:col-start-2">
                  <SchemaCard node={STAR_SCHEMA_NODES[0]} isFact />
                </div>

                {/* Dimension Tables */}
                <div className="md:col-start-1 md:row-start-1 space-y-8">
                  <SchemaCard node={STAR_SCHEMA_NODES[1]} />
                  <SchemaCard node={STAR_SCHEMA_NODES[2]} />
                </div>
                <div className="md:col-start-3 md:row-start-1 space-y-8">
                  <SchemaCard node={STAR_SCHEMA_NODES[3]} />
                  <SchemaCard node={STAR_SCHEMA_NODES[4]} />
                  <SchemaCard node={STAR_SCHEMA_NODES[5]} />
                </div>
              </div>

              {/* Decorative Lines (Conceptual) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 0 }}>
                <line x1="33%" y1="30%" x2="50%" y2="50%" stroke="#141414" strokeWidth="1" strokeDasharray="4" />
                <line x1="33%" y1="70%" x2="50%" y2="50%" stroke="#141414" strokeWidth="1" strokeDasharray="4" />
                <line x1="66%" y1="20%" x2="50%" y2="50%" stroke="#141414" strokeWidth="1" strokeDasharray="4" />
                <line x1="66%" y1="50%" x2="50%" y2="50%" stroke="#141414" strokeWidth="1" strokeDasharray="4" />
                <line x1="66%" y1="80%" x2="50%" y2="50%" stroke="#141414" strokeWidth="1" strokeDasharray="4" />
              </svg>
            </motion.div>
          )}

          {activeTab === 'sql' && (
            <motion.div 
              key="sql"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Query List */}
              <div className="lg:col-span-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                  <input 
                    type="text" 
                    placeholder="Поиск запроса..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border border-[#141414] py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#141414]"
                  />
                </div>
                <div className="h-[600px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                  {filteredQueries.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQuery(q)}
                      className={cn(
                        "w-full text-left p-4 border transition-all",
                        selectedQuery?.id === q.id 
                          ? "bg-[#141414] text-[#E4E3E0] border-[#141414]" 
                          : "bg-transparent border-[#141414]/10 hover:border-[#141414]"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-mono uppercase tracking-widest opacity-50">{q.category}</span>
                        {selectedQuery?.id === q.id && <ChevronRight size={14} />}
                      </div>
                      <p className="text-sm font-bold leading-tight">{q.title}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Query Detail */}
              <div className="lg:col-span-8">
                {selectedQuery ? (
                  <div className="border border-[#141414] bg-[#E4E3E0] h-full flex flex-col">
                    <div className="p-8 border-b border-[#141414]">
                      <h3 className="text-2xl font-serif italic font-bold mb-2">{selectedQuery.title}</h3>
                      <p className="text-sm opacity-70">{selectedQuery.description}</p>
                    </div>
                    <div className="flex-1 p-8 bg-[#141414] text-[#E4E3E0] font-mono text-sm overflow-x-auto">
                      <pre className="whitespace-pre-wrap leading-relaxed">
                        {selectedQuery.sql}
                      </pre>
                    </div>
                    <div className="p-4 border-t border-[#141414] flex justify-between items-center bg-[#E4E3E0]">
                      <span className="text-[10px] font-mono opacity-50">DIALECT: POSTGRESQL 15</span>
                      <button className="px-6 py-2 bg-[#141414] text-[#E4E3E0] text-xs font-bold uppercase tracking-widest hover:bg-[#404040] transition-colors">
                        Выполнить
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-[#141414] border-dashed h-full flex flex-col items-center justify-center text-center p-12 opacity-30">
                    <Code2 size={48} className="mb-4" />
                    <p className="font-serif italic text-xl">Выберите запрос из списка слева для просмотра SQL-кода</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="md:ml-64 p-8 border-t border-[#141414]/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-mono opacity-50">© 2026 BOOKSTORE ANALYTICS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-mono opacity-50 hover:opacity-100 uppercase tracking-widest">Documentation</a>
            <a href="#" className="text-[10px] font-mono opacity-50 hover:opacity-100 uppercase tracking-widest">API Reference</a>
            <a href="#" className="text-[10px] font-mono opacity-50 hover:opacity-100 uppercase tracking-widest">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SchemaCard({ node, isFact = false }: { node: any, isFact?: boolean }) {
  return (
    <div className={cn(
      "border border-[#141414] bg-[#E4E3E0] shadow-sm transition-transform hover:-translate-y-1",
      isFact ? "ring-2 ring-[#141414] ring-offset-4 ring-offset-[#E4E3E0]" : ""
    )}>
      <div className={cn(
        "px-4 py-2 border-b border-[#141414] flex items-center justify-between",
        isFact ? "bg-[#141414] text-[#E4E3E0]" : "bg-[#141414]/5"
      )}>
        <span className="font-mono text-xs font-bold">{node.name}</span>
        <span className="text-[9px] uppercase tracking-widest opacity-50">{isFact ? 'Fact' : 'Dimension'}</span>
      </div>
      <div className="p-4 space-y-1">
        {node.fields.map((field: string, i: number) => (
          <div key={i} className="flex items-center gap-2 group">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              field.includes('_id') ? "bg-[#141414]" : "bg-[#141414]/20"
            )} />
            <span className={cn(
              "text-[11px] font-mono",
              field.includes('_id') ? "font-bold" : "opacity-70"
            )}>
              {field}
            </span>
            {field.includes('_id') && <span className="text-[8px] opacity-30 ml-auto font-mono">FK</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
