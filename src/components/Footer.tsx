import { Github, FileText, Twitter } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="border-t border-brand-accent-gold/15 bg-brand-dark py-12">
            <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                    <img src="/monogram-cb.svg" alt="" className="h-8 w-8" aria-hidden />
                    <span className="text-lg font-serif tracking-[0.15em] uppercase text-brand-ivory">crosschainBule</span>
                </div>

                <div className="flex items-center gap-8">
                    <a href="#" className="text-sm text-brand-muted hover:text-brand-accent-champagne transition-colors flex items-center gap-2">
                        <Github className="w-4 h-4" /> GitHub
                    </a>
                    <a href="#" className="text-sm text-brand-muted hover:text-brand-accent-champagne transition-colors flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Documentation
                    </a>
                    <a href="#" className="text-sm text-brand-muted hover:text-brand-accent-champagne transition-colors flex items-center gap-2">
                        <Twitter className="w-4 h-4" /> Twitter
                    </a>
                </div>

                <div className="text-sm text-brand-muted font-sans tracking-wide">
                    Built on Ethereum
                </div>
            </div>
        </footer>
    );
};
