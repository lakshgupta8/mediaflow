"use client";

import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "@/store/features/searchSlice";
import { useEffect } from "react";

type SearchForm = {
    query: string;
};

export function Header() {
    const pathname = usePathname();
    const dispatch = useDispatch();

    const { register, watch, handleSubmit } = useForm<SearchForm>({
        defaultValues: { query: "" }
    });

    const query = watch("query");

    useEffect(() => {
        dispatch(setSearchQuery(query));
    }, [query, dispatch]);

    const onSubmit = (data: SearchForm) => {
        dispatch(setSearchQuery(data.query));
        // Can add navigation to search page here if needed
    };

    if (pathname === '/login' || pathname === '/signup') return null;

    let placeholder = "Search movies, series, cast...";
    if (pathname?.startsWith("/settings")) {
        placeholder = "Search settings...";
    } else if (pathname === "/watchlist") {
        placeholder = "Search your watchlist...";
    } else if (pathname === "/favorites") {
        placeholder = "Search your favorites...";
    } else if (pathname === "/recent") {
        placeholder = "Search recent history...";
    } else if (pathname === "/genre") {
        placeholder = "Search genres...";
    }

    return (
        <header className="top-0 right-0 left-0 z-30 absolute flex justify-between items-center bg-linear-to-b from-background-dark/90 to-transparent p-6 pointer-events-none">
            <div className="hidden md:block w-full max-w-md pointer-events-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="group relative">
                    <div className="left-0 absolute inset-y-0 flex items-center pl-4 pointer-events-none">
                        <Search className="text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                    </div>
                    <input
                        {...register('query')}
                        className="block bg-surface-dark/80 shadow-lg backdrop-blur-md py-3 pr-4 pl-12 border border-white/10 focus:border-primary/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 w-full text-white text-sm transition-all placeholder-slate-400"
                        placeholder={placeholder}
                        type="text"
                    />
                    <div className="right-0 absolute inset-y-0 flex items-center pr-3 pointer-events-none">
                        <span className="px-1.5 py-0.5 border border-slate-600 rounded text-slate-500 text-xs">
                            ⌘K
                        </span>
                    </div>
                </form>
            </div>

            <div className="flex items-center gap-4 ml-auto pointer-events-auto">
                <div className="group md:hidden relative">
                    <Search className="text-slate-400" size={20} />
                </div>
                <button className="bg-surface-dark/80 hover:bg-white/10 p-2 border border-white/10 rounded-full text-slate-300 hover:text-white transition-colors">
                    <Bell size={20} />
                </button>
            </div>
        </header>
    );
}
