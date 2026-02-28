import React from 'react';

export default function NotificationSettings() {
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
                            <span className="font-medium text-slate-400 text-sm">Receive updates via registered email</span>
                        </div>
                        <label className="inline-flex relative items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="peer after:top-[2px] after:left-[2px] after:absolute bg-white/10 after:bg-white peer-checked:bg-primary after:border after:border-gray-300 peer-checked:after:border-white rounded-full after:rounded-full peer-focus:outline-none w-11 after:w-5 h-6 after:h-5 after:content-[''] transition-colors after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="font-bold text-white">Push Notifications</span>
                            <span className="font-medium text-slate-400 text-sm">Alerts on your mobile device</span>
                        </div>
                        <label className="inline-flex relative items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="peer after:top-[2px] after:left-[2px] after:absolute bg-white/10 after:bg-white peer-checked:bg-primary after:border after:border-gray-300 peer-checked:after:border-white rounded-full after:rounded-full peer-focus:outline-none w-11 after:w-5 h-6 after:h-5 after:content-[''] transition-colors after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Content Updates */}
            <div className="space-y-6 pt-6 border-white/5 border-t">
                <h3 className="flex items-center gap-2 pb-4 border-white/5 border-b font-bold text-white text-xl">
                    <span className="bg-primary rounded-full w-1 h-5"></span> Content Updates
                </h3>

                <div className="flex flex-col gap-6 pt-2">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="font-bold text-white">New Movie Releases</span>
                            <span className="font-medium text-slate-400 text-sm">When movies from your favorites drop</span>
                        </div>
                        <label className="inline-flex relative items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="peer after:top-[2px] after:left-[2px] after:absolute bg-white/10 after:bg-white peer-checked:bg-primary after:border after:border-gray-300 peer-checked:after:border-white rounded-full after:rounded-full peer-focus:outline-none w-11 after:w-5 h-6 after:h-5 after:content-[''] transition-colors after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="font-bold text-white">Weekly Recommendations</span>
                            <span className="font-medium text-slate-400 text-sm">Personalized picks every Friday</span>
                        </div>
                        <label className="inline-flex relative items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="peer after:top-[2px] after:left-[2px] after:absolute bg-white/10 after:bg-white peer-checked:bg-primary after:border after:border-gray-300 peer-checked:after:border-white rounded-full after:rounded-full peer-focus:outline-none w-11 after:w-5 h-6 after:h-5 after:content-[''] transition-colors after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="font-bold text-white">Watchlist Alerts</span>
                            <span className="font-medium text-slate-400 text-sm">Notify when titles on watchlist are available</span>
                        </div>
                        <label className="inline-flex relative items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="peer after:top-[2px] after:left-[2px] after:absolute bg-white/10 after:bg-white peer-checked:bg-primary after:border after:border-gray-300 peer-checked:after:border-white rounded-full after:rounded-full peer-focus:outline-none w-11 after:w-5 h-6 after:h-5 after:content-[''] transition-colors after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-6 border-white/5 border-t">
                <button className="bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 px-8 py-3 rounded-xl font-bold text-background-dark text-sm transition-all hover:-translate-y-0.5">
                    Save Preferences
                </button>
            </div>
        </div>
    );
}
