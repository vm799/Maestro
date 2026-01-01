import React, { useState } from 'react';
import { Plus, Search, Filter, Briefcase, ArrowRight, UserCircle, Calendar, X, Building2, Globe } from 'lucide-react';

export function Dashboard() {
    // State for the "New Engagement" Wizard
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [newClient, setNewClient] = useState({ name: '', industry: '', region: 'NA' });

    // Real Data Management
    const [clients, setClients] = useState([
        { id: 1, name: "Northwind Traders", industry: "Logistics", phase: "Discovery", status: "Active" },
    ]);

    const handleCreateClient = (e: React.FormEvent) => {
        e.preventDefault();
        const client = {
            id: Date.now(),
            name: newClient.name,
            industry: newClient.industry,
            phase: "Onboarding",
            status: "New"
        };
        setClients([...clients, client]);
        setIsWizardOpen(false);
        setNewClient({ name: '', industry: '', region: 'NA' });
    };

    const loadClient = (client: any) => {
        // In a real app, this would load context. 
        // For now, we simulate "Opening" the file by navigating to Phase 1.
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'stackmap' }));
    };

    return (
        <div className="h-full w-full bg-background flex flex-col p-8 overflow-y-auto">
            <header className="flex justify-between items-end mb-10 border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Client Portfolio</h1>
                    <p className="text-muted-foreground mt-2 text-sm">Select an active engagement or initialize a new consulting project.</p>
                </div>
                <button
                    onClick={() => setIsWizardOpen(true)}
                    className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" /> New Engagement
                </button>
            </header>

            {/* Client Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map(client => (
                    <div
                        key={client.id}
                        onClick={() => loadClient(client)}
                        className="group bg-card border border-border hover:border-primary/50 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-secondary px-2 py-1 rounded">
                                {client.status}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold mb-1 text-foreground group-hover:text-primary transition-colors">{client.name}</h3>
                        <p className="text-sm text-muted-foreground mb-6">{client.industry}</p>

                        <div className="space-y-3 border-t border-border pt-4">
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Current Phase</span>
                                <span className="font-semibold text-foreground">{client.phase}</span>
                            </div>
                            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
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
                {clients.length === 0 && (
                    <div className="col-span-full text-center py-20 border-2 border-dashed border-border rounded-xl">
                        <p className="text-muted-foreground">No active engagements. Start a new project.</p>
                    </div>
                )}
            </div>

            {/* New Engagement Wizard (Modal) */}
            {isWizardOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-card border border-border w-full max-w-lg rounded-2xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsWizardOpen(false)}
                            className="absolute top-6 right-6 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-2">Initialize Engagement</h2>
                            <p className="text-sm text-muted-foreground">Configure the client parameters for the Sovereign Architect audit.</p>
                        </div>

                        <form onSubmit={handleCreateClient} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Client Name</label>
                                <input
                                    autoFocus
                                    className="w-full bg-secondary border border-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="e.g. Acme Corp"
                                    value={newClient.name}
                                    onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Industry</label>
                                    <input
                                        className="w-full bg-secondary border border-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="e.g. Healthcare"
                                        value={newClient.industry}
                                        onChange={e => setNewClient({ ...newClient, industry: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Region</label>
                                    <select
                                        className="w-full bg-secondary border border-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                        value={newClient.region}
                                        onChange={e => setNewClient({ ...newClient, region: e.target.value })}
                                    >
                                        <option value="NA">North America</option>
                                        <option value="EU">Europe (GDPR)</option>
                                        <option value="APAC">Asia Pacific</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsWizardOpen(false)}
                                    className="flex-1 py-3 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newClient.name}
                                    className="flex-1 py-3 bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                                >
                                    Create Engagement
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
