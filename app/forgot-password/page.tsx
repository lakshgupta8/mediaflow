"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Film, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/utils/supabase/client';

// Local schema for forgot password validation
const forgotPasswordSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
});
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [authError, setAuthError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setAuthError('');
        setIsSuccess(false);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;
            setIsSuccess(true);
        } catch (error) {
            if (error instanceof Error) {
                setAuthError(error.message);
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

                        <h2 className="mb-6 font-black text-white text-4xl lg:text-5xl xl:text-6xl leading-[1.1] tracking-tight">
                            Reset your <br />
                            <span className="bg-clip-text bg-linear-to-r from-primary to-green-300 text-transparent">password.</span>
                        </h2>
                        <p className="max-w-lg font-light text-slate-300 text-lg xl:text-xl leading-relaxed">
                            Don&apos;t worry, happens to the best of us. Enter your email and we&apos;ll send you a recovery link.
                        </p>
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
                            <h1 className="mb-3 font-black text-slate-900 dark:text-white text-3xl lg:text-4xl">Reset Password</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">Enter the email linked to your account.</p>
                        </div>

                        {/* Success Message UI */}
                        {isSuccess ? (
                            <div className="flex flex-col gap-6 bg-primary/10 p-6 border border-primary/20 rounded-2xl">
                                <h3 className="font-bold text-primary text-xl">Check your email</h3>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    We&apos;ve sent a password recovery link to your email address. Please check your inbox and click the link to reset your password.
                                </p>
                                <Link href="/login" className="group flex justify-center items-center gap-2 bg-primary/20 hover:bg-primary/30 mt-2 py-4 rounded-xl font-bold text-primary transition-colors">
                                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                                    Back to Log In
                                </Link>
                            </div>
                        ) : (
                            <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
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
                                            className={`bg-white dark:bg-surface-dark pr-4 pl-12 border-2 ${errors.email ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-primary dark:border-white/5 focus:ring-primary/10'} rounded-2xl focus:outline-none focus:ring-4 w-full h-14 text-slate-900 dark:placeholder:text-slate-600 dark:text-white placeholder:text-slate-400 text-base transition-all duration-300`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <span className="ml-1 font-medium text-red-500 text-sm">{errors.email.message}</span>
                                    )}
                                </div>

                                {/* Submit Button */}
                                {authError && (
                                    <div className="bg-red-500/10 p-3 border border-red-500/20 rounded-xl text-red-500 text-sm italic">
                                        {authError}
                                    </div>
                                )}

                                <button disabled={isSubmitting} type="submit" className="group flex justify-center items-center gap-3 bg-primary hover:bg-primary/90 disabled:opacity-70 hover:shadow-primary/20 hover:shadow-xl mt-4 rounded-2xl w-full h-14 font-black text-background-dark text-lg transition-all hover:-translate-y-1 duration-300 transform">
                                    <span>{isSubmitting ? 'Sending Link...' : 'Send Recovery Link'}</span>
                                    {!isSubmitting && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
                                </button>
                            </form>
                        )}


                        {/* Divider */}
                        <div className="relative flex items-center py-4 w-full">
                            <div className="flex-1 border-slate-200 dark:border-white/10 border-t"></div>
                            <span className="mx-6 font-bold text-slate-500 text-xs uppercase tracking-widest shrink-0">Remembered it?</span>
                            <div className="flex-1 border-slate-200 dark:border-white/10 border-t"></div>
                        </div>

                        {/* Back to Login */}
                        <Link href="/login" className="flex justify-center items-center gap-2 bg-transparent hover:bg-white/5 p-4 border-2 border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/20 rounded-2xl w-full font-bold text-slate-900 dark:text-white transition-all">
                            Back to Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
