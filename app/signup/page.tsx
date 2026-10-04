"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, ArrowRight, Loader2, Lock, Mail, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { signupSchema, type SignupFormData } from '@/lib/validations/auth';
import { login } from '@/store/features/authSlice';
import { RootState } from '@/store/store';
import { authService } from '@/services/authService';
import { getErrorMessage, isAppwriteError } from '@/lib/appwrite';
import { AuthLayout, AuthTabs, Field, FormError, PasswordField } from '@/components/auth/AuthLayout';
import { buttonClass } from '@/components/ui/primitives';

export default function SignupPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [authError, setAuthError] = useState('');
    const [emailExists, setEmailExists] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

    // Already logged in: send straight to the app.
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace('/');
        }
    }, [isAuthenticated, isLoading, router]);

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
            const user = await authService.signUp({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            dispatch(login(user));
            router.push('/');
        } catch (error) {
            if (isAppwriteError(error, 409)) {
                setEmailExists(true);
            } else {
                setAuthError(getErrorMessage(error, 'Unable to create your account. Please try again.'));
            }
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="One watchlist for every service. Free, and it takes a minute."
            footer={
                <>
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-primary-light hover:text-fg transition-colors">
                        Log in
                    </Link>
                </>
            }
        >
            <AuthTabs active="signup" />

            {/* Email already registered */}
            {emailExists && (
                <div role="status" className="flex gap-3 bg-warning/10 mb-6 p-4 border border-warning/30 rounded-xl animate-fade-in">
                    <AlertCircle size={18} className="mt-0.5 text-warning shrink-0" aria-hidden />
                    <div className="flex flex-col gap-3 min-w-0">
                        <div>
                            <p className="font-semibold text-warning text-sm">An account with this email already exists.</p>
                            <p className="mt-1 text-fg-muted text-sm leading-relaxed">
                                Log in with your existing account or use a different email address.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 bg-primary/12 hover:bg-primary/20 px-3 py-1.5 rounded-lg font-semibold text-primary-light text-sm transition-colors"
                            >
                                Log in instead <ArrowRight size={14} aria-hidden />
                            </Link>
                            <Link href="/forgot-password" className="font-medium text-fg-muted hover:text-fg text-sm transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Field
                    id="signup-name"
                    label="Full name"
                    icon={User}
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    error={errors.name?.message}
                    {...register('name')}
                />

                <Field
                    id="signup-email"
                    label="Email"
                    icon={Mail}
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="name@example.com"
                    error={errors.email?.message}
                    warning={emailExists ? 'This email is already registered.' : undefined}
                    trailing={
                        isCheckingEmail ? (
                            <span className="flex justify-center items-center size-9" role="status">
                                <Loader2 size={16} className="text-fg-subtle animate-spin" aria-hidden />
                                <span className="sr-only">Checking email</span>
                            </span>
                        ) : undefined
                    }
                    {...register('email')}
                    onBlur={(e) => {
                        setEmailExists(false);
                        checkEmailExists(e.target.value);
                    }}
                />

                <PasswordField
                    id="signup-password"
                    label="Password"
                    icon={Lock}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    disabled={emailExists}
                    error={errors.password?.message}
                    className="transition-opacity duration-300"
                    {...register('password')}
                />

                <PasswordField
                    id="signup-confirm-password"
                    label="Confirm password"
                    icon={Lock}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    disabled={emailExists}
                    error={errors.confirmPassword?.message}
                    className="transition-opacity duration-300"
                    {...register('confirmPassword')}
                />

                {authError && <FormError>{authError}</FormError>}

                <button
                    type="submit"
                    disabled={isSubmitting || emailExists}
                    className={buttonClass('primary', 'lg', 'group mt-1 w-full')}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" aria-hidden />
                            Creating account...
                        </>
                    ) : emailExists ? (
                        'Email already taken'
                    ) : (
                        <>
                            Create account
                            <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                        </>
                    )}
                </button>
            </form>
        </AuthLayout>
    );
}
