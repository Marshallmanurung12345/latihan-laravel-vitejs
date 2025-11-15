import { Link } from "@inertiajs/react";

export default function Pagination({ links, className = "" }) {
    return (
        <div className={`flex flex-wrap items-center -mb-1 ${className}`}>
            {links.map((link, i) => {
                if (!link.url) {
                    return (
                        <span
                            key={i}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-white/40 border border-white/20 rounded-md"
                        />
                    );
                }
                return (
                    <Link
                        key={`link-${i}`}
                        href={link.url}
                        className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded-md transition-colors duration-200 ${
                            link.active
                                ? "bg-white text-slate-900"
                                : "bg-white/5 text-white/80 hover:bg-white/10"
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}
