"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

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
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-surface-dark border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
                    >
                        {/* Accent Gradient */}
                        <div className={`absolute top-0 left-0 w-full h-1.5 ${isDestructive ? 'bg-linear-to-r from-red-500 to-rose-600' : 'bg-linear-to-r from-primary to-primary-light'}`} />

                        <div className="flex flex-col items-center text-center">
                            <div className={`mb-6 p-4 rounded-2xl ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                                <AlertTriangle size={32} />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                            <p className="text-slate-400 leading-relaxed mb-8">
                                {message}
                            </p>

                            <div className="flex w-full gap-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`flex-1 px-6 py-3.5 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm ${
                                        isDestructive 
                                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                                        : 'bg-primary hover:bg-primary-light text-background-dark'
                                    }`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>

                        {/* Close Icon (Optional) */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
