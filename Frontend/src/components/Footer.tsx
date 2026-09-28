export const Footer = () => {
    return (
        <footer className="border-t border-slate-200/80 dark:border-slate-800/60 py-6 text-center text-xs text-slate-500 transition-colors duration-200">
            <p>© {new Date().getFullYear()} ShortURL. All rights reserved.</p>
        </footer>
    );
};
