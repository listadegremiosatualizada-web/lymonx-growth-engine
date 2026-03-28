import {
  LayoutDashboard, MessageCircle, Users, Bot, Workflow, Settings,
} from "lucide-react";
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

  return (
    <Sidebar collapsible="icon" className="border-r border-dash-border bg-white">
      <div className="h-14 flex items-center px-4 border-b border-dash-border">
        {!collapsed && (
          <span className="text-lg font-bold text-dash-fg tracking-tight">
            Lymon<span className="text-primary">X</span>
          </span>
        )}
        {collapsed && <span className="text-lg font-bold text-primary mx-auto">X</span>}
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/dashboard"}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-dash-muted hover:bg-dash-hover hover:text-dash-fg"
                        }`}
                        activeClassName=""
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
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
    </Sidebar>
  );
}
