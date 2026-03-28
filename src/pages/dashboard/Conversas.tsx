import { Search, Phone, MoreVertical, Send, Paperclip, Smile, Check, CheckCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Status = "novo" | "em_atendimento" | "finalizado";

interface Contact {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  status: Status;
  online: boolean;
}

interface Message {
  id: number;
  from: "client" | "agent";
  text: string;
  time: string;
  read: boolean;
}

const allContacts: Contact[] = [
  { id: 1, name: "Ana Silva", avatar: "AS", lastMsg: "Olá, gostaria de saber sobre o plano Pro", time: "14:34", unread: 2, status: "em_atendimento", online: true },
  { id: 2, name: "Carlos Santos", avatar: "CS", lastMsg: "Preciso de ajuda com integração", time: "14:20", unread: 3, status: "novo", online: true },
  { id: 3, name: "Maria Oliveira", avatar: "MO", lastMsg: "Obrigada pelo atendimento!", time: "13:45", unread: 0, status: "finalizado", online: false },
  { id: 4, name: "João Mendes", avatar: "JM", lastMsg: "Qual o prazo de entrega?", time: "12:30", unread: 1, status: "em_atendimento", online: false },
  { id: 5, name: "Fernanda Lima", avatar: "FL", lastMsg: "Quero cancelar meu pedido", time: "11:15", unread: 0, status: "em_atendimento", online: true },
  { id: 6, name: "Ricardo Alves", avatar: "RA", lastMsg: "Enviei o comprovante", time: "10:40", unread: 5, status: "novo", online: true },
  { id: 7, name: "Patrícia Costa", avatar: "PC", lastMsg: "Pode me ajudar com o pedido #4521?", time: "09:22", unread: 0, status: "finalizado", online: false },
  { id: 8, name: "Bruno Souza", avatar: "BS", lastMsg: "Quero upgrade do plano", time: "Ontem", unread: 0, status: "em_atendimento", online: false },
];

const allMessages: Record<number, Message[]> = {
  1: [
    { id: 1, from: "client", text: "Olá! Gostaria de saber mais sobre o plano Pro.", time: "14:30", read: true },
    { id: 2, from: "agent", text: "Olá Ana! Claro, o plano Pro inclui atendimento ilimitado, 5 agentes de IA e integração com CRM.", time: "14:31", read: true },
    { id: 3, from: "client", text: "Qual o valor mensal?", time: "14:32", read: true },
    { id: 4, from: "agent", text: "O plano Pro custa R$ 297/mês. Quer que eu envie uma proposta personalizada?", time: "14:33", read: true },
    { id: 5, from: "client", text: "Sim, por favor!", time: "14:34", read: false },
    { id: 6, from: "client", text: "E vocês oferecem desconto para plano anual?", time: "14:34", read: false },
  ],
  2: [
    { id: 1, from: "client", text: "Boa tarde! Preciso integrar a API de vocês com meu sistema.", time: "14:15", read: true },
    { id: 2, from: "client", text: "Vocês têm documentação disponível?", time: "14:16", read: false },
    { id: 3, from: "client", text: "Preciso de ajuda com integração", time: "14:20", read: false },
  ],
  3: [
    { id: 1, from: "client", text: "O problema foi resolvido?", time: "13:30", read: true },
    { id: 2, from: "agent", text: "Sim! Já corrigimos a configuração da sua conta.", time: "13:40", read: true },
    { id: 3, from: "client", text: "Obrigada pelo atendimento!", time: "13:45", read: true },
  ],
  4: [
    { id: 1, from: "client", text: "Fiz um pedido ontem, qual o prazo de entrega?", time: "12:25", read: true },
    { id: 2, from: "agent", text: "Vou verificar o status do seu pedido. Um momento.", time: "12:28", read: true },
    { id: 3, from: "client", text: "Qual o prazo de entrega?", time: "12:30", read: false },
  ],
  5: [
    { id: 1, from: "client", text: "Quero cancelar meu pedido #3892", time: "11:10", read: true },
    { id: 2, from: "agent", text: "Entendido, Fernanda. Posso saber o motivo do cancelamento?", time: "11:12", read: true },
    { id: 3, from: "client", text: "Encontrei um preço melhor.", time: "11:15", read: true },
  ],
  6: [
    { id: 1, from: "client", text: "Boa tarde!", time: "10:30", read: true },
    { id: 2, from: "agent", text: "Olá Ricardo! Como posso ajudar?", time: "10:32", read: true },
    { id: 3, from: "client", text: "Preciso pagar uma fatura em atraso", time: "10:35", read: true },
    { id: 4, from: "agent", text: "Claro! Envie o comprovante de pagamento por aqui.", time: "10:36", read: true },
    { id: 5, from: "client", text: "Enviei o comprovante", time: "10:40", read: false },
  ],
  7: [
    { id: 1, from: "client", text: "Pode me ajudar com o pedido #4521?", time: "09:20", read: true },
    { id: 2, from: "agent", text: "Pedido já foi enviado! Segue o código de rastreio: BR1234567890", time: "09:22", read: true },
  ],
  8: [
    { id: 1, from: "client", text: "Quero fazer upgrade do plano Basic para o Pro", time: "Ontem", read: true },
    { id: 2, from: "agent", text: "Ótima escolha! Vou preparar a migração.", time: "Ontem", read: true },
  ],
};

const statusConfig: Record<Status, { label: string; color: string }> = {
  novo: { label: "Novo", color: "bg-blue-100 text-blue-700" },
  em_atendimento: { label: "Em atendimento", color: "bg-emerald-100 text-emerald-700" },
  finalizado: { label: "Finalizado", color: "bg-gray-100 text-gray-500" },
};

const Conversas = () => {
  const [selected, setSelected] = useState(1);
  const [contacts, setContacts] = useState(allContacts);
  const [messages, setMessages] = useState(allMessages);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "todos">("todos");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selected, messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const currentMsgs = messages[selected] || [];
    const newMsg: Message = {
      id: currentMsgs.length + 1,
      from: "agent",
      text: input.trim(),
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      read: true,
    };
    setMessages({ ...messages, [selected]: [...currentMsgs, newMsg] });
    setContacts(contacts.map((c) =>
      c.id === selected ? { ...c, lastMsg: input.trim(), time: newMsg.time } : c
    ));
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectContact = (id: number) => {
    setSelected(id);
    setContacts(contacts.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  const selectedContact = contacts.find((c) => c.id === selected);
  const currentMessages = messages[selected] || [];
  const totalUnread = contacts.reduce((sum, c) => sum + c.unread, 0);

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMsg.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "todos" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-5rem)]">
      <div className="dash-card h-full flex overflow-hidden">
        {/* Contact list */}
        <div className="w-[340px] border-r border-gray-100 flex flex-col shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-dash-fg">
                Conversas
                {totalUnread > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-primary text-white rounded-full">
                    {totalUnread}
                  </span>
                )}
              </h2>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400"
                placeholder="Buscar conversa..."
              />
            </div>
            <div className="flex gap-1.5">
              {(["todos", "novo", "em_atendimento", "finalizado"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors ${
                    filterStatus === s
                      ? "bg-primary/10 text-primary"
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                  }`}
                >
                  {s === "todos" ? "Todos" : statusConfig[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact list */}
          <div className="flex-1 overflow-auto">
            {filteredContacts.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectContact(c.id)}
                className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all duration-150 border-l-2 ${
                  selected === c.id
                    ? "bg-primary/5 border-l-primary"
                    : "border-l-transparent hover:bg-gray-50"
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold ${
                    selected === c.id ? "bg-primary/15 text-primary" : "bg-gray-100 text-gray-600"
                  }`}>
                    {c.avatar}
                  </div>
                  {c.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={`text-sm font-medium ${c.unread > 0 ? "text-dash-fg" : "text-gray-700"}`}>
                      {c.name}
                    </span>
                    <span className={`text-[11px] ${c.unread > 0 ? "text-primary font-medium" : "text-gray-400"}`}>
                      {c.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs truncate pr-2 ${c.unread > 0 ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                      {c.lastMsg}
                    </p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${statusConfig[c.status].color}`}>
                        {statusConfig[c.status].label}
                      </span>
                      {c.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredContacts.length === 0 && (
              <div className="p-8 text-center text-sm text-gray-400">Nenhuma conversa encontrada</div>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">{selectedContact?.avatar}</span>
                </div>
                {selectedContact?.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-dash-fg">{selectedContact?.name}</p>
                <p className={`text-[11px] ${selectedContact?.online ? "text-emerald-500" : "text-gray-400"}`}>
                  {selectedContact?.online ? "Online agora" : "Offline"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-lg mr-2 ${
                selectedContact ? statusConfig[selectedContact.status].color : ""
              }`}>
                {selectedContact ? statusConfig[selectedContact.status].label : ""}
              </span>
              <button className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 transition"><Phone className="w-4 h-4" /></button>
              <button className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 transition"><MoreVertical className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-5 space-y-2" style={{ background: "linear-gradient(180deg, #f8f9fb 0%, #f1f3f8 100%)" }}>
            <div className="flex justify-center mb-4">
              <span className="text-[11px] text-gray-400 bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                Hoje
              </span>
            </div>
            {currentMessages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "agent" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[65%] px-4 py-2.5 text-sm leading-relaxed ${
                  m.from === "agent"
                    ? "bg-primary text-white rounded-2xl rounded-br-md shadow-sm shadow-primary/20"
                    : "bg-white text-dash-fg rounded-2xl rounded-bl-md shadow-sm"
                }`}>
                  <p>{m.text}</p>
                  <div className={`flex items-center justify-end gap-1 mt-1 ${m.from === "agent" ? "text-white/60" : "text-gray-400"}`}>
                    <span className="text-[10px]">{m.time}</span>
                    {m.from === "agent" && (
                      m.read
                        ? <CheckCheck className="w-3 h-3" />
                        : <Check className="w-3 h-3" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 transition">
                <Smile className="w-5 h-5" />
              </button>
              <button className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 transition">
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 py-2.5 px-4 text-sm bg-gray-50 rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 transition"
                placeholder="Digite uma mensagem..."
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-primary text-white hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversas;
