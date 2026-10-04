"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, Loader2, Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { login } from '@/store/features/authSlice';
import { RootState } from '@/store/store';
import { authService } from '@/services/authService';
import { getErrorMessage } from '@/lib/appwrite';
import { AuthLayout, AuthTabs, Field, FormError, PasswordField } from '@/components/auth/AuthLayout';
import { buttonClass } from '@/components/ui/primitives';

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [authError, setAuthError] = useState('');
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
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setAuthError('');
        try {
            const user = await authService.signIn({
                email: data.email,
                password: data.password,
            });

            dispatch(login(user));
            router.push('/');
        } catch (error) {
            setAuthError(getErrorMessage(error, 'Unable to log in. Please try again.'));
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Log in to pick up your watchlist and see where everything is streaming."
            footer={
                <>
                    New to MediaFlow?{' '}
                    <Link href="/signup" className="font-semibold text-primary-light hover:text-fg transition-colors">
                        Create an account
                    </Link>
                </>
            }
        >
            <AuthTabs active="login" />

            <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Field
                    id="login-email"
                    label="Email"
                    icon={Mail}
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="name@example.com"
                    error={errors.email?.message}
                    {...register('email')}
                />

                <PasswordField
                    id="login-password"
                    label="Password"
                    icon={Lock}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    labelAside={
                        <Link
                            href="/forgot-password"
                            className="font-medium text-primary-light hover:text-fg text-sm transition-colors"
                        >
                            Forgot password?
                        </Link>
                    }
                    {...register('password')}
                />

                {authError && <FormError>{authError}</FormError>}

                <button type="submit" disabled={isSubmitting} className={buttonClass('primary', 'lg', 'group mt-1 w-full')}>
                    {isSubmitting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" aria-hidden />
                            Logging in...
                        </>
                    ) : (
                        <>
                            Log in
                            <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                        </>
                    )}
                </button>
            </form>
        </AuthLayout>
    );
}
