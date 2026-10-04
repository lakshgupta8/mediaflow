"use client";

import React, { useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, HelpCircle, X } from 'lucide-react';
import { Button, buttonClass, cx } from '@/components/ui/primitives';

const SOLID_DANGER =
    'inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-sm font-semibold whitespace-nowrap bg-danger text-primary-ink hover:bg-danger/85 transition-[background-color,transform] duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = false,
}: ConfirmationModalProps) {
    const titleId = useId();
    const messageId = useId();

    // Close on Escape while open.
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    const Icon = isDestructive ? AlertTriangle : HelpCircle;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="z-100 fixed inset-0 flex justify-center items-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        aria-hidden
                    />

                    {/* Panel */}
                    <motion.div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        aria-describedby={messageId}
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 12 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="relative bg-surface-dark shadow-2xl shadow-black/60 p-6 sm:p-7 border border-line-strong rounded-3xl w-full max-w-md overflow-hidden"
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close dialog"
                            className="top-4 right-4 absolute flex justify-center items-center hover:bg-white/6 rounded-lg size-9 text-fg-subtle hover:text-fg transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div
                            className={cx(
                                'flex justify-center items-center mb-5 border rounded-2xl size-12',
                                isDestructive
                                    ? 'bg-danger/10 border-danger/20 text-danger'
                                    : 'bg-primary/12 border-primary/20 text-primary-light',
                            )}
                        >
                            <Icon size={22} />
                        </div>

                        <h3 id={titleId} className="pr-8 font-display font-semibold text-fg text-xl">
                            {title}
                        </h3>
                        <p id={messageId} className="mt-2 text-fg-muted text-sm leading-relaxed">
                            {message}
                        </p>

                        <div className="flex sm:flex-row flex-col-reverse gap-3 mt-7">
                            <Button variant="secondary" autoFocus={isDestructive} onClick={onClose} className="flex-1">
                                {cancelText}
                            </Button>
                            <button
                                type="button"
                                autoFocus={!isDestructive}
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={isDestructive ? cx(SOLID_DANGER, 'flex-1') : buttonClass('primary', 'md', 'flex-1')}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
