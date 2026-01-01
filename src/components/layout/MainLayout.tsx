import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, BarChart3, PenTool, Settings, Menu, ChevronRight, Search, Activity } from 'lucide-react';
import { MaturityAssessment } from '../assess/MaturityAssessment';
import { ContentStudio } from '../studio/ContentStudio';
import { StackMap } from '../onboarding/StackMap';
import { AIOpsDashboard } from '../governance/AIOpsDashboard';
import { AuditScout } from '../assess/AuditScout';
import { Dashboard } from '../Dashboard';
import { RoadmapGenerator } from '../plan/RoadmapGenerator';
import { useClient } from '../../context/ClientContext';

export function MainLayout() {
    const [activeView, setActiveView] = useState('clients');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Listen for cross-component navigation requests
    useEffect(() => {
        const handleNavigation = (e: any) => setActiveView(e.detail);
        window.addEventListener('navigate', handleNavigation);
        return () => window.removeEventListener('navigate', handleNavigation);
    }, []);

    const renderContent = () => {
        switch (activeView) {
            case 'stackmap': return <StackMap />;
            case 'scout': return <AuditScout />;
            case 'assess': return <MaturityAssessment />;
            case 'roadmap': return <RoadmapGenerator />;
            case 'studio': return <ContentStudio />;
            case 'aiops': return <AIOpsDashboard />;
            case 'clients': return <Dashboard />;
            case 'settings': return <SettingsPanel />;
            default: return <Dashboard />;
        }
    };

    // Inline Settings Panel
    function SettingsPanel() {
        const { costBasis, updateCostBasis, companyName, industry } = useClient();
        return (
            <div className="h-full overflow-y-auto bg-zinc-950 p-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-zinc-400 mb-8">Configure cost assumptions and client parameters.</p>

                    <div className="space-y-6">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                            <h2 className="text-lg font-bold text-white mb-4">Client Profile</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-zinc-500 mb-1">Company Name</label>
                                    <input type="text" defaultValue={companyName} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs text-zinc-500 mb-1">Industry</label>
                                    <input type="text" defaultValue={industry} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                            <h2 className="text-lg font-bold text-white mb-4">Cost Basis (Friction Calculator)</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-zinc-500 mb-1">Avg Hourly Rate ($)</label>
                                    <input
                                        type="number"
                                        defaultValue={costBasis.avgHourlyRate}
                                        onChange={(e) => updateCostBasis({ avgHourlyRate: Number(e.target.value) })}
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-zinc-500 mb-1">Employee Count</label>
                                    <input
                                        type="number"
                                        defaultValue={costBasis.employeeCount}
                                        onChange={(e) => updateCostBasis({ employeeCount: Number(e.target.value) })}
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-zinc-500 mb-1">Remediation Time (hrs/incident)</label>
                                    <input
                                        type="number"
                                        defaultValue={costBasis.remediationTimePerIncident}
                                        onChange={(e) => updateCostBasis({ remediationTimePerIncident: Number(e.target.value) })}
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-zinc-500 mb-1">Incidents Per Month</label>
                                    <input
                                        type="number"
                                        defaultValue={costBasis.incidentsPerMonth}
                                        onChange={(e) => updateCostBasis({ incidentsPerMonth: Number(e.target.value) })}
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                                    />
                                </div>
                            </div>
                            <p className="mt-4 text-xs text-zinc-500">
                                These values are used to calculate friction cost: Risks × Incidents × (Time × Rate)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full bg-zinc-950 text-white overflow-hidden">
            {/* Global Sidebar */}
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
                        icon={LayoutDashboard} label="Phase 1: Stack Discovery"
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
                        icon={LayoutDashboard} label="Phase 2: Remediation Plan"
                        active={activeView === 'roadmap'} collapsed={!sidebarOpen}
                        onClick={() => setActiveView('roadmap')}
                    />
                    <NavItem
                        icon={PenTool} label="Phase 3: Content Studio"
                        active={activeView === 'studio'} collapsed={!sidebarOpen}
                        onClick={() => setActiveView('studio')}
                    />
                    <div className="my-4 border-t border-zinc-800" />
                    <NavItem
                        icon={Activity} label="Phase 4: AIOps Control"
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
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all border border-transparent ${active
                ? "bg-zinc-800 text-white border-zinc-700 shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                } ${collapsed ? "justify-center" : ""}`}
        >
            <Icon className={`w-5 h-5 shrink-0 ${active ? "text-primary" : "text-zinc-500 group-hover:text-white"}`} />
            {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
            {active && !collapsed && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
        </button>
    )
}
