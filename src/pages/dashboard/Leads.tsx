import { Search, Filter, MoreHorizontal, Plus } from "lucide-react";

const leads = [
  { name: "Ana Silva", email: "ana@email.com", phone: "+55 11 99999-1234", source: "WhatsApp", stage: "Qualificado", value: "R$ 2.500", date: "Hoje" },
  { name: "Carlos Santos", email: "carlos@email.com", phone: "+55 11 98888-5678", source: "Site", stage: "Proposta", value: "R$ 8.900", date: "Hoje" },
  { name: "Maria Oliveira", email: "maria@email.com", phone: "+55 21 97777-9012", source: "WhatsApp", stage: "Negociação", value: "R$ 15.000", date: "Ontem" },
  { name: "João Mendes", email: "joao@email.com", phone: "+55 11 96666-3456", source: "Instagram", stage: "Novo", value: "R$ 1.200", date: "Ontem" },
  { name: "Fernanda Lima", email: "fernanda@email.com", phone: "+55 31 95555-7890", source: "WhatsApp", stage: "Qualificado", value: "R$ 4.700", date: "2 dias" },
  { name: "Ricardo Alves", email: "ricardo@email.com", phone: "+55 11 94444-1234", source: "Site", stage: "Fechado", value: "R$ 12.300", date: "3 dias" },
];

const stageColors: Record<string, string> = {
  Novo: "bg-blue-50 text-blue-700",
  Qualificado: "bg-emerald-50 text-emerald-700",
  Proposta: "bg-violet-50 text-violet-700",
  "Negociação": "bg-amber-50 text-amber-700",
  Fechado: "bg-gray-100 text-gray-600",
};

const Leads = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-dash-fg">Leads (CRM)</h1>
        <p className="text-sm text-dash-muted mt-1">Gerencie seus contatos e oportunidades</p>
      </div>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:brightness-110 transition">
        <Plus className="w-4 h-4" /> Novo Lead
      </button>
    </div>

    <div className="dash-card">
      <div className="p-4 border-b border-gray-100 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400" placeholder="Buscar leads..." />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-dash-muted bg-gray-50 rounded-xl hover:bg-gray-100 transition">
          <Filter className="w-4 h-4" /> Filtros
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Nome</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Contato</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Origem</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Etapa</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Valor</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Data</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">{l.name[0]}</span>
                    </div>
                    <span className="font-medium text-dash-fg">{l.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-dash-fg">{l.email}</p>
                  <p className="text-xs text-dash-muted">{l.phone}</p>
                </td>
                <td className="px-4 py-3 text-dash-muted">{l.source}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${stageColors[l.stage]}`}>{l.stage}</span>
                </td>
                <td className="px-4 py-3 font-medium text-dash-fg">{l.value}</td>
                <td className="px-4 py-3 text-dash-muted">{l.date}</td>
                <td className="px-4 py-3">
                  <button className="p-1 rounded-lg hover:bg-gray-100 text-dash-muted"><MoreHorizontal className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default Leads;
