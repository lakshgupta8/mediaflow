"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '@/services/authService';
import { getErrorMessage } from '@/lib/appwrite';
import { AuthLayout, FormError, PasswordField } from '@/components/auth/AuthLayout';
import { buttonClass, ButtonLink } from '@/components/ui/primitives';

// Local schema for reset password validation
const resetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
    const router = useRouter();
    const [authError, setAuthError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        setAuthError('');
        setIsSuccess(false);

        try {
            // Appwrite appends these to the recovery link it emails the user.
            const params = new URLSearchParams(window.location.search);
            const userId = params.get('userId');
            const secret = params.get('secret');

            if (!userId || !secret) {
                throw new Error('This reset link is incomplete. Please open the link from your email or request a new one.');
            }

            await authService.completePasswordReset({ userId, secret, password: data.password });
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (error) {
            setAuthError(getErrorMessage(error, 'Unable to reset your password. Please request a new link.'));
        }
    };

    return (
        <AuthLayout
            title={isSuccess ? 'Password updated' : 'Set a new password'}
            subtitle={isSuccess ? undefined : 'Choose a strong password you don’t use anywhere else.'}
            footer={
                isSuccess ? undefined : (
                    <Link href="/login" className="inline-flex items-center gap-1.5 font-medium text-fg-muted hover:text-fg transition-colors">
                        <ArrowLeft size={16} aria-hidden />
                        Cancel and return to log in
                    </Link>
                )
            }
        >
            {isSuccess ? (
                <div role="status" className="flex flex-col gap-5 bg-success/8 p-6 border border-success/20 rounded-2xl animate-fade-in">
                    <div className="flex justify-center items-center bg-success/12 border border-success/25 rounded-xl size-12 text-success">
                        <CheckCircle2 size={22} aria-hidden />
                    </div>
                    <div>
                        <h2 className="font-display font-semibold text-fg text-lg">You&apos;re all set</h2>
                        <p className="mt-1.5 text-fg-muted text-sm leading-relaxed">
                            Your password has been reset. We&apos;ll take you to the login page in a moment, or you can continue now.
                        </p>
                    </div>
                    <ButtonLink href="/login" size="lg" className="group w-full">
                        Log in now
                        <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                    </ButtonLink>
                </div>
            ) : (
                <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <PasswordField
                        id="reset-password"
                        label="New password"
                        icon={Lock}
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        error={errors.password?.message}
                        {...register('password')}
                    />

                    <PasswordField
                        id="reset-confirm-password"
                        label="Confirm new password"
                        icon={Lock}
                        autoComplete="new-password"
                        placeholder="Repeat your new password"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />

                    {authError && <FormError>{authError}</FormError>}

                    <button type="submit" disabled={isSubmitting} className={buttonClass('primary', 'lg', 'group mt-1 w-full')}>
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" aria-hidden />
                                Updating...
                            </>
                        ) : (
                            <>
                                Update password
                                <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                            </>
                        )}
                    </button>
                </form>
            )}
        </AuthLayout>
    );
}
