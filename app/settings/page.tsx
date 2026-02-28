"use client";

import React, { useState } from 'react';
import { User, Bell, CreditCard, LogOut } from 'lucide-react';
import AccountSettings from '@/components/AccountSettings';
import NotificationSettings from '@/components/NotificationSettings';
import BillingSettings from '@/components/BillingSettings';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('account');

    return (
        <div className="flex flex-col gap-8 mx-auto mt-16 px-6 lg:px-10 py-8 pb-20 w-full max-w-[1400px]">

            {/* Header Section */}
            <div className="flex flex-col gap-2 pb-6 border-white/5 border-b">
                <h1 className="font-black text-white text-4xl leading-tight tracking-tight">
                    Settings
                </h1>
                <p className="font-medium text-slate-400">
                    Manage your account preferences, billing, and profile.
                </p>
            </div>

            <div className="flex md:flex-row flex-col items-start gap-8 lg:gap-12">

                {/* Settings Navigation */}
                <div className="flex flex-col gap-2 w-full md:w-64 shrink-0">
                    <button
                        onClick={() => setActiveTab('account')}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'account' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-white hover:bg-surface-dark border border-transparent hover:border-white/5'}`}
                    >
                        <User size={18} /> Account Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'notifications' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-white hover:bg-surface-dark border border-transparent hover:border-white/5'}`}
                    >
                        <Bell size={18} /> Notifications
                    </button>
                    <button
                        onClick={() => setActiveTab('billing')}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'billing' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-white hover:bg-surface-dark border border-transparent hover:border-white/5'}`}
                    >
                        <CreditCard size={18} /> Billing
                    </button>

                    <div className="bg-white/5 my-2 w-full h-px"></div>

                    <button className="flex items-center gap-3 hover:bg-red-500/10 px-4 py-3 rounded-xl w-full font-semibold text-red-500 transition-colors">
                        <LogOut size={18} /> Log Out
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-surface-dark p-6 lg:p-10 border border-white/5 rounded-2xl w-full">
                    {activeTab === 'account' && <AccountSettings />}
                    {activeTab === 'notifications' && <NotificationSettings />}
                    {activeTab === 'billing' && <BillingSettings />}
                </div>
            </div>
        </div>
    );
}
