import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <header className="bg-primary text-white">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold">ACNH Critter Tracker</h1>
                    <p className="text-sm opacity-90">Track and catch all your Animal Crossing: New Horizons critters!</p>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="bg-white border-t">
                <div className="container mx-auto px-4 py-6 text-center text-sm text-text-secondary">
                    Made with 🍃 by GooglyBlox
                </div>
            </footer>
        </div>
    );
}