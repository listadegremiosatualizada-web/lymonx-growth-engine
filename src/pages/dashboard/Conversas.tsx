import { Search, Phone, MoreVertical, Send, Paperclip } from "lucide-react";
import { useState } from "react";

const contacts = [
  { id: 1, name: "Ana Silva", lastMsg: "Olá, gostaria de saber sobre o plano Pro", time: "2 min", unread: 2, status: "online" },
  { id: 2, name: "Carlos Santos", lastMsg: "Preciso de ajuda com integração", time: "15 min", unread: 0, status: "online" },
  { id: 3, name: "Maria Oliveira", lastMsg: "Obrigada pelo atendimento!", time: "1h", unread: 0, status: "offline" },
  { id: 4, name: "João Mendes", lastMsg: "Qual o prazo de entrega?", time: "2h", unread: 1, status: "offline" },
  { id: 5, name: "Fernanda Lima", lastMsg: "Quero cancelar meu pedido", time: "3h", unread: 0, status: "online" },
];

const messages = [
  { id: 1, from: "client", text: "Olá! Gostaria de saber mais sobre o plano Pro.", time: "14:30" },
  { id: 2, from: "agent", text: "Olá Ana! Claro, o plano Pro inclui atendimento ilimitado, 5 agentes de IA e integração com CRM.", time: "14:31" },
  { id: 3, from: "client", text: "Qual o valor mensal?", time: "14:32" },
  { id: 4, from: "agent", text: "O plano Pro custa R$ 297/mês. Quer que eu envie uma proposta personalizada?", time: "14:33" },
  { id: 5, from: "client", text: "Sim, por favor!", time: "14:34" },
];

const Conversas = () => {
  const [selected, setSelected] = useState(1);

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-5rem)]">
      <div className="dash-card h-full flex overflow-hidden">
        {/* Contact list */}
        <div className="w-80 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400" placeholder="Buscar conversa..." />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {contacts.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${selected === c.id ? "bg-primary/5" : "hover:bg-gray-50"}`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{c.name[0]}</span>
                  </div>
                  {c.status === "online" && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-dash-fg">{c.name}</span>
                    <span className="text-[11px] text-dash-muted">{c.time}</span>
                  </div>
                  <p className="text-xs text-dash-muted truncate">{c.lastMsg}</p>
                </div>
                {c.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">{c.unread}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <div className="h-14 px-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">A</span>
              </div>
              <div>
                <p className="text-sm font-medium text-dash-fg">Ana Silva</p>
                <p className="text-[11px] text-emerald-500">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl hover:bg-gray-50 text-dash-muted"><Phone className="w-4 h-4" /></button>
              <button className="p-2 rounded-xl hover:bg-gray-50 text-dash-muted"><MoreVertical className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50/50">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "agent" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                  m.from === "agent"
                    ? "bg-primary text-white rounded-br-md"
                    : "bg-white text-dash-fg shadow-sm rounded-bl-md"
                }`}>
                  <p>{m.text}</p>
                  <p className={`text-[10px] mt-1 ${m.from === "agent" ? "text-white/70" : "text-dash-muted"}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl hover:bg-gray-50 text-dash-muted"><Paperclip className="w-4 h-4" /></button>
              <input className="flex-1 py-2.5 px-4 text-sm bg-gray-50 rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400" placeholder="Digite uma mensagem..." />
              <button className="p-2.5 rounded-xl bg-primary text-white hover:brightness-110 transition"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversas;
