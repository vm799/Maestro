import { RoadmapGenerator } from '../plan/RoadmapGenerator';

// ... (other imports)

// ...

const renderContent = () => {
    switch (activeView) {
        case 'stackmap': return <StackMap />;
        case 'scout': return <AuditScout />;
        case 'assess': return <MaturityAssessment />;
        case 'roadmap': return <RoadmapGenerator />; // NEW
        case 'studio': return <ContentStudio />;
        case 'aiops': return <AIOpsDashboard />;
        case 'clients':
            return <Dashboard />;
        default: return <Dashboard />;
    }
};

return (
    <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden">
        {/* ... Sidebar ... */}
        <nav className="flex-1 py-6 space-y-2 px-2">
            {/* ... Existing NavItems ... */}
            <div className="my-4 border-t border-zinc-800" />

            {/* The Plan Section */}
            <NavItem
                icon={BarChart3} label="Assess Maturity"
                active={activeView === 'assess'} collapsed={!sidebarOpen}
                onClick={() => setActiveView('assess')}
            />
            <NavItem
                icon={LayoutDashboard} label="Phase 2: Remediation Plan"
                active={activeView === 'roadmap'} collapsed={!sidebarOpen}
                onClick={() => setActiveView('roadmap')}
            />

            <NavItem
                icon={PenTool} label="Content Studio"
                active={activeView === 'studio'} collapsed={!sidebarOpen}
                onClick={() => setActiveView('studio')}
            />
// ...

            function NavItem({icon: Icon, label, active, collapsed, onClick }: any) {
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
