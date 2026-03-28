import { TrendingUp, MessageCircle, Users, DollarSign } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const stats = [
  { label: "Total de Leads", value: "2.847", change: "+12.5%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Conversas Ativas", value: "384", change: "+8.2%", icon: MessageCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Taxa de Conversão", value: "24.8%", change: "+3.1%", icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50" },
  { label: "Receita Gerada", value: "R$ 142.580", change: "+18.7%", icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50" },
];

const chartData = [
  { name: "Jan", leads: 400, conversas: 240 },
  { name: "Fev", leads: 600, conversas: 380 },
  { name: "Mar", leads: 800, conversas: 520 },
  { name: "Abr", leads: 1100, conversas: 680 },
  { name: "Mai", leads: 1400, conversas: 900 },
  { name: "Jun", leads: 1800, conversas: 1100 },
  { name: "Jul", leads: 2200, conversas: 1400 },
  { name: "Ago", leads: 2847, conversas: 1700 },
];

const recentConversations = [
  { name: "Ana Silva", message: "Olá, gostaria de saber sobre o plano Pro", time: "2 min", status: "active" },
  { name: "Carlos Santos", message: "Preciso de ajuda com integração", time: "15 min", status: "active" },
  { name: "Maria Oliveira", message: "Obrigada pelo atendimento!", time: "1h", status: "resolved" },
  { name: "João Mendes", message: "Qual o prazo de entrega?", time: "2h", status: "pending" },
  { name: "Fernanda Lima", message: "Quero cancelar meu pedido", time: "3h", status: "active" },
];

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  resolved: "bg-gray-100 text-gray-600",
  pending: "bg-amber-100 text-amber-700",
};

const DashboardHome = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div>
      <h1 className="text-2xl font-semibold text-dash-fg">Dashboard</h1>
      <p className="text-sm text-dash-muted mt-1">Visão geral do seu atendimento</p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="dash-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-dash-muted">{s.label}</span>
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
          </div>
          <p className="text-2xl font-semibold text-dash-fg">{s.value}</p>
          <span className="text-xs text-emerald-600 font-medium">{s.change} vs mês anterior</span>
        </div>
      ))}
    </div>

    {/* Chart + Recent */}
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 dash-card p-5">
        <h2 className="text-base font-semibold text-dash-fg mb-4">Evolução</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="convFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Area type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} fill="url(#leadsFill)" name="Leads" />
              <Area type="monotone" dataKey="conversas" stroke="#6366f1" strokeWidth={2} fill="url(#convFill)" name="Conversas" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dash-card p-5">
        <h2 className="text-base font-semibold text-dash-fg mb-4">Conversas Recentes</h2>
        <div className="space-y-3">
          {recentConversations.map((c, i) => (
            <div key={i} className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <span className="text-sm font-medium text-gray-600">{c.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-dash-fg">{c.name}</span>
                  <span className="text-xs text-dash-muted">{c.time}</span>
                </div>
                <p className="text-xs text-dash-muted truncate">{c.message}</p>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${statusColors[c.status]}`}>
                {c.status === "active" ? "Ativo" : c.status === "resolved" ? "Resolvido" : "Pendente"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default DashboardHome;
