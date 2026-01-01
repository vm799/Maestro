import React, { useState } from 'react';
import { LayoutDashboard, Users, BarChart3, PenTool, Settings, Menu, ChevronRight, Search, Activity } from 'lucide-react';
import { MaturityAssessment } from '../assess/MaturityAssessment';
import { ContentStudio } from '../studio/ContentStudio';
import { StackMap } from '../onboarding/StackMap';
import { AIOpsDashboard } from '../governance/AIOpsDashboard';
import { AuditScout } from '../assess/AuditScout';
import { Dashboard } from '../Dashboard'; // Keeping old dashboard as "Project View" for now, or determining how to integrate

// Using 'any' for quick prototyping of the view switcher
interface MainLayoutProps {
    children?: React.ReactNode;
}

export function MainLayout() {
    const [activeView, setActiveView] = useState('clients');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Listen for cross-component navigation requests (e.g., StackMap -> AuditScout)
    React.useEffect(() => {
        const handleNavigation = (e: any) => setActiveView(e.detail);
        window.addEventListener('navigate', handleNavigation);
        return () => window.removeEventListener('navigate', handleNavigation);
    }, []);

    // Proposed Views:
    // 1. Clients (List of active engagements) -> Clicking one goes to Dashboard
    // 2. Onboarding (New Client)
    // 3. Assess (Maturity Tools)
    // 4. Studio (Content Gen)

    const renderContent = () => {
        switch (activeView) {
            case 'stackmap': return <StackMap />;
            case 'scout': return <AuditScout />;
            case 'assess': return <MaturityAssessment />;
            case 'studio': return <ContentStudio />;
            case 'aiops': return <AIOpsDashboard />;
            case 'clients': // Fallback to the original dashboard for now, but wrapped
                return <Dashboard />;
            default: return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden">
            {/* Global Sidebar (Consultant OS) */}
            <div className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 bg-zinc-900 text-zinc-300 flex flex-col border-r border-zinc-800`}>
                <div className="p-4 flex items-center justify-between">
                    {sidebarOpen && <span className="font-bold tracking-widest uppercase text-xs text-white">Maestro OS</span>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-zinc-800 rounded">
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 py-6 space-y-2 px-2">
                    <NavItem
                        icon={Users} label="Clients & Projects"
                        active={activeView === 'clients'} collapsed={!sidebarOpen}
                        onClick={() => setActiveView('clients')}
                    />
                    <div className="my-4 border-t border-zinc-800" />
                    <NavItem
                        icon={LayoutDashboard} label="Day 1: The Stack Map"
                        active={activeView === 'stackmap'} collapsed={!sidebarOpen}
                        onClick={() => setActiveView('stackmap')}
                    />
                    <NavItem
                        icon={Search} label="Audit Scout"
                        active={activeView === 'scout'} collapsed={!sidebarOpen}
                        onClick={() => setActiveView('scout')}
                    />
                    <NavItem
                        icon={BarChart3} label="Assess Maturity"
                        active={activeView === 'assess'} collapsed={!sidebarOpen}
                        onClick={() => setActiveView('assess')}
                    />
                    <NavItem
                        icon={PenTool} label="Content Studio"
                        active={activeView === 'studio'} collapsed={!sidebarOpen}
                        onClick={() => setActiveView('studio')}
                    />
                    <div className="my-4 border-t border-zinc-800" />
                    <NavItem
                        icon={Activity} label="Orchestration (AIOps)"
                        active={activeView === 'aiops'} collapsed={!sidebarOpen}
                        onClick={() => setActiveView('aiops')}
                    />
                </nav>

                <div className="p-4 border-t border-zinc-800">
                    <NavItem
                        icon={Settings} label="Settings"
                        active={activeView === 'settings'} collapsed={!sidebarOpen}
                        onClick={() => setActiveView('settings')}
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-background">
                {renderContent()}
            </div>
        </div>
    );
}

function NavItem({ icon: Icon, label, active, collapsed, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${active ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-zinc-800 hover:text-white"
                } ${collapsed ? "justify-center" : ""}`}
        >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
            {active && !collapsed && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
        </button>
    )
}
