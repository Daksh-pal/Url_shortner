export const BackgroundGlow = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/20 blur-[130px] rounded-full transition-colors duration-500" />
            <div className="absolute top-1/3 -right-20 w-[400px] h-[300px] bg-cyan-400/10 dark:bg-cyan-500/15 blur-[120px] rounded-full transition-colors duration-500" />
            <div className="absolute bottom-10 -left-20 w-[400px] h-[300px] bg-purple-500/10 dark:bg-purple-600/15 blur-[120px] rounded-full transition-colors duration-500" />
        </div>
    );
};
