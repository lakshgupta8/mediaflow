"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** Full-screen layer rendered in a portal, with Escape-to-close and scroll lock. */
export function Overlay({ open, onClose, children, label }: { open: boolean; onClose: () => void; children: ReactNode; label: string }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = previous;
        };
    }, [open, onClose]);

    if (!open || typeof document === "undefined") return null;

    return createPortal(
        <div role="dialog" aria-modal aria-label={label} className="z-100 fixed inset-0 animate-fade-in">
            {children}
        </div>,
        document.body,
    );
}
