import { ReactNode } from "react";

interface TooltipProps {
    children: ReactNode;
    content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
    return (
        <div className="group relative flex justify-center items-center w-full">
            {children}
            <div className="left-[calc(100%+16px)] z-50 absolute bg-[#1a1c29] opacity-0 group-hover:opacity-100 shadow-xl px-3 py-1.5 border border-white/10 rounded-lg font-medium text-white text-sm whitespace-nowrap scale-95 group-hover:scale-100 origin-left transition-all pointer-events-none">
                {content}
            </div>
        </div>
    );
}
