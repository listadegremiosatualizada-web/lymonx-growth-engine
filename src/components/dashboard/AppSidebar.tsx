import {
  LayoutDashboard, MessageCircle, Users, Bot, Workflow, Settings, LogOut, Zap,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Conversas", url: "/dashboard/conversas", icon: MessageCircle },
  { title: "Leads (CRM)", url: "/dashboard/leads", icon: Users },
  { title: "Agentes de IA", url: "/dashboard/agentes", icon: Bot },
  { title: "Automações", url: "/dashboard/automacoes", icon: Workflow },
  { title: "Configurações", url: "/dashboard/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut, user } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-dash-border/60 bg-white">
      <div className="h-16 flex items-center px-5 border-b border-dash-border/60">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-primary/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-dash-fg tracking-tight">
              Lymon<span className="text-primary">X</span>
            </span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center mx-auto shadow-sm shadow-primary/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      <SidebarContent className="py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = item.url === "/dashboard"
                  ? location.pathname === "/dashboard"
                  : location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/dashboard"}
                        className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                          active
                            ? "bg-primary/8 text-primary shadow-sm"
                            : "text-dash-muted hover:bg-dash-hover hover:text-dash-fg"
                        }`}
                        activeClassName=""
                      >
                        <item.icon className={`h-[18px] w-[18px] shrink-0 transition-colors ${active ? "text-primary" : ""}`} />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto p-3 border-t border-dash-border/60">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-medium text-dash-fg truncate">{user.email}</p>
            <p className="text-[10px] text-dash-muted">Plano Pro</p>
          </div>
        )}
        <button onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full mx-0 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 transition-all duration-200">
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </Sidebar>
  );
}
