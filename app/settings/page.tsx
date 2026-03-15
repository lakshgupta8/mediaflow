"use client";

import React, { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import AccountSettings from '@/components/AccountSettings';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { AuthGuard } from '@/components/AuthGuard';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('account');

    const tabs = [
        { id: 'account', label: 'Account Settings', icon: User },
    ];

    const searchQuery = useSelector((state: RootState) => state.search.query).toLowerCase();
    const filteredTabs = tabs.filter(tab => {
        if (!searchQuery) return true;
        return tab.label.toLowerCase().includes(searchQuery);
    });

    return (
        <AuthGuard title="Account Settings" description="Manage your preferences and profile. Log in to access your account settings.">
            <div className="flex flex-col gap-8 mx-auto mt-16 px-6 lg:px-10 py-8 pb-20 w-full max-w-[1400px]">

                {/* Header Section */}
                <div className="flex flex-col gap-2 pb-6 border-white/5 border-b">
                    <h1 className="font-black text-white text-4xl leading-tight tracking-tight">
                        Settings
                    </h1>
                    <p className="font-medium text-slate-400">
                        Manage your account preferences and profile.
                    </p>
                </div>

                <div className="flex md:flex-row flex-col items-start gap-8 lg:gap-12">

                    {/* Settings Navigation */}
                    <div className="flex flex-col gap-2 w-full md:w-64 shrink-0">
                        {filteredTabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-white hover:bg-surface-dark border border-transparent hover:border-white/5'}`}
                                >
                                    <Icon size={18} /> {tab.label}
                                </button>
                            );
                        })}

                        {filteredTabs.length === 0 && (
                            <p className="py-2 text-slate-500 text-sm">No exact settings found.</p>
                        )}

                        <div className="bg-white/5 my-2 w-full h-px"></div>

                        <button
                            onClick={async () => {
                                const { createClient } = await import('@/utils/supabase/client');
                                const supabase = createClient();
                                await supabase.auth.signOut();
                            }}
                            className="flex items-center gap-3 hover:bg-red-500/10 px-4 py-3 rounded-xl w-full font-semibold text-red-500 transition-colors"
                        >
                            <LogOut size={18} /> Log Out
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-surface-dark p-6 lg:p-10 border border-white/5 rounded-2xl w-full">
                        {activeTab === 'account' && <AccountSettings />}
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
