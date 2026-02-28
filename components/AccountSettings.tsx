import React from 'react';
import { Camera, Smartphone, Laptop, LogOut, CheckCircle2, XCircle, Key } from 'lucide-react';

export default function AccountSettings() {
    return (
        <div className="space-y-10">

            {/* Public Profile */}
            <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-white/5 border-b">
                    <h3 className="flex items-center gap-2 font-bold text-white text-xl">
                        <span className="bg-primary rounded-full w-1 h-5"></span> Personal Information
                    </h3>
                    <span className="bg-primary/20 px-3 py-1 rounded-full font-bold text-primary text-xs uppercase tracking-wider">Pro Member</span>
                </div>

                <div className="flex sm:flex-row flex-col items-start sm:items-center gap-6 pt-2">
                    <div className="group relative cursor-pointer shrink-0">
                        <div className="border-2 border-primary/20 group-hover:border-primary rounded-full w-24 h-24 overflow-hidden transition-colors">
                            <div className="bg-cover bg-center w-full h-full" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCedjOjCf4XTbJ8yVlGUAF-fcHQDrCuA3FEuyM7AJVDTzUzUGmJqn4BleiID4vRtQNdFFsNnHdBjq02Kf85qXBNoSMW-Y32AOcIbSzTRZ7fQi5lmTIko1fDvgBE0DaiJl7MP8Y-vyNFjvLqhyhHouvVemgiNutFMhMM4Qckkw6hfhv6c84RayYobmykBpYfUH7CR5sAVYGEp1CuL6kR-S2rCXzWLsg1yA07VwzNl2ZD3EFKUC4kxUmA7YQOFsRHtXw4ZQfAwq8OGw')" }} />
                        </div>
                        <div className="absolute inset-0 flex justify-center items-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                            <Camera className="text-white" size={24} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-3">
                            <button className="bg-white/10 hover:bg-white/20 shadow-sm px-5 py-2 rounded-lg font-bold text-white text-sm transition-colors">
                                Change Picture
                            </button>
                            <button className="px-5 py-2 rounded-lg font-bold text-slate-400 hover:text-white text-sm transition-colors">
                                Remove
                            </button>
                        </div>
                        <p className="text-slate-500 text-xs">JPG, GIF or PNG. Max size of 800K.</p>
                    </div>
                </div>

                <div className="gap-6 grid grid-cols-1 md:grid-cols-2 pt-4">
                    <div className="relative space-y-2 md:col-span-2">
                        <label className="ml-1 font-bold text-slate-300 text-sm">Full Name</label>
                        <input type="text" defaultValue="Alex Remington" className="bg-background-dark px-4 py-3 border border-white/5 focus:border-primary rounded-xl focus:outline-none focus:ring-1 focus:ring-primary w-full font-medium text-white transition-all" />
                    </div>
                    <div className="relative space-y-2">
                        <label className="ml-1 font-bold text-slate-300 text-sm">Email Address</label>
                        <input type="email" defaultValue="alex.remington@cinema.app" className="bg-background-dark px-4 py-3 border border-white/5 focus:border-primary rounded-xl focus:outline-none focus:ring-1 focus:ring-primary w-full font-medium text-white transition-all" />
                    </div>
                    <div className="relative space-y-2">
                        <label className="ml-1 font-bold text-slate-300 text-sm">Phone Number</label>
                        <input type="tel" defaultValue="+1 (555) 012-3456" className="bg-background-dark px-4 py-3 border border-white/5 focus:border-primary rounded-xl focus:outline-none focus:ring-1 focus:ring-primary w-full font-medium text-white transition-all" />
                    </div>
                </div>
            </div>

            {/* Connected Devices */}
            <div className="space-y-6 pt-6 border-white/5 border-t">
                <div className="flex justify-between items-center pb-4 border-white/5 border-b">
                    <h3 className="flex items-center gap-2 font-bold text-white text-xl">
                        <span className="bg-primary rounded-full w-1 h-5"></span> Connected Devices
                    </h3>
                    <button className="font-bold text-primary text-sm hover:underline">Log out of all</button>
                </div>

                <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-2">
                    {/* Device 1 */}
                    <div className="group relative flex flex-col gap-4 bg-background-dark p-4 border border-primary/20 rounded-xl overflow-hidden">
                        <div className="top-0 right-0 absolute bg-primary/5 group-hover:bg-primary/10 blur-2xl rounded-full w-24 h-24 transition-colors -translate-y-1/2 translate-x-1/3"></div>
                        <div className="z-10 flex items-start gap-4">
                            <div className="flex justify-center items-center bg-primary/10 rounded-lg w-10 h-10 shrink-0">
                                <Laptop className="text-primary" size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-white">MacBook Pro 16</span>
                                <span className="flex items-center gap-1 mt-0.5 font-bold text-primary text-xs"><div className="bg-primary rounded-full w-1.5 h-1.5 animate-pulse"></div> Current Device</span>
                            </div>
                        </div>
                    </div>

                    {/* Device 2 */}
                    <div className="group relative flex flex-col gap-4 bg-background-dark p-4 border border-white/5 rounded-xl overflow-hidden">
                        <div className="z-10 flex justify-between items-start gap-4 mb-2 w-full">
                            <div className="flex items-start gap-4">
                                <div className="flex justify-center items-center bg-white/5 rounded-lg w-10 h-10 shrink-0">
                                    <Smartphone className="text-slate-400" size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-white">iPhone 15 Pro</span>
                                    <span className="mt-0.5 font-medium text-slate-400 text-xs">Active 2h ago</span>
                                </div>
                            </div>
                        </div>
                        <button className="z-10 flex justify-center items-center gap-2 bg-white/5 hover:bg-white/10 py-2 rounded-lg w-full font-bold text-slate-400 hover:text-white text-sm transition-colors">
                            <LogOut size={16} /> Log Out
                        </button>
                    </div>

                    {/* Device 3 */}
                    <div className="group relative flex flex-col gap-4 bg-background-dark p-4 border border-white/5 rounded-xl overflow-hidden">
                        <div className="z-10 flex justify-between items-start gap-4 mb-2 w-full">
                            <div className="flex items-start gap-4">
                                <div className="flex justify-center items-center bg-white/5 rounded-lg w-10 h-10 shrink-0">
                                    <Smartphone className="text-slate-400" size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-white">iPad Air</span>
                                    <span className="mt-0.5 font-medium text-slate-400 text-xs">Active yesterday</span>
                                </div>
                            </div>
                        </div>
                        <button className="z-10 flex justify-center items-center gap-2 bg-white/5 hover:bg-white/10 py-2 rounded-lg w-full font-bold text-slate-400 hover:text-white text-sm transition-colors">
                            <LogOut size={16} /> Log Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Security Activity Logic */}
            <div className="space-y-6 pt-6 border-white/5 border-t">
                <div className="flex justify-between items-center pb-4 border-white/5 border-b">
                    <h3 className="flex items-center gap-2 font-bold text-white text-xl">
                        <span className="bg-primary rounded-full w-1 h-5"></span> Recent Security Activity
                    </h3>
                </div>

                <div className="flex flex-col gap-4 pt-2">

                    {/* Activity 1 */}
                    <div className="flex justify-between items-center bg-background-dark p-4 border border-white/5 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="flex justify-center items-center bg-green-500/10 rounded-full w-10 h-10">
                                <CheckCircle2 className="text-green-500" size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-white text-sm">Successful Login</span>
                                <span className="mt-0.5 text-slate-400 text-xs">San Francisco, CA • Chrome on macOS</span>
                            </div>
                        </div>
                        <span className="font-medium text-slate-500 text-xs">Just now</span>
                    </div>

                    {/* Activity 2 */}
                    <div className="flex justify-between items-center bg-background-dark p-4 border border-white/5 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="flex justify-center items-center bg-blue-500/10 rounded-full w-10 h-10">
                                <Key className="text-blue-500" size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-white text-sm">Password Changed</span>
                                <span className="mt-0.5 text-slate-400 text-xs">Requested via account recovery</span>
                            </div>
                        </div>
                        <span className="font-medium text-slate-500 text-xs">2 days ago</span>
                    </div>

                    {/* Activity 3 */}
                    <div className="flex justify-between items-center bg-background-dark p-4 border border-red-500/20 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="flex justify-center items-center bg-red-500/10 rounded-full w-10 h-10">
                                <XCircle className="text-red-500" size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-white text-sm">Failed Login Attempt</span>
                                <span className="mt-0.5 text-slate-400 text-xs">London, UK • Unknown Device</span>
                            </div>
                        </div>
                        <span className="font-medium text-slate-500 text-xs">1 week ago</span>
                    </div>

                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-6 border-white/5 border-t">
                <button className="bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 px-8 py-3 rounded-xl font-bold text-background-dark text-sm transition-all hover:-translate-y-0.5">
                    Save Changes
                </button>
            </div>
        </div>
    );
}
