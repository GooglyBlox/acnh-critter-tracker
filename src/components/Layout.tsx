import { ReactNode } from 'react';
import { Github } from 'lucide-react';
import ACLeaf from './ACLeaf';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen relative bg-background bg-[url('/Leaf_Background_Spring.jpg')] bg-repeat flex flex-col">
            <header className="relative bg-primary">
                <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <ACLeaf className="w-6 h-6 text-white/90"/>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                ACNH Critter Tracker
                            </h1>
                            <p className="text-sm text-white/80">
                                Track and catch all your Animal Crossing: New Horizons critters!
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 flex-grow">
                {children}
            </main>

            <footer className="bg-white border-t mt-auto">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-center gap-4 text-sm">
                        <a
                            href="https://github.com/GooglyBlox/acnh-critter-tracker"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            <span>GitHub</span>
                        </a>
                        <span className="text-text-secondary flex items-center gap-1">
                            |
                        </span>
                        <span className="text-text-secondary flex items-center gap-1">
                            Made with <ACLeaf className="w-4 h-4 text-primary"/> by GooglyBlox
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}