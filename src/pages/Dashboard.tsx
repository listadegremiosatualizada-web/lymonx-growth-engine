import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full dash-bg">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 flex items-center border-b border-dash-border/60 px-5 bg-white/80 backdrop-blur-xl sticky top-0 z-10">
            <SidebarTrigger className="text-dash-muted hover:text-dash-fg transition-colors" />
            <div className="ml-4 flex items-center gap-2">
              <span className="text-sm font-medium text-dash-muted tracking-tight">LymonX</span>
              <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Pro</span>
            </div>
          </header>
          <motion.main
            className="flex-1 p-6 lg:p-8 overflow-auto"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
