import React from 'react';
import { CreditCard, Download } from 'lucide-react';

export default function BillingSettings() {
    const billingHistory = [
        { date: "Oct 12, 2023", amount: "$14.99", status: "Paid", invoice: "#INV-2023-10" },
        { date: "Sep 12, 2023", amount: "$14.99", status: "Paid", invoice: "#INV-2023-09" },
        { date: "Aug 12, 2023", amount: "$14.99", status: "Paid", invoice: "#INV-2023-08" },
        { date: "Jul 12, 2023", amount: "$14.99", status: "Paid", invoice: "#INV-2023-07" },
    ];

    return (
        <div className="space-y-10">

            {/* Current Plan */}
            <div className="space-y-6">
                <h3 className="flex items-center gap-2 pb-4 border-white/5 border-b font-bold text-white text-xl">
                    <span className="bg-primary rounded-full w-1 h-5"></span> Current Plan
                </h3>

                <div className="relative flex sm:flex-row flex-col justify-between items-start sm:items-center gap-6 bg-primary/5 p-6 pt-2 border border-primary/20 rounded-2xl overflow-hidden">
                    <div className="top-0 right-0 absolute bg-primary/10 blur-3xl rounded-full w-32 h-32 -translate-y-1/2 translate-x-1/3"></div>

                    <div className="z-10 relative flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <span className="font-black text-white text-2xl">Premium 4K</span>
                            <span className="bg-primary/20 px-2.5 py-1 rounded font-bold text-primary text-xs uppercase tracking-wider">Active</span>
                        </div>
                        <span className="font-medium text-slate-400">
                            $14.99/month • Renews on Nov 12, 2023
                        </span>
                    </div>

                    <div className="z-10 relative flex items-center gap-3 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-xl font-bold text-white text-sm transition-colors">
                            Cancel Plan
                        </button>
                        <button className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 px-6 py-2.5 rounded-xl font-bold text-background-dark text-sm transition-all">
                            Upgrade
                        </button>
                    </div>
                </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-6 pt-6 border-white/5 border-t">
                <h3 className="flex items-center gap-2 pb-4 border-white/5 border-b font-bold text-white text-xl">
                    <span className="bg-primary rounded-full w-1 h-5"></span> Payment Method
                </h3>

                <div className="flex justify-between items-center bg-background-dark mt-2 p-5 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="flex justify-center items-center bg-white/10 p-1 rounded w-12 h-8">
                            {/* Placeholder for Visa logo, using icon for now */}
                            <CreditCard className="opacity-80 w-full h-full text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-white">Visa ending in 4242</span>
                            <span className="font-medium text-slate-400 text-sm">Expires 12/26</span>
                        </div>
                    </div>
                    <button className="p-2 font-bold text-primary text-sm hover:underline">
                        Edit
                    </button>
                </div>
            </div>

            {/* Billing History */}
            <div className="space-y-6 pt-6 border-white/5 border-t">
                <h3 className="flex items-center gap-2 pb-4 border-white/5 border-b font-bold text-white text-xl">
                    <span className="bg-primary rounded-full w-1 h-5"></span> Billing History
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-white/10 border-b">
                                <th className="pb-3 font-bold text-slate-400 text-sm uppercase tracking-wider">Date</th>
                                <th className="pb-3 font-bold text-slate-400 text-sm uppercase tracking-wider">Invoice</th>
                                <th className="pb-3 font-bold text-slate-400 text-sm uppercase tracking-wider">Amount</th>
                                <th className="pb-3 font-bold text-slate-400 text-sm uppercase tracking-wider">Status</th>
                                <th className="pb-3 font-bold text-slate-400 text-sm text-right uppercase tracking-wider">Download</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {billingHistory.map((item, index) => (
                                <tr key={index} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 font-medium text-white">{item.date}</td>
                                    <td className="py-4 text-slate-400">{item.invoice}</td>
                                    <td className="py-4 font-bold text-white">{item.amount}</td>
                                    <td className="py-4">
                                        <span className="inline-flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded font-bold text-primary text-xs">
                                            <div className="bg-primary rounded-full w-1.5 h-1.5"></div>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button className="inline-block hover:bg-primary/10 p-2 rounded-lg text-slate-400 hover:text-primary transition-colors">
                                            <Download size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
