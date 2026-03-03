import React, { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';

export default function NotificationSettings() {
    const { userSettings, updateSettings, isUpdatingSettings, isLoadingSettings } = useSupabase();

    // Default to true if userSettings is loading or null
    const baseEmailEnabled = userSettings ? userSettings.email_notifications : true;
    const [localEmailEnabled, setLocalEmailEnabled] = useState<boolean | null>(null);

    // Derived state determining the actual switch status
    // If local state is null, we use the server's state
    const emailEnabled = localEmailEnabled !== null ? localEmailEnabled : baseEmailEnabled;

    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleSave = async () => {
        setSubmitError('');
        setSubmitSuccess(false);
        try {
            await updateSettings({
                email_notifications: emailEnabled
            });
            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (error) {
            if (error instanceof Error) {
                setSubmitError(error.message);
            } else {
                setSubmitError('Failed to update settings');
            }
        }
    };

    if (isLoadingSettings) {
        return <div className="p-10 text-slate-400 text-center animate-pulse">Loading preferences...</div>;
    }

    return (
        <div className="space-y-10">
            {/* Channel Preferences */}
            <div className="space-y-6">
                <h3 className="flex items-center gap-2 pb-4 border-white/5 border-b font-bold text-white text-xl">
                    <span className="bg-primary rounded-full w-1 h-5"></span> Channel Preferences
                </h3>

                <div className="flex flex-col gap-6 pt-2">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="font-bold text-white">Email Notifications</span>
                            <span className="font-medium text-slate-400 text-sm">Receive account updates and recommendations</span>
                        </div>
                        <label className="inline-flex relative items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={emailEnabled}
                                onChange={(e) => setLocalEmailEnabled(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="peer after:top-[2px] after:left-[2px] after:absolute bg-white/10 after:bg-white peer-checked:bg-primary after:border after:border-gray-300 peer-checked:after:border-white rounded-full after:rounded-full peer-focus:outline-none w-11 after:w-5 h-6 after:h-5 after:content-[''] transition-colors after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-6 border-white/5 border-t">
                <div className="flex-1">
                    {submitSuccess && <span className="font-bold text-green-500 text-sm">Preferences updated successfully!</span>}
                    {submitError && <span className="font-bold text-red-500 text-sm">{submitError}</span>}
                </div>
                <button
                    onClick={handleSave}
                    disabled={isUpdatingSettings || (userSettings?.email_notifications === emailEnabled)}
                    className="bg-primary hover:bg-primary/90 disabled:opacity-50 hover:shadow-lg hover:shadow-primary/20 disabled:hover:shadow-none px-8 py-3 rounded-xl font-bold text-background-dark text-sm transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
                >
                    {isUpdatingSettings ? 'Saving...' : 'Save Preferences'}
                </button>
            </div>
        </div>
    );
}
