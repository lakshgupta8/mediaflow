"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, Mail, MailCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '@/services/authService';
import { getErrorMessage } from '@/lib/appwrite';
import { AuthLayout, Field, FormError } from '@/components/auth/AuthLayout';
import { buttonClass, ButtonLink } from '@/components/ui/primitives';

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
            await authService.requestPasswordReset(data.email);
            setIsSuccess(true);
        } catch (error) {
            setAuthError(getErrorMessage(error, 'Unable to send the recovery link. Please try again.'));
        }
    };

    return (
        <AuthLayout
            title={isSuccess ? 'Check your inbox' : 'Forgot your password?'}
            subtitle={
                isSuccess
                    ? undefined
                    : 'Enter the email linked to your account and we’ll send you a link to reset it.'
            }
            footer={
                <Link href="/login" className="inline-flex items-center gap-1.5 font-medium text-fg-muted hover:text-fg transition-colors">
                    <ArrowLeft size={16} aria-hidden />
                    Back to log in
                </Link>
            }
        >
            {isSuccess ? (
                <div role="status" className="flex flex-col gap-5 bg-primary/8 p-6 border border-primary/20 rounded-2xl animate-fade-in">
                    <div className="flex justify-center items-center bg-primary/15 border border-primary/25 rounded-xl size-12 text-primary-light">
                        <MailCheck size={22} aria-hidden />
                    </div>
                    <div>
                        <h2 className="font-display font-semibold text-fg text-lg">Recovery link sent</h2>
                        <p className="mt-1.5 text-fg-muted text-sm leading-relaxed">
                            We&apos;ve sent a password recovery link to your email address. Open it and follow the steps to choose a new
                            password. It can take a minute to arrive, so check your spam folder too.
                        </p>
                    </div>
                    <ButtonLink href="/login" variant="secondary" size="lg" className="w-full">
                        <ArrowLeft size={18} aria-hidden />
                        Back to log in
                    </ButtonLink>
                </div>
            ) : (
                <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Field
                        id="forgot-email"
                        label="Email"
                        icon={Mail}
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="name@example.com"
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    {authError && <FormError>{authError}</FormError>}

                    <button type="submit" disabled={isSubmitting} className={buttonClass('primary', 'lg', 'group mt-1 w-full')}>
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" aria-hidden />
                                Sending link...
                            </>
                        ) : (
                            <>
                                Send recovery link
                                <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                            </>
                        )}
                    </button>
                </form>
            )}
        </AuthLayout>
    );
}
