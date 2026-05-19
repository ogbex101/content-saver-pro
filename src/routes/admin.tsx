import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { Suspense, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User, Briefcase, Star, Building, FolderOpen, MessageSquare, LogOut, Home, BookOpen, Menu, X, Zap, Layers } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import AdminLogin from "@/components/admin/AdminLogin";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const tabs = [
  { id: "profile", label: "Profile & Contact", icon: User },
  { id: "story", label: "My Story", icon: BookOpen },
  { id: "services", label: "Services", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Star },
  { id: "brands", label: "Brands / Logos", icon: Building },
  { id: "projects", label: "Portfolio", icon: FolderOpen },
  { id: "automations", label: "PM Automations", icon: Zap },
  { id: "custom", label: "Custom Sections", icon: Layers },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
];

const AdminProfile = React.lazy(() => import("@/components/admin/AdminProfile"));
const AdminStory = React.lazy(() => import("@/components/admin/AdminStory"));
const AdminListManager = React.lazy(() => import("@/components/admin/AdminListManager"));
const AdminBrands = React.lazy(() => import("@/components/admin/AdminBrands"));
const AdminProjects = React.lazy(() => import("@/components/admin/AdminProjects"));
const AdminTestimonials = React.lazy(() => import("@/components/admin/AdminTestimonials"));
const AdminAutomations = React.lazy(() => import("@/components/admin/AdminAutomations"));
const AdminCustomSections = React.lazy(() => import("@/components/admin/AdminCustomSections"));

const LoadingFallback = () => (
  <div className="p-8 flex items-center gap-3">
    <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    <span className="text-muted-foreground font-bold text-sm">Loading section...</span>
  </div>
);

function AdminPage() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <span className="text-muted-foreground font-bold">Loading admin...</span>
      </div>
    </div>
  );

  if (!user) return <AdminLogin />;
  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-4 font-bold">You don't have admin permissions.</p>
        <button onClick={() => navigate({ to: "/" })} className="text-gold hover:underline font-bold">Go to Homepage</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`${sidebarOpen ? "w-64" : "w-0 md:w-16"} bg-sidebar text-sidebar-foreground flex-shrink-0 transition-all duration-300 overflow-hidden fixed md:sticky top-0 h-screen z-50 border-r border-sidebar-border`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
            {sidebarOpen && <h1 className="font-display text-lg font-bold text-sidebar-foreground">Admin</h1>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground">
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => { setActiveTab(t.id); if (window.innerWidth < 768) setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === t.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <t.icon size={18} />
                {sidebarOpen && <span>{t.label}</span>}
              </button>
            ))}
          </nav>

          <div className="p-3 border-t border-sidebar-border space-y-1">
            <button onClick={() => navigate({ to: "/" })} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all">
              <Home size={18} />
              {sidebarOpen && <span>View Site</span>}
            </button>
            <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-destructive hover:bg-destructive/10 transition-all">
              <LogOut size={18} />
              {sidebarOpen && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-h-screen">
        <header className="bg-card border-b border-border sticky top-0 z-30">
          <div className="px-4 md:px-6 flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-muted md:hidden">
                <Menu size={18} />
              </button>
              <h2 className="font-bold text-sm">{tabs.find(t => t.id === activeTab)?.label}</h2>
            </div>
            <span className="text-xs text-muted-foreground font-bold">{user.email}</span>
          </div>
        </header>

        <div className="p-4 md:p-6 max-w-6xl">
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              {activeTab === "profile" && <AdminProfile />}
              {activeTab === "story" && <AdminStory />}
              {activeTab === "services" && <AdminListManager table="services" label="Services" />}
              {activeTab === "skills" && <AdminListManager table="skills" label="Skills" />}
              {activeTab === "brands" && <AdminBrands />}
              {activeTab === "projects" && <AdminProjects />}
              {activeTab === "automations" && <AdminAutomations />}
              {activeTab === "custom" && <AdminCustomSections />}
              {activeTab === "testimonials" && <AdminTestimonials />}
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
