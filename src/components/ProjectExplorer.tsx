import { Folder, FileText, ChevronRight, Plus } from 'lucide-react';

interface ProjectExplorerProps {
    activeProject: string | null;
    onSelect: (project: string) => void;
}

export function ProjectExplorer({ activeProject, onSelect }: ProjectExplorerProps) {
    const projects = ["Project Orbit", "Global Pharma Audit", "FinTech De-Risk"];

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Projects</h2>
                <button className="p-1 hover:bg-accent rounded-md"><Plus className="w-4 h-4" /></button>
            </div>

            <div className="space-y-1">
                {projects.map((proj) => (
                    <div
                        key={proj}
                        onClick={() => onSelect(proj)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${activeProject === proj ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-foreground'
                            }`}
                    >
                        <Folder className="w-4 h-4" />
                        <span>{proj}</span>
                        {activeProject === proj && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Recent Artifacts</h2>
                <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 px-3 py-1 hover:text-foreground cursor-pointer">
                        <FileText className="w-3 h-3" />
                        <span>Risk_Framework_v2.pdf</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 hover:text-foreground cursor-pointer">
                        <FileText className="w-3 h-3" />
                        <span>Keynote_Speech_Draft.md</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
