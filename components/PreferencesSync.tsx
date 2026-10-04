"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { account } from "@/lib/appwrite";
import { DEFAULT_REGION, hydratePreferences } from "@/store/features/preferencesSlice";
import type { RootState } from "@/store/store";

const STORAGE_KEY = "mediaflow:preferences";

interface StoredPreferences {
    region?: string;
    myProviders?: number[];
}

function readLocal(): StoredPreferences {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as StoredPreferences) : {};
    } catch {
        return {};
    }
}

function writeLocal(prefs: StoredPreferences) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
        // Storage can be unavailable (private mode); preferences then last for the session only.
    }
}

/** Guesses a watch region from the browser locale, e.g. "en-IN" gives "IN". */
function guessRegion(): string {
    try {
        const locale = Intl.DateTimeFormat().resolvedOptions().locale || navigator.language;
        const region = new Intl.Locale(locale).maximize().region;
        return region && /^[A-Z]{2}$/.test(region) ? region : DEFAULT_REGION;
    } catch {
        return DEFAULT_REGION;
    }
}

/**
 * Keeps region and "my services" in sync between Redux, localStorage and,
 * for logged-in users, Appwrite account preferences (so they follow the user across devices).
 */
export function PreferencesSync() {
    const dispatch = useDispatch();
    const { region, myProviders, hydrated } = useSelector((state: RootState) => state.preferences);
    const user = useSelector((state: RootState) => state.auth.user);
    const loadedAccountFor = useRef<string | null>(null);
    // Account writes start only after the account's own prefs were read, so they are never clobbered.
    const [accountReadyFor, setAccountReadyFor] = useState<string | null>(null);

    // 1. Local hydration on first load.
    useEffect(() => {
        const local = readLocal();
        dispatch(hydratePreferences({
            region: local.region || guessRegion(),
            myProviders: local.myProviders || [],
        }));
    }, [dispatch]);

    // 2. When a user logs in, account preferences win over local ones.
    useEffect(() => {
        if (!user || loadedAccountFor.current === user.id) return;
        loadedAccountFor.current = user.id;
        const userId = user.id;

        account.getPrefs<StoredPreferences & Record<string, unknown>>()
            .then((prefs) => {
                if (prefs.region || prefs.myProviders) {
                    dispatch(hydratePreferences({
                        region: typeof prefs.region === "string" ? prefs.region : undefined,
                        myProviders: Array.isArray(prefs.myProviders) ? prefs.myProviders.map(Number) : undefined,
                    }));
                }
            })
            .catch(() => {
                // Prefs are a convenience; local values still apply.
            })
            .finally(() => setAccountReadyFor(userId));
    }, [user, dispatch]);

    // 3. Persist every change locally, and to the account when logged in.
    useEffect(() => {
        if (!hydrated) return;
        writeLocal({ region, myProviders });

        if (!user || accountReadyFor !== user.id) return;
        const timer = setTimeout(() => {
            account.updatePrefs({ prefs: { region, myProviders } }).catch(() => undefined);
        }, 600);
        return () => clearTimeout(timer);
    }, [region, myProviders, hydrated, user, accountReadyFor]);

    return null;
}
