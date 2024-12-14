export function LoadingIndicator() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-text-secondary">Loading critters...</p>
        </div>
    );
}