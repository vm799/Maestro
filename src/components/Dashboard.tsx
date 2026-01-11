import { useState } from 'react';
import { Plus, ArrowRight, Building2, Activity } from 'lucide-react';
import { useClient } from '../context/ClientContext';
import { OnboardingFlow } from './onboarding/OnboardingFlow';

export function Dashboard() {
    const { isOnboarding } = useClient();

    // State for the "New Engagement" Wizard
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Real Data Management
    const [clients] = useState<any[]>([]);

    // Inject sample data ONLY if in onboarding mode
    const displayClients = isOnboarding
        ? [{ id: 'sample-a', name: "Sample Client A (Sandbox)", industry: "eCommerce", phase: "Discovery", status: "Sandbox" }, ...clients]
        : clients;

    const handleOnboardingComplete = () => {
        // In a real app, we'd add the client to the list. 
        // For the simulation, we just close the flow and open the map.
        setShowOnboarding(false);
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'stackmap' }));
    };

    const loadClient = (_client: any) => {
        // In a real app, this would load context. 
        // For now, we simulate "Opening" the file by navigating to Phase 1.
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'stackmap' }));
    };

    return (
        <div className="h-full w-full bg-zinc-950 flex flex-col p-8 overflow-y-auto">
            <header className="flex justify-between items-end mb-10 border-b border-zinc-800 pb-6 flex-wrap gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">Client Portfolio</h1>
                    <p className="text-zinc-400 mt-2 text-sm font-medium">Select an active engagement or initialize a new consulting project.</p>
                </div>
                <button
                    onClick={() => setShowOnboarding(true)}
                    aria-label="Create New Engagement"
                    className="bg-primary text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" /> New Engagement
                </button>
            </header>

            {/* Client Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayClients.map(client => (
                    <div
                        key={client.id}
                        onClick={() => loadClient(client)}
                        aria-label={`Open engagement for ${client.name}`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && loadClient(client)}
                        className="group relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer shadow-lg hover:shadow-primary/10"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-secondary px-2 py-1 rounded">
                                {client.status}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold mb-1 text-zinc-100 group-hover:text-primary transition-colors">{client.name}</h3>
                        <p className="text-sm text-zinc-400 mb-6">{client.industry}</p>

                        <div className="space-y-3 border-t border-zinc-800 pt-4">
                            <div className="flex justify-between text-xs">
                                <span className="text-zinc-500">Current Phase</span>
                                <span className="font-semibold text-zinc-200">{client.phase}</span>
                            </div>
                            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-1/4" /> {/* Progress Bar */}
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                            <span>Open Workshop</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                ))}

                {/* Empty State / Add Button */}
                {displayClients.length === 0 && (
                    <div className="col-span-full text-center py-32 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20 backdrop-blur-sm">
                        <Activity className="w-16 h-16 text-zinc-700 mx-auto mb-6 animate-pulse" />
                        <h3 className="text-2xl font-bold text-zinc-400 mb-3">Waiting for Meeting Sync...</h3>
                        <p className="text-zinc-600 max-w-sm mx-auto text-sm leading-relaxed">
                            No active engagements detected. Connect the <span className="text-primary font-bold">Maestro MeetingParser</span> or CRM hooks to initialize real-time data orchestration.
                        </p>
                    </div>
                )}
            </div>

            {/* Onboarding Flow Wizard */}
            {showOnboarding && (
                <OnboardingFlow onComplete={handleOnboardingComplete} />
            )}
        </div>
    );
}
