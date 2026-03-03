"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Film, User, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '@/lib/validations/auth';
import { useDispatch } from 'react-redux';
import { login } from '@/store/features/authSlice';
import { createClient } from '@/utils/supabase/client';
import { useState, useCallback } from 'react';

export default function SignupPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [authError, setAuthError] = useState('');
    const [emailExists, setEmailExists] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    // Check email on blur
    const checkEmailExists = useCallback(async (email: string) => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailExists(false);
            return;
        }

        setIsCheckingEmail(true);
        try {
            const res = await fetch('/api/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim().toLowerCase() }),
            });
            const data = await res.json();
            setEmailExists(data.exists);
        } catch {
            setEmailExists(false);
        } finally {
            setIsCheckingEmail(false);
        }
    }, []);

    const onSubmit = async (data: SignupFormData) => {
        if (emailExists) return;
        setAuthError('');
        try {
            const supabase = createClient();
            const { data: authData, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        name: data.name,
                    }
                }
            });

            if (error) throw error;

            if (authData.user) {
                if (authData.user.identities && authData.user.identities.length === 0) {
                    setEmailExists(true);
                    return;
                }

                router.refresh();
                dispatch(login({
                    id: authData.user.id,
                    name: authData.user.user_metadata?.name || data.name,
                    email: authData.user.email!,
                }));
                router.push('/');
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('User already registered')) {
                    setEmailExists(true);
                } else {
                    setAuthError(error.message);
                }
            } else {
                setAuthError(String(error));
            }
        }
    };

    return (
        <div className="flex flex-col bg-background-light dark:bg-background-dark w-full min-h-screen font-display antialiased">
            <div className="flex md:flex-row flex-col flex-1 w-full min-h-screen">

                {/* Left Side: Cinematic Background */}
                <div className="group hidden top-0 sticky md:flex bg-black md:w-1/2 h-screen overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                        style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC9p7d98SzWpW2DOfhWGwmykFazulhByEEfhLKPhijjuymlYFar1N-KXY44-QGigoYXEuKEKaWCFEP8q4Hjy_SpAERlqskO7aockVb8O0adcEiV8FqfftcuF1hkjY7yKmCPGcF4GQASj1_FE7AK5oXkBMkhGJ2PMosxs3Z0Bvz89SaOVhS9EGU3bioy7QvRacgJPtedmUJMyANr3P1CXS55jwYvFbENYqRIfGtoyzTmVUhXJraz3__DccyQTI2m6vQopbRaXbGP8g')` }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background-dark via-background-dark/60 to-transparent"></div>

                    <div className="z-10 relative flex flex-col justify-end p-12 lg:p-16 h-full">
                        <Link href="/" className="group flex items-center gap-3 mb-8 w-fit">
                            <span className="flex justify-center items-center bg-primary shadow-lg shadow-primary/20 rounded-full w-12 h-12 text-background-dark group-hover:scale-110 transition-transform">
                                <Film size={24} />
                            </span>
                            <span className="font-black text-white text-3xl tracking-tight">MediaFlow</span>
                        </Link>

                        <h2 className="mb-6 font-black text-white text-4xl lg:text-5xl leading-[1.1] tracking-tight">
                            Join the Cinema, <br />
                            <span className="text-white">Discover thousands</span> <br />
                            <span className="text-white">of movies.</span>
                        </h2>
                    </div>
                </div>

                {/* Right Side: Form Container */}
                <div className="flex flex-col justify-center items-center bg-background-light dark:bg-background-dark p-6 w-full md:w-1/2 min-h-screen">
                    <div className="flex flex-col gap-8 lg:p-8 pt-12 pb-12 w-full max-w-md">

                        {/* Mobile Header Logo */}
                        <div className="md:hidden flex justify-center items-center gap-2 mb-4">
                            <Film className="text-primary" size={32} />
                            <span className="font-bold text-white text-2xl">MediaFlow</span>
                        </div>

                        {/* Form Header */}
                        <div className="md:text-left text-center">
                            <h1 className="mb-3 font-black text-slate-900 dark:text-white text-3xl lg:text-4xl">Create account</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">Enter your details to register.</p>
                        </div>

                        {/* Toggle Tabs */}
                        <div className="relative flex bg-slate-200 dark:bg-surface-dark shadow-inner p-1.5 rounded-2xl">
                            <Link href="/login" className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 dark:text-slate-400 text-sm text-center transition-all duration-300">
                                Log In
                            </Link>
                            <button className="flex-1 bg-white dark:bg-white/10 shadow-sm px-4 py-3 rounded-xl ring-1 ring-black/5 dark:ring-white/10 font-bold text-slate-900 dark:text-primary text-sm transition-all duration-300">
                                Sign Up
                            </button>
                        </div>

                        {/* Email Exists Warning Banner */}
                        {emailExists && (
                            <div className="flex flex-col gap-3 bg-amber-500/10 slide-in-from-top-2 p-5 border border-amber-500/30 rounded-2xl animate-in duration-300 fade-in">
                                <div className="flex items-center gap-2">
                                    <AlertCircle size={18} className="text-amber-500 shrink-0" />
                                    <span className="font-bold text-amber-500 text-sm">An account with this email already exists.</span>
                                </div>
                                <p className="ml-[26px] text-slate-400 text-sm">
                                    Please log in with your existing account or use a different email address.
                                </p>
                                <div className="flex items-center gap-4 ml-[26px]">
                                    <Link href="/login" className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg font-bold text-primary text-sm transition-colors">
                                        Log In Instead <ArrowRight size={14} />
                                    </Link>
                                    <Link href="/forgot-password" className="font-medium text-slate-400 hover:text-slate-300 text-sm hover:underline transition-colors">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Signup Form */}
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>

                            {/* Name Input */}
                            <div className="flex flex-col gap-2.5">
                                <label className="ml-1 font-bold text-slate-700 dark:text-slate-300 text-sm">Full Name</label>
                                <div className="group relative">
                                    <div className="top-1/2 left-4 absolute text-slate-400 group-focus-within:text-primary transition-colors -translate-y-1/2">
                                        <User size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        {...register('name')}
                                        className={`bg-white dark:bg-surface-dark pr-4 pl-12 border-2 ${errors.name ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-primary dark:border-white/5 focus:ring-primary/10'} rounded-2xl focus:outline-none focus:ring-4 w-full h-14 text-slate-900 dark:placeholder:text-slate-600 dark:text-white placeholder:text-slate-400 text-base transition-all duration-300`}
                                    />
                                </div>
                                {errors.name && (
                                    <span className="ml-1 font-medium text-red-500 text-sm">{errors.name.message}</span>
                                )}
                            </div>

                            {/* Email Input */}
                            <div className="flex flex-col gap-2.5">
                                <label className="ml-1 font-bold text-slate-700 dark:text-slate-300 text-sm">Email Address</label>
                                <div className="group relative">
                                    <div className="top-1/2 left-4 absolute text-slate-400 group-focus-within:text-primary transition-colors -translate-y-1/2">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        {...register('email')}
                                        onBlur={(e) => {
                                            setEmailExists(false);
                                            checkEmailExists(e.target.value);
                                        }}
                                        className={`bg-white dark:bg-surface-dark pr-12 pl-12 border-2 ${emailExists ? 'border-amber-500 focus:ring-amber-500/10' : errors.email ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-primary dark:border-white/5 focus:ring-primary/10'} rounded-2xl focus:outline-none focus:ring-4 w-full h-14 text-slate-900 dark:placeholder:text-slate-600 dark:text-white placeholder:text-slate-400 text-base transition-all duration-300`}
                                    />
                                    {isCheckingEmail && (
                                        <div className="top-1/2 right-4 absolute -translate-y-1/2">
                                            <Loader2 size={18} className="text-slate-400 animate-spin" />
                                        </div>
                                    )}
                                </div>
                                {errors.email && !emailExists && (
                                    <span className="ml-1 font-medium text-red-500 text-sm">{errors.email.message}</span>
                                )}
                                {emailExists && (
                                    <span className="ml-1 font-medium text-amber-500 text-sm">This email is already registered.</span>
                                )}
                            </div>

                            {/* Password Input */}
                            <div className={`flex flex-col gap-2.5 transition-opacity duration-300 ${emailExists ? 'opacity-50 pointer-events-none' : ''}`}>
                                <label className="ml-1 font-bold text-slate-700 dark:text-slate-300 text-sm">Password</label>
                                <div className="group relative">
                                    <div className="top-1/2 left-4 absolute text-slate-400 group-focus-within:text-primary transition-colors -translate-y-1/2">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        disabled={emailExists}
                                        {...register('password')}
                                        className={`bg-white dark:bg-surface-dark pr-12 pl-12 border-2 ${errors.password ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-primary dark:border-white/5 focus:ring-primary/10'} rounded-2xl focus:outline-none focus:ring-4 w-full h-14 text-slate-900 dark:placeholder:text-slate-600 dark:text-white placeholder:text-slate-400 text-base tracking-widest transition-all duration-300`}
                                    />
                                </div>
                                {errors.password && (
                                    <span className="ml-1 font-medium text-red-500 text-sm">{errors.password.message}</span>
                                )}
                            </div>

                            {/* Confirm Password Input */}
                            <div className={`flex flex-col gap-2.5 transition-opacity duration-300 ${emailExists ? 'opacity-50 pointer-events-none' : ''}`}>
                                <label className="ml-1 font-bold text-slate-700 dark:text-slate-300 text-sm">Confirm Password</label>
                                <div className="group relative">
                                    <div className="top-1/2 left-4 absolute text-slate-400 group-focus-within:text-primary transition-colors -translate-y-1/2">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        disabled={emailExists}
                                        {...register('confirmPassword')}
                                        className={`bg-white dark:bg-surface-dark pr-12 pl-12 border-2 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-primary dark:border-white/5 focus:ring-primary/10'} rounded-2xl focus:outline-none focus:ring-4 w-full h-14 text-slate-900 dark:placeholder:text-slate-600 dark:text-white placeholder:text-slate-400 text-base tracking-widest transition-all duration-300`}
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <span className="ml-1 font-medium text-red-500 text-sm">{errors.confirmPassword.message}</span>
                                )}
                            </div>

                            {/* General Auth Error */}
                            {authError && (
                                <div className="bg-red-500/10 p-4 border border-red-500/20 rounded-xl">
                                    <span className="font-bold text-red-500 text-sm">{authError}</span>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                disabled={isSubmitting || emailExists}
                                type="submit"
                                className="group flex justify-center items-center gap-3 bg-primary hover:bg-primary/90 disabled:opacity-50 hover:shadow-primary/20 hover:shadow-xl mt-2 rounded-2xl w-full h-14 font-black text-background-dark text-lg transition-all hover:-translate-y-1 disabled:hover:translate-y-0 duration-300 disabled:cursor-not-allowed transform"
                            >
                                <span>{isSubmitting ? 'Creating Account...' : emailExists ? 'Email Already Taken' : 'Create Account'}</span>
                                {!isSubmitting && !emailExists && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative flex items-center py-4 w-full">
                            <div className="flex-1 border-slate-200 dark:border-white/10 border-t"></div>
                            <span className="mx-6 font-bold text-slate-500 text-xs uppercase tracking-widest shrink-0">Or continue with</span>
                            <div className="flex-1 border-slate-200 dark:border-white/10 border-t"></div>
                        </div>

                        {/* Social Login */}
                        <div className="w-full">
                            <button
                                onClick={async () => {
                                    const supabase = createClient();
                                    await supabase.auth.signInWithOAuth({
                                        provider: 'google',
                                        options: {
                                            redirectTo: `${window.location.origin}/auth/callback`,
                                        },
                                    });
                                }}
                                className="group flex justify-center items-center gap-3 bg-white hover:bg-slate-50 dark:hover:bg-white/5 dark:bg-surface-dark hover:shadow-lg border-2 border-slate-200 dark:border-white/5 rounded-2xl w-full h-14 transition-all hover:-translate-y-1 duration-300"
                            >
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                </svg>
                                <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">Sign up with Google</span>
                            </button>
                        </div>

                        {/* Footer Terms */}
                        <div className="mt-4 w-full">
                            <p className="font-medium text-slate-500 text-sm text-center leading-relaxed">
                                I agree to the{" "}
                                <a href="#" className="hover:text-primary decoration-slate-600 hover:decoration-primary underline underline-offset-4 transition-all">Terms of Service</a>
                                {" "}and{" "}
                                <a href="#" className="hover:text-primary decoration-slate-600 hover:decoration-primary underline underline-offset-4 transition-all">Privacy Policy</a>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
