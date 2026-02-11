'use client'

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { colors } from '@/themes/colors';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'warning'
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: 'bg-red-100 dark:bg-red-900/20',
            iconColor: 'text-red-600 dark:text-red-400',
            button: 'bg-red-600 hover:bg-red-700'
        },
        warning: {
            icon: `bg-blue-100 dark:bg-blue-900/20`,
            iconColor: `text-blue-600 dark:text-blue-400`,
            button: `bg-blue-600 hover:bg-blue-700`
        },
        info: {
            icon: `bg-blue-100 dark:bg-blue-900/20`,
            iconColor: `text-blue-600 dark:text-blue-400`,
            button: `bg-blue-600 hover:bg-blue-700`
        }
    };

    const styles = variantStyles[variant];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8">
                    <div className="flex items-start gap-6">
                        <div className={`w-16 h-16 ${styles.icon} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            <AlertTriangle className={`w-8 h-8 ${styles.iconColor}`} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                                {title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {message}
                            </p>
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 group"
                        >
                            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
                        </button>
                    </div>
                </div>

                <div className="px-8 pb-8 flex gap-3 justify-end bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-semibold text-sm shadow-sm"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onCancel();
                        }}
                        className={`px-6 py-3 text-white rounded-xl transition-all duration-200 font-bold text-sm shadow-lg transform hover:scale-105 active:scale-95 ${styles.button}`}
                        style={{
                            background: variant === 'warning' || variant === 'info' 
                                ? `linear-gradient(135deg, ${colors.primary[600]}, ${colors.primary[700]})` 
                                : undefined,
                            boxShadow: variant === 'warning' || variant === 'info' 
                                ? `0 8px 24px ${colors.primary[600]}25, 0 4px 12px ${colors.primary[600]}15` 
                                : undefined
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
