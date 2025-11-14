import { Link } from "@inertiajs/react";

export default function Pagination({ links, className = "" }) {
    return (
        <div className={`flex items-center space-x-1 ${className}`}>
            {links.map((link, i) => {
                if (!link.url) {
                    return (
                        <span
                            key={i}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className="px-3 py-2 text-sm text-gray-400 border rounded"
                        />
                    );
                }
                return (
                    <Link
                        key={`link-${i}`}
                        href={link.url}
                        className={`px-3 py-2 text-sm border rounded hover:bg-blue-600 hover:text-white ${
                            link.active ? "bg-blue-600 text-white" : "bg-white"
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}
