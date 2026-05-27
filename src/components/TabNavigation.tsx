import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/home", label: "🏠 Homepage", color: "primary" },
  { path: "/diabetes", label: "Diabetes", color: "red-500" },
  { path: "/hypertension", label: "Hypertension", color: "orange-500" },
  { path: "/lipids", label: "Lipids", color: "blue-500" },
  { path: "/obesity/bmi-calculator", label: "Obesity", color: "violet-500" },
  { path: "/respiratory", label: "COPD/Asthma", color: "cyan-500" },
  { path: "/renal-dosing", label: "Renal", color: "amber-500" },
  { path: "/anemia", label: "Anemia", color: "sky-500" },
  { path: "/diet-plan", label: "Meal Tracker", color: "green-500" },
];

const modeLinks = [
  { path: "/", label: "← Mode Selector" },
  { path: "/simple", label: "🟢 Simple" },
  { path: "/moderate", label: "🟠 Moderate" },
  { path: "/home", label: "🔴 Complex" },
];

function SidebarContent({ currentPath, onNavigate }: { currentPath: string; onNavigate?: () => void }) {
  return (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link to="/home" className="flex items-center gap-2" onClick={onNavigate}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-white/10">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <span className="font-serif font-semibold">NCD Rx</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground px-2 py-2">CLINICAL AREAS</div>
        {navItems.map((item) => {
          const isActive = currentPath === item.path || 
            (item.path !== "/home" && item.path !== "/diet-plan" && currentPath.startsWith(item.path)) ||
            (item.path === "/home" && currentPath === "/home");
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive 
                  ? "bg-primary/10 text-primary border-l-2 border-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mode Switcher at bottom */}
      <div className="p-2 border-t border-border">
        <div className="text-xs font-semibold text-muted-foreground px-2 py-2">MODE SWITCHER</div>
        <nav className="space-y-1">
          {modeLinks.map((item) => {
            const isActive = currentPath === item.path || 
              (item.path === "/home" && currentPath === "/home") ||
              (item.path === "/" && currentPath === "/");
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export function TabNavigation() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentPath = location.pathname;

  return (
    <>
      {/* Mobile hamburger */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-3 left-3 z-50 p-2 rounded-lg bg-card border border-border lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Desktop sidebar - sticky, pushes content */}
      <aside className="hidden lg:flex lg:flex-col lg:h-screen lg:w-56 lg:shrink-0 lg:sticky lg:top-0 bg-card border-r border-border">
        <SidebarContent currentPath={currentPath} />
      </aside>

      {/* Mobile sidebar - overlay */}
      {sidebarOpen && (
        <>
          <aside className="fixed left-0 top-0 h-full w-56 bg-card border-r border-border z-40 flex flex-col overflow-y-auto">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-3 right-3 p-1">
              <X className="h-4 w-4" />
            </button>
            <SidebarContent currentPath={currentPath} onNavigate={() => setSidebarOpen(false)} />
          </aside>
          <div 
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        </>
      )}

      {/* Mobile top bar */}
      <div className="lg:hidden h-14 flex items-center pl-14 border-b border-border bg-background/95 sticky top-0 z-30">
        <span className="text-sm font-medium">
          {navItems.find(n => currentPath === n.path || currentPath.startsWith(n.path + "/"))?.label || "NCD Rx"}
        </span>
      </div>
    </>
  );
}

export default TabNavigation;
