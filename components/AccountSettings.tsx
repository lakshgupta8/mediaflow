"use client";

import React, { useEffect, useId, useRef } from 'react';
import { Camera, Trash2, AlertTriangle, MessageSquare, ExternalLink, Check, AlertCircle, ImagePlus, Film, Tv, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/hooks/useUserData';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmationModal } from './ConfirmationModal';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { login, logout } from '@/store/features/authSlice';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { RootState } from '@/store/store';
import { authService } from '@/services/authService';
import { getErrorMessage } from '@/lib/appwrite';
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImage';
import { Avatar } from '@/components/layout/UserMenu';
import { Badge, Button, Skeleton, buttonClass, cx } from '@/components/ui/primitives';

const accountSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    currentPassword: z.string().optional(),
});
type AccountFormData = z.infer<typeof accountSchema>;

const DELETE_PHRASE = 'delete my account';

/* ----------------------------------------------------------------------------
 * Local building blocks
 * -------------------------------------------------------------------------- */

const inputBase =
    'bg-surface-raised px-4 border rounded-xl outline-none w-full h-12 text-fg placeholder:text-fg-subtle text-sm transition-[border-color,box-shadow] focus:ring-4';
const inputOk = 'border-line hover:border-line-strong focus:border-primary/60 focus:ring-primary/10';
const inputErr = 'border-danger/60 focus:border-danger/70 focus:ring-danger/10';

const solidDanger =
    'inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-sm font-semibold whitespace-nowrap bg-danger text-primary-ink hover:bg-danger/85 transition-[background-color,transform] duration-200 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none';

function SettingsCard({
    title,
    description,
    action,
    tone = 'default',
    children,
    id,
}: {
    title: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
    tone?: 'default' | 'danger';
    children: React.ReactNode;
    id?: string;
}) {
    const headingId = useId();
    return (
        <section
            id={id}
            aria-labelledby={headingId}
            className={cx(
                'p-6 sm:p-8 border rounded-3xl',
                tone === 'danger' ? 'bg-danger/3 border-danger/20' : 'bg-surface-dark border-line',
            )}
        >
            <div className="flex justify-between items-start gap-4 mb-6">
                <div className="min-w-0">
                    <h2
                        id={headingId}
                        className={cx('font-display font-semibold text-lg sm:text-xl', tone === 'danger' ? 'text-danger' : 'text-fg')}
                    >
                        {title}
                    </h2>
                    {description && <p className="mt-1 text-fg-muted text-sm leading-relaxed">{description}</p>}
                </div>
                {action && <div className="shrink-0">{action}</div>}
            </div>
            {children}
        </section>
    );
}

function Field({
    label,
    htmlFor,
    error,
    hint,
    className,
    children,
}: {
    label: string;
    htmlFor: string;
    error?: string;
    hint?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={cx('space-y-2', className)}>
            <label htmlFor={htmlFor} className="block font-medium text-fg text-sm">
                {label}
            </label>
            {children}
            {error ? (
                <p id={`${htmlFor}-error`} role="alert" className="flex items-center gap-1.5 text-danger text-xs">
                    <AlertCircle size={13} /> {error}
                </p>
            ) : hint ? (
                <p id={`${htmlFor}-hint`} className="text-fg-subtle text-xs">{hint}</p>
            ) : null}
        </div>
    );
}

function Modal({
    open,
    onClose,
    labelledBy,
    tone = 'default',
    children,
}: {
    open: boolean;
    onClose: () => void;
    labelledBy: string;
    tone?: 'default' | 'danger';
    children: React.ReactNode;
}) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <div className="z-100 fixed inset-0 flex justify-center items-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        aria-hidden
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={labelledBy}
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 12 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className={cx(
                            'relative bg-surface-dark shadow-2xl shadow-black/60 p-6 sm:p-7 border rounded-3xl w-full max-w-md',
                            tone === 'danger' ? 'border-danger/25' : 'border-line-strong',
                        )}
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close dialog"
                            className="top-4 right-4 absolute flex justify-center items-center hover:bg-white/6 rounded-lg size-9 text-fg-subtle hover:text-fg transition-colors"
                        >
                            <X size={18} />
                        </button>
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function AccountSettingsSkeleton() {
    return (
        <div className="space-y-6" role="status" aria-label="Loading profile">
            <div className="bg-surface-dark p-6 sm:p-8 border border-line rounded-3xl">
                <Skeleton className="mb-2 rounded-lg w-40 h-6" />
                <Skeleton className="mb-8 rounded-md w-64 h-4" />
                <div className="flex items-center gap-5 mb-8">
                    <Skeleton className="rounded-full size-20" />
                    <div className="space-y-2">
                        <Skeleton className="w-36 h-9" />
                        <Skeleton className="rounded-md w-48 h-3" />
                    </div>
                </div>
                <div className="gap-5 grid sm:grid-cols-2">
                    <Skeleton className="h-12" />
                    <Skeleton className="h-12" />
                </div>
            </div>
            <div className="bg-surface-dark p-6 sm:p-8 border border-line rounded-3xl">
                <Skeleton className="mb-6 rounded-lg w-32 h-6" />
                <Skeleton className="mb-3 h-20" />
                <Skeleton className="h-20" />
            </div>
        </div>
    );
}

/* ----------------------------------------------------------------------------
 * Account settings
 * -------------------------------------------------------------------------- */

export default function AccountSettings() {
    const { userProfile, updateProfile, isUpdatingProfile, isLoadingProfile, uploadAvatar, isUploadingAvatar, userReviews, isLoadingUserReviews, deleteReview } = useUserData();
    const [submitSuccess, setSubmitSuccess] = React.useState(false);
    const [submitError, setSubmitError] = React.useState('');
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const authUser = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = React.useState('');
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [deleteError, setDeleteError] = React.useState('');
    const [isDeleteReviewModalOpen, setIsDeleteReviewModalOpen] = React.useState(false);
    const [reviewIdToDelete, setReviewIdToDelete] = React.useState<string | null>(null);

    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
    const [crop, setCrop] = React.useState({ x: 0, y: 0 });
    const [zoom, setZoom] = React.useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(null);
    const [isCropping, setIsCropping] = React.useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const ids = {
        fullName: useId(),
        email: useId(),
        password: useId(),
        cropTitle: useId(),
        deleteTitle: useId(),
        deleteInput: useId(),
        zoom: useId(),
    };

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isDirty },
    } = useForm<AccountFormData>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            fullName: authUser?.name || '',
            email: authUser?.email || '',
            currentPassword: '',
        }
    });

    // Appwrite needs the current password to change the login email.
    const watchedEmail = useWatch({ control, name: 'email' });
    const isEmailChanged = (watchedEmail || '').trim().toLowerCase() !== (authUser?.email || '').toLowerCase();

    // Reset form when profile data loads
    useEffect(() => {
        if (userProfile && authUser) {
            reset({
                fullName: userProfile.full_name || authUser.name || '',
                email: authUser.email || '',
                currentPassword: '',
            });
        }
    }, [userProfile, authUser, reset]);

    const flashSuccess = () => {
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImage(reader.result as string);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setIsCropping(true);
        };
        reader.readAsDataURL(file);

        // reset input
        event.target.value = '';
    };

    const handleCropComplete = React.useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const closeCropper = React.useCallback(() => setIsCropping(false), []);

    const uploadCroppedImage = async () => {
        if (!selectedImage || !croppedAreaPixels) return;

        try {
            setIsCropping(false);
            setSubmitError('');
            const croppedFile = await getCroppedImg(selectedImage, croppedAreaPixels);
            if (!croppedFile) return;

            await uploadAvatar(croppedFile);
            flashSuccess();
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to save cropped image');
        }
    };

    const handleAvatarRemove = async () => {
        setSubmitError('');
        try {
            await updateProfile({ avatar_url: null });
            flashSuccess();
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to remove avatar');
        }
    };

    const onSubmit = async (data: AccountFormData) => {
        setSubmitError('');
        setSubmitSuccess(false);
        const emailChanged = data.email !== authUser?.email;
        if (emailChanged && !data.currentPassword) {
            setSubmitError('Enter your current password to change your email address.');
            return;
        }

        try {
            await updateProfile({
                full_name: data.fullName,
                email: emailChanged ? data.email : undefined,
                currentPassword: emailChanged ? data.currentPassword : undefined,
            });

            // Update Redux state if email or name changes
            if (authUser) {
                dispatch(login({
                    id: authUser.id,
                    name: data.fullName,
                    email: data.email,
                }));
            }

            flashSuccess();
        } catch (error) {
            setSubmitError(getErrorMessage(error, 'Failed to update profile'));
        }
    };

    const closeDeleteConfirm = React.useCallback(() => {
        if (isDeleting) return;
        setShowDeleteConfirm(false);
        setDeleteConfirmText('');
        setDeleteError('');
    }, [isDeleting]);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setDeleteError('');
        try {
            // Short-lived JWT proves to our API route who is asking.
            const jwt = await authService.createJWT();

            const res = await fetch('/api/delete-account', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                },
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete account');
            }
            // Clear the local session and redirect
            await authService.signOut();
            dispatch(logout());
            queryClient.clear();
            router.push('/login');
        } catch (err) {
            setDeleteError(getErrorMessage(err, 'Something went wrong'));
            setIsDeleting(false);
        }
    };

    if (isLoadingProfile) {
        return <AccountSettingsSkeleton />;
    }

    const displayName = userProfile?.full_name || authUser?.name || '';
    const avatarUrl = userProfile?.avatar_url ?? null;
    const reviewCount = userReviews?.length ?? 0;

    return (
        <div className="space-y-6">
            {/* Profile */}
            <SettingsCard title="Profile" description="How you appear to others in reviews and replies.">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Avatar */}
                    <div className="flex sm:flex-row flex-col sm:items-center gap-5 bg-white/2 mb-8 p-4 sm:p-5 border border-line rounded-2xl">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingAvatar}
                            aria-label="Upload a new profile picture"
                            className="group relative self-start sm:self-auto rounded-full ring-2 ring-line hover:ring-primary/50 focus-visible:ring-primary/60 ring-offset-4 ring-offset-surface-dark transition shrink-0"
                        >
                            <Avatar url={avatarUrl} name={displayName} size={80} />
                            <span
                                aria-hidden
                                className={cx(
                                    'absolute inset-0 flex justify-center items-center bg-black/55 rounded-full text-fg transition-opacity',
                                    isUploadingAvatar ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100',
                                )}
                            >
                                {isUploadingAvatar ? (
                                    <span className="border-2 border-fg/30 border-t-fg rounded-full size-6 animate-spin" />
                                ) : (
                                    <Camera size={22} />
                                )}
                            </span>
                        </button>

                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-fg text-sm">Profile picture</p>
                            <p className="mt-0.5 text-fg-subtle text-xs">Square images work best. Recommended 256&times;256px, max 2MB.</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingAvatar}
                                >
                                    <ImagePlus size={15} /> {isUploadingAvatar ? 'Uploading...' : 'Change picture'}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleAvatarRemove}
                                    disabled={isUploadingAvatar || !userProfile?.avatar_url}
                                >
                                    Remove
                                </Button>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                tabIndex={-1}
                                aria-hidden
                                onChange={handleFileSelect}
                                disabled={isUploadingAvatar}
                            />
                        </div>
                    </div>

                    {/* Fields */}
                    <div className="gap-5 grid grid-cols-1 sm:grid-cols-2">
                        <Field label="Full name" htmlFor={ids.fullName} error={errors.fullName?.message} className="sm:col-span-2">
                            <input
                                id={ids.fullName}
                                type="text"
                                autoComplete="name"
                                aria-invalid={!!errors.fullName}
                                aria-describedby={errors.fullName ? `${ids.fullName}-error` : undefined}
                                {...register('fullName')}
                                className={cx(inputBase, errors.fullName ? inputErr : inputOk)}
                            />
                        </Field>

                        <Field
                            label="Email address"
                            htmlFor={ids.email}
                            error={errors.email?.message}
                            hint="Used to log in and recover your account."
                            className={isEmailChanged ? undefined : 'sm:col-span-2'}
                        >
                            <input
                                id={ids.email}
                                type="email"
                                autoComplete="email"
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? `${ids.email}-error` : `${ids.email}-hint`}
                                {...register('email')}
                                className={cx(inputBase, errors.email ? inputErr : inputOk)}
                            />
                        </Field>

                        <AnimatePresence initial={false}>
                            {isEmailChanged && (
                                <motion.div
                                    key="current-password"
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Field
                                        label="Current password"
                                        htmlFor={ids.password}
                                        hint="Confirm your password to update the email you log in with."
                                    >
                                        <input
                                            id={ids.password}
                                            type="password"
                                            placeholder="Required to change your email"
                                            autoComplete="current-password"
                                            aria-describedby={`${ids.password}-hint`}
                                            {...register('currentPassword')}
                                            className={cx(inputBase, inputOk)}
                                        />
                                    </Field>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="flex sm:flex-row flex-col-reverse sm:justify-between sm:items-center gap-4 mt-8 pt-6 border-line border-t">
                        <div className="min-h-5 text-sm" role="status" aria-live="polite">
                            {submitSuccess && (
                                <span className="inline-flex items-center gap-1.5 font-medium text-success animate-fade-in">
                                    <Check size={15} /> Profile updated successfully
                                </span>
                            )}
                            {submitError && (
                                <span className="inline-flex items-start gap-1.5 font-medium text-danger animate-fade-in">
                                    <AlertCircle size={15} className="mt-0.5 shrink-0" /> {submitError}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2 sm:ml-auto">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    reset();
                                    setSubmitError('');
                                }}
                                disabled={!isDirty || isUpdatingProfile}
                            >
                                Discard
                            </Button>
                            <Button type="submit" disabled={!isDirty || isUpdatingProfile} className="flex-1 sm:flex-none">
                                {isUpdatingProfile ? 'Saving...' : 'Save changes'}
                            </Button>
                        </div>
                    </div>
                </form>
            </SettingsCard>

            {/* My Reviews */}
            <SettingsCard
                title={
                    <span className="flex items-center gap-2.5">
                        My reviews
                        {reviewCount > 0 && (
                            <span className="bg-white/8 px-2 py-0.5 border border-line rounded-full font-sans font-semibold text-fg-muted text-xs tabular-nums">
                                {reviewCount}
                            </span>
                        )}
                    </span>
                }
                description="Everything you've posted across movies and series."
            >
                {isLoadingUserReviews ? (
                    <div className="space-y-3">
                        <Skeleton className="h-20" />
                        <Skeleton className="h-20" />
                    </div>
                ) : reviewCount > 0 ? (
                    <ul className="space-y-3">
                        {userReviews.map((review) => {
                            const href = `/${review.media_type === 'tv' ? 'series' : 'movie'}/${review.media_id}`;
                            return (
                                <li
                                    key={review.id}
                                    className="group flex items-start gap-4 bg-white/2 hover:bg-white/4 p-4 sm:p-5 border border-line hover:border-line-strong rounded-2xl transition-colors"
                                >
                                    <div className="hidden sm:flex justify-center items-center bg-surface-raised border border-line rounded-xl size-10 text-fg-muted shrink-0">
                                        {review.media_type === 'movie' ? <Film size={17} /> : <Tv size={17} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge>{review.media_type === 'movie' ? 'Movie' : 'Series'}</Badge>
                                            {review.parent_id && <Badge tone="accent">Reply</Badge>}
                                            <time dateTime={review.created_at} className="text-fg-subtle text-xs">
                                                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                            </time>
                                        </div>
                                        <p className="mt-2 text-fg/90 text-sm leading-relaxed line-clamp-3 wrap-break-word whitespace-pre-line">
                                            {review.content}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity shrink-0">
                                        <Link
                                            href={href}
                                            aria-label="View title"
                                            title="View title"
                                            className={buttonClass('ghost', 'icon-sm', 'hover:text-primary-light')}
                                        >
                                            <ExternalLink size={16} />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setReviewIdToDelete(review.id);
                                                setIsDeleteReviewModalOpen(true);
                                            }}
                                            aria-label="Delete review"
                                            title="Delete review"
                                            className={buttonClass('ghost', 'icon-sm', 'hover:text-danger hover:bg-danger/10')}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center bg-white/2 px-6 py-12 border border-line border-dashed rounded-2xl text-center">
                        <div className="flex justify-center items-center bg-white/5 mb-4 border border-line rounded-2xl size-12 text-fg-muted">
                            <MessageSquare size={20} />
                        </div>
                        <p className="font-medium text-fg text-sm">No reviews yet</p>
                        <p className="mt-1 text-fg-muted text-sm">You haven&apos;t posted any reviews. Share your take on a title page.</p>
                    </div>
                )}
            </SettingsCard>

            {/* Danger Zone */}
            <SettingsCard tone="danger" title="Danger zone" description="Irreversible actions for your account.">
                <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 bg-danger/5 p-4 sm:p-5 border border-danger/15 rounded-2xl">
                    <div className="min-w-0">
                        <p className="font-semibold text-fg text-sm">Delete account</p>
                        <p className="mt-0.5 text-fg-muted text-sm">
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                    </div>
                    <Button variant="danger" onClick={() => setShowDeleteConfirm(true)} className="self-start sm:self-auto shrink-0">
                        <Trash2 size={16} /> Delete account
                    </Button>
                </div>
            </SettingsCard>

            {/* Delete Account Modal */}
            <Modal open={showDeleteConfirm} onClose={closeDeleteConfirm} labelledBy={ids.deleteTitle} tone="danger">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (deleteConfirmText === DELETE_PHRASE && !isDeleting) void handleDeleteAccount();
                    }}
                    className="flex flex-col gap-5"
                >
                    <div className="flex items-start gap-4 pr-8">
                        <div className="flex justify-center items-center bg-danger/10 border border-danger/20 rounded-2xl size-12 text-danger shrink-0">
                            <AlertTriangle size={22} />
                        </div>
                        <div>
                            <h3 id={ids.deleteTitle} className="font-display font-semibold text-fg text-xl">Delete your account?</h3>
                            <p className="mt-1 text-fg-muted text-sm">This will permanently delete all your data.</p>
                        </div>
                    </div>

                    <div className="bg-danger/5 p-4 border border-danger/15 rounded-2xl">
                        <p className="text-fg-muted text-sm leading-relaxed">
                            All your watchlists, favorites, recently watched items, settings, and profile data will be{' '}
                            <strong className="font-semibold text-danger">permanently erased</strong>. Your email will be freed up for a new account.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor={ids.deleteInput} className="block font-medium text-fg text-sm">
                            Type <span className="bg-danger/10 px-1.5 py-0.5 rounded-md font-mono text-danger text-xs">{DELETE_PHRASE}</span> to confirm
                        </label>
                        <input
                            id={ids.deleteInput}
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder={DELETE_PHRASE}
                            autoComplete="off"
                            spellCheck={false}
                            autoFocus
                            disabled={isDeleting}
                            className={cx(inputBase, 'border-line hover:border-line-strong focus:border-danger/60 focus:ring-danger/10')}
                        />
                    </div>

                    {deleteError && (
                        <p role="alert" className="flex items-start gap-1.5 font-medium text-danger text-sm">
                            <AlertCircle size={15} className="mt-0.5 shrink-0" /> {deleteError}
                        </p>
                    )}

                    <div className="flex sm:flex-row flex-col-reverse gap-3">
                        <Button variant="secondary" onClick={closeDeleteConfirm} disabled={isDeleting} className="flex-1">
                            Cancel
                        </Button>
                        <button
                            type="submit"
                            disabled={deleteConfirmText !== DELETE_PHRASE || isDeleting}
                            className={cx(solidDanger, 'flex-1')}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete forever'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Cropping Modal */}
            <Modal open={isCropping && !!selectedImage} onClose={closeCropper} labelledBy={ids.cropTitle}>
                <div className="flex flex-col gap-5">
                    <div className="pr-8">
                        <h3 id={ids.cropTitle} className="font-display font-semibold text-fg text-xl">Crop your picture</h3>
                        <p className="mt-1 text-fg-muted text-sm">Drag to reposition and use the slider to zoom.</p>
                    </div>
                    <div className="relative bg-black border border-line rounded-2xl w-full h-72 overflow-hidden">
                        {selectedImage && (
                            <Cropper
                                image={selectedImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onCropComplete={handleCropComplete}
                                onZoomChange={setZoom}
                            />
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <label htmlFor={ids.zoom} className="font-semibold text-[11px] text-fg-subtle uppercase tracking-[0.14em]">
                            Zoom
                        </label>
                        <input
                            id={ids.zoom}
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="flex-1 w-full accent-primary"
                        />
                        <span className="w-10 text-fg-muted text-xs text-right tabular-nums">{zoom.toFixed(1)}&times;</span>
                    </div>
                    <div className="flex sm:flex-row flex-col-reverse gap-3">
                        <Button variant="secondary" onClick={closeCropper} className="flex-1">
                            Cancel
                        </Button>
                        <Button onClick={uploadCroppedImage} className="flex-1">
                            Apply &amp; save
                        </Button>
                    </div>
                </div>
            </Modal>

            <ConfirmationModal
                isOpen={isDeleteReviewModalOpen}
                onClose={() => setIsDeleteReviewModalOpen(false)}
                onConfirm={async () => {
                    if (reviewIdToDelete) {
                        try {
                            await deleteReview(reviewIdToDelete);
                            setReviewIdToDelete(null);
                        } catch (error) {
                            console.error('Failed to delete review:', error);
                        }
                    }
                }}
                title="Delete review?"
                message="Are you sure you want to delete this review? This action cannot be undone."
                confirmText="Delete"
                isDestructive={true}
            />
        </div>
    );
}
