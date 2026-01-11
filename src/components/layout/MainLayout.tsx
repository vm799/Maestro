import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, BarChart3, PenTool, Settings, Menu, ChevronRight, Search, Activity } from 'lucide-react';
import { MaturityAssessment } from '../assess/MaturityAssessment';
import { ContentStudio } from '../studio/ContentStudio';
import { StackMap } from '../onboarding/StackMap';
import { AIOpsDashboard } from '../governance/AIOpsDashboard';
import { AuditScout } from '../assess/AuditScout';
import { Dashboard } from '../Dashboard';
import { RoadmapGenerator } from '../plan/RoadmapGenerator';
import { MaestroExplainer } from '../assess/MaestroExplainer';
import { useClient } from '../../context/ClientContext';

export function MainLayout() {
    const [activeView, setActiveView] = useState('clients');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { isOnboarding, toggleOnboarding } = useClient();

    // Listen for cross-component navigation requests
    useEffect(() => {
        const handleNavigation = (e: any) => setActiveView(e.detail);
        window.addEventListener('navigate', handleNavigation);
        return () => window.removeEventListener('navigate', handleNavigation);
    }, []);

    const renderContent = () => {
        switch (activeView) {
            case 'clients': return <Dashboard />;
            case 'stackmap': return <StackMap />;
            case 'maestro': return <MaestroExplainer />;
            case 'scout': return <AuditScout />;
            case 'assess': return <MaturityAssessment />;
            case 'roadmap': return <RoadmapGenerator />;
            case 'studio': return <ContentStudio />;
            case 'aiops': return <AIOpsDashboard />;
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
        <div className="flex h-screen w-full bg-zinc-950 text-white overflow-hidden flex-col">
            {isOnboarding && (
                <div className="bg-blue-600 text-white py-1 px-4 text-[10px] font-bold tracking-[0.2em] uppercase flex justify-between items-center z-[100] animate-pulse">
                    <span>DEMO MODE ACTIVE • SAMPLE DATA SHOWN</span>
                    <button
                        onClick={() => toggleOnboarding(false)}
                        className="hover:underline bg-white/10 px-2 py-0.5 rounded"
                    >
                        Exit Sandbox
                    </button>
                </div>
            )}
            <div className="flex flex-1 overflow-hidden">
                {/* Global Sidebar */}
                <div className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 bg-zinc-900 text-zinc-300 flex flex-col border-r border-zinc-800`}>
                    <div className="p-4 flex items-center justify-between">
                        {sidebarOpen && <span className="font-bold tracking-widest uppercase text-xs text-white">Maestro OS</span>}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-1 hover:bg-zinc-800 rounded"
                            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="flex-1 py-6 space-y-1 px-2">
                        <NavItem
                            icon={Users} label="Portfolio"
                            active={activeView === 'clients'} collapsed={!sidebarOpen}
                            onClick={() => setActiveView('clients')}
                        />

                        <div className="my-4 px-3 flex items-center gap-2">
                            <div className="h-px flex-1 bg-zinc-800" />
                            {!sidebarOpen ? null : <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest whitespace-nowrap">The Journey</span>}
                            <div className="h-px flex-1 bg-zinc-800" />
                        </div>

                        <NavItem
                            icon={LayoutDashboard} label="1. Discovery"
                            active={activeView === 'stackmap'} collapsed={!sidebarOpen}
                            onClick={() => setActiveView('stackmap')}
                        />
                        <NavItem
                            icon={LayoutDashboard} label="2. Architecture"
                            active={activeView === 'maestro'} collapsed={!sidebarOpen}
                            onClick={() => setActiveView('maestro')}
                        />
                        <NavItem
                            icon={Search} label="3. Deep Audit"
                            active={activeView === 'scout'} collapsed={!sidebarOpen}
                            onClick={() => setActiveView('scout')}
                        />
                        <NavItem
                            icon={BarChart3} label="4. Strategy"
                            active={activeView === 'assess'} collapsed={!sidebarOpen}
                            onClick={() => setActiveView('assess')}
                        />
                        <NavItem
                            icon={Activity} label="5. Roadmap"
                            active={activeView === 'roadmap'} collapsed={!sidebarOpen}
                            onClick={() => setActiveView('roadmap')}
                        />

                        <div className="my-4 px-3 flex items-center gap-2">
                            <div className="h-px flex-1 bg-zinc-800" />
                            {!sidebarOpen ? null : <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest whitespace-nowrap">Governance</span>}
                            <div className="h-px flex-1 bg-zinc-800" />
                        </div>

                        <NavItem
                            icon={PenTool} label="Studio"
                            active={activeView === 'studio'} collapsed={!sidebarOpen}
                            onClick={() => setActiveView('studio')}
                        />
                        <NavItem
                            icon={Activity} label="AIOps Control"
                            active={activeView === 'aiops'} collapsed={!sidebarOpen}
                            onClick={() => setActiveView('aiops')}
                        />
                    </nav>

                    <div className="p-4 border-t border-zinc-800 space-y-2">
                        <button
                            onClick={() => toggleOnboarding(!isOnboarding)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${isOnboarding ? "bg-blue-900/40 border-blue-500 text-blue-400" : "bg-zinc-800/50 border-zinc-700 text-zinc-500 hover:text-white"}`}
                        >
                            <Activity className="w-4 h-4" />
                            {sidebarOpen && (isOnboarding ? "Sandbox Active" : "Enter Sandbox")}
                        </button>
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
        </div>
    );
}

function NavItem({ icon: Icon, label, active, collapsed, onClick }: any) {
    return (
        <button
            onClick={onClick}
            aria-label={label}
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
