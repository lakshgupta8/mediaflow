"use client";

import React, { Suspense, useId, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { Globe2, Info, LogIn, LogOut, Settings, Sparkles, Star, UserRound, type LucideIcon } from 'lucide-react';
import AccountSettings from '@/components/AccountSettings';
import { AuthGuard } from '@/components/AuthGuard';
import { MyServicesPicker } from '@/components/providers/MyServicesPicker';
import { Avatar, useProfileAvatar } from '@/components/layout/UserMenu';
import { Container, PageHeader, Skeleton, cx } from '@/components/ui/primitives';
import { RootState } from '@/store/store';
import { logout } from '@/store/features/authSlice';
import { authService } from '@/services/authService';

type TabId = 'account' | 'sources';

const TABS: Array<{ id: TabId; label: string; description: string; icon: LucideIcon }> = [
    { id: 'account', label: 'Account', description: 'Profile, reviews and security', icon: UserRound },
    { id: 'sources', label: 'Region & services', description: 'Where you watch', icon: Globe2 },
];

const isTabId = (value: string | null): value is TabId => TABS.some((t) => t.id === value);

/* ----------------------------------------------------------------------------
 * Tab panels
 * -------------------------------------------------------------------------- */

function SourcesPanel({ authState }: { authState: 'loading' | 'in' | 'out' }) {
    return (
        <div className="space-y-6">
            <section aria-labelledby="sources-heading" className="bg-surface-dark p-6 sm:p-8 border border-line rounded-3xl">
                <div className="mb-6">
                    <h2 id="sources-heading" className="font-display font-semibold text-fg text-lg sm:text-xl">
                        Region &amp; services
                    </h2>
                    <p className="mt-1 max-w-2xl text-fg-muted text-sm leading-relaxed">
                        Pick the country you watch from and the services you subscribe to. MediaFlow uses this to show where
                        every title is available to stream, rent or buy.
                    </p>
                </div>

                <ul className="gap-3 grid sm:grid-cols-2 mb-8">
                    <li className="flex items-start gap-3 bg-white/2 p-4 border border-line rounded-2xl">
                        <span className="flex justify-center items-center bg-primary/12 border border-primary/20 rounded-xl size-9 text-primary-light shrink-0">
                            <Globe2 size={16} />
                        </span>
                        <span>
                            <span className="block font-semibold text-fg text-sm">Region</span>
                            <span className="block mt-0.5 text-fg-muted text-xs leading-relaxed">
                                Availability and prices differ by country, so every lookup uses your region.
                            </span>
                        </span>
                    </li>
                    <li className="flex items-start gap-3 bg-white/2 p-4 border border-line rounded-2xl">
                        <span className="flex justify-center items-center bg-accent-pink/12 border border-accent-pink/20 rounded-xl size-9 text-accent-pink shrink-0">
                            <Star size={16} />
                        </span>
                        <span>
                            <span className="block font-semibold text-fg text-sm">My services</span>
                            <span className="block mt-0.5 text-fg-muted text-xs leading-relaxed">
                                Personalise the home page and get highlighted on title pages when they&apos;re included.
                            </span>
                        </span>
                    </li>
                </ul>

                <MyServicesPicker />
            </section>

            {authState === 'loading' ? null : authState === 'in' ? (
                <p className="flex items-center gap-2 px-1 text-fg-subtle text-xs">
                    <Sparkles size={13} className="text-primary" /> Changes save automatically and sync to your account.
                </p>
            ) : (
                <div className="flex sm:flex-row flex-col sm:items-center gap-4 bg-primary/6 p-4 sm:p-5 border border-primary/20 rounded-2xl">
                    <div className="flex flex-1 items-start gap-3 min-w-0">
                        <Info size={18} className="mt-0.5 text-primary-light shrink-0" />
                        <p className="text-fg-muted text-sm leading-relaxed">
                            Your picks are saved on this device.{' '}
                            <Link href="/login" className="font-semibold text-primary-light hover:text-fg underline-offset-4 hover:underline">
                                Sign in
                            </Link>{' '}
                            to sync them across all your devices.
                        </p>
                    </div>
                    <Link
                        href="/login"
                        className="inline-flex items-center self-start sm:self-auto gap-1.5 bg-white/10 hover:bg-white/16 px-3.5 rounded-lg h-9 font-semibold text-fg text-sm transition-colors shrink-0"
                    >
                        <LogIn size={14} /> Sign in
                    </Link>
                </div>
            )}
        </div>
    );
}

/* ----------------------------------------------------------------------------
 * Page
 * -------------------------------------------------------------------------- */

function SettingsContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { user, isLoading } = useSelector((state: RootState) => state.auth);
    const { avatarUrl, name } = useProfileAvatar();
    const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ account: null, sources: null });
    const baseId = useId();

    const requested = searchParams.get('tab');
    const activeTab: TabId = isTabId(requested) ? requested : 'account';

    const selectTab = (id: TabId) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', id);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
        const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
        if (!keys.includes(e.key)) return;
        e.preventDefault();
        let next = index;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (index + 1) % TABS.length;
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (index - 1 + TABS.length) % TABS.length;
        if (e.key === 'Home') next = 0;
        if (e.key === 'End') next = TABS.length - 1;
        const id = TABS[next].id;
        tabRefs.current[id]?.focus();
        selectTab(id);
    };

    const handleLogout = async () => {
        await authService.signOut();
        dispatch(logout());
        queryClient.clear();
        router.push('/login');
    };

    const tabId = (id: TabId) => `${baseId}-tab-${id}`;
    const panelId = (id: TabId) => `${baseId}-panel-${id}`;

    return (
        <Container className="pb-24">
            <PageHeader
                icon={<Settings size={22} />}
                title="Settings"
                description="Manage your profile, your region and the streaming services you use."
            />

            <div className="lg:items-start gap-6 lg:gap-10 grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]">
                {/* Navigation */}
                <aside className="lg:top-24 lg:sticky space-y-4 min-w-0">
                    {user && (
                        <div className="hidden lg:flex items-center gap-3 bg-surface-dark p-3.5 border border-line rounded-2xl">
                            <Avatar url={avatarUrl} name={name} size={40} />
                            <div className="min-w-0">
                                <p className="font-semibold text-fg text-sm truncate">{name}</p>
                                <p className="text-fg-subtle text-xs truncate">{user.email}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex lg:flex-col gap-2 -mx-4 sm:-mx-6 lg:mx-0 px-4 sm:px-6 lg:px-0 overflow-x-auto no-scrollbar">
                        <div
                            role="tablist"
                            aria-label="Settings sections"
                            className="flex lg:flex-col gap-2 lg:gap-1"
                        >
                            {TABS.map((tab, index) => {
                                const Icon = tab.icon;
                                const selected = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        ref={(el) => {
                                            tabRefs.current[tab.id] = el;
                                        }}
                                        id={tabId(tab.id)}
                                        type="button"
                                        role="tab"
                                        aria-selected={selected}
                                        aria-controls={panelId(tab.id)}
                                        tabIndex={selected ? 0 : -1}
                                        onClick={() => selectTab(tab.id)}
                                        onKeyDown={(e) => handleTabKeyDown(e, index)}
                                        className={cx(
                                            'group flex items-center gap-3 border transition-colors shrink-0',
                                            'h-10 px-4 rounded-full text-sm font-medium whitespace-nowrap',
                                            'lg:h-auto lg:px-3 lg:py-2.5 lg:rounded-xl lg:w-full lg:text-left',
                                            selected
                                                ? 'bg-primary/12 border-primary/25 text-fg'
                                                : 'bg-white/4 lg:bg-transparent border-line lg:border-transparent text-fg-muted hover:text-fg hover:bg-white/6',
                                        )}
                                    >
                                        <span
                                            className={cx(
                                                'flex justify-center items-center lg:rounded-lg lg:size-8 transition-colors shrink-0',
                                                selected
                                                    ? 'text-primary-light lg:bg-primary/15'
                                                    : 'text-fg-subtle group-hover:text-fg lg:bg-white/4',
                                            )}
                                        >
                                            <Icon size={16} />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block lg:font-semibold">{tab.label}</span>
                                            <span className="hidden lg:block mt-0.5 font-normal text-fg-subtle text-xs truncate">
                                                {tab.description}
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {user && (
                            <>
                                <div aria-hidden className="hidden lg:block bg-line my-2 w-full h-px" />
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className={cx(
                                        'flex items-center gap-3 text-danger hover:bg-danger/10 border border-danger/20 lg:border-transparent transition-colors shrink-0',
                                        'h-10 px-4 rounded-full text-sm font-medium whitespace-nowrap',
                                        'lg:h-auto lg:px-3 lg:py-2.5 lg:rounded-xl lg:w-full lg:text-left',
                                    )}
                                >
                                    <span className="flex justify-center items-center lg:rounded-lg lg:size-8 shrink-0">
                                        <LogOut size={16} />
                                    </span>
                                    Log out
                                </button>
                            </>
                        )}
                    </div>
                </aside>

                {/* Content */}
                <div
                    key={activeTab}
                    id={panelId(activeTab)}
                    role="tabpanel"
                    aria-labelledby={tabId(activeTab)}
                    tabIndex={-1}
                    className="min-w-0 animate-fade-in focus:outline-none"
                >
                    {activeTab === 'account' && (
                        <AuthGuard
                            title="Log in to manage your account"
                            description="Update your profile, avatar and email, manage your reviews, or delete your account."
                        >
                            <AccountSettings />
                        </AuthGuard>
                    )}
                    {activeTab === 'sources' && <SourcesPanel authState={isLoading ? 'loading' : user ? 'in' : 'out'} />}
                </div>
            </div>
        </Container>
    );
}

function SettingsFallback() {
    return (
        <Container className="pb-24">
            <div className="pt-8 pb-6">
                <Skeleton className="mb-3 rounded-lg w-48 h-9" />
                <Skeleton className="rounded-md w-80 max-w-full h-4" />
            </div>
            <div className="gap-6 lg:gap-10 grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]">
                <div className="flex lg:flex-col gap-2">
                    <Skeleton className="rounded-full lg:rounded-xl w-32 lg:w-full h-10 lg:h-14" />
                    <Skeleton className="rounded-full lg:rounded-xl w-40 lg:w-full h-10 lg:h-14" />
                </div>
                <Skeleton className="rounded-3xl h-96" />
            </div>
        </Container>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={<SettingsFallback />}>
            <SettingsContent />
        </Suspense>
    );
}
