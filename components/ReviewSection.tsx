"use client";

import React, { useId, useState } from 'react';
import { useSelector } from 'react-redux';
import { useUserData } from '@/hooks/useUserData';
import { useQuery } from '@tanstack/react-query';
import { userDataService, Review } from '@/services/userDataService';
import { RootState } from '@/store/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, Trash2, Reply, LogIn, CornerDownRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ConfirmationModal } from './ConfirmationModal';
import { Avatar } from '@/components/layout/UserMenu';
import { Badge, Button, ButtonLink, EmptyState, Skeleton, cx } from '@/components/ui/primitives';

interface ReviewSectionProps {
    mediaId: number;
    mediaType: 'movie' | 'tv';
}

interface ReviewItemProps {
    review: Review;
    allReviews: Review[];
    mediaId: number;
    mediaType: 'movie' | 'tv';
    onDelete: (id: string) => void;
    userProfile: { id: string; avatar_url?: string | null; full_name?: string } | null;
    depth?: number;
}

const textareaClass =
    'bg-surface-raised px-4 py-3 border border-line focus:border-primary/60 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 w-full text-fg placeholder:text-fg-subtle text-sm leading-relaxed transition-[border-color,box-shadow] resize-none disabled:opacity-60 disabled:cursor-not-allowed';

function timeAgo(date: string) {
    try {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
        return '';
    }
}

function ReviewItem({ review, allReviews, mediaId, mediaType, onDelete, userProfile, depth = 0 }: ReviewItemProps) {
    const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const { addReview, isAddingReview } = useUserData();
    const replyFieldId = useId();

    // Find replies for this specific review
    const replies = allReviews.filter(r => r.parent_id === review.id);
    const authorName = review.user?.full_name || 'Anonymous';
    const isOwn = !!userProfile && review.user_id === userProfile.id;

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim() || isAddingReview) return;

        try {
            await addReview({
                mediaId,
                mediaType,
                content: replyContent.trim(),
                parentId: review.id
            });
            setReplyContent('');
            setIsReplyFormOpen(false);
        } catch (error) {
            console.error('Failed to post reply:', error);
        }
    };

    return (
        <div className={cx('space-y-3', depth > 0 && 'ml-4 sm:ml-6 pl-4 sm:pl-6 border-l border-line')}>
            <motion.article
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                aria-label={`${depth > 0 ? 'Reply' : 'Review'} by ${authorName}`}
                className={cx(
                    'group p-4 sm:p-5 border rounded-2xl transition-colors',
                    depth > 0
                        ? 'bg-white/2 border-line hover:border-line-strong'
                        : 'bg-surface-dark border-line hover:border-line-strong',
                )}
            >
                <div className="flex items-start gap-3 sm:gap-4">
                    <Avatar url={review.user?.avatar_url ?? null} name={authorName} size={depth > 0 ? 32 : 40} />

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-3">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
                                <h4 className="font-sans font-semibold text-fg text-sm truncate">{authorName}</h4>
                                {isOwn && <Badge tone="accent">You</Badge>}
                                <span aria-hidden className="text-fg-subtle text-xs">&middot;</span>
                                <time dateTime={review.created_at} className="text-fg-subtle text-xs">
                                    {timeAgo(review.created_at)}
                                </time>
                            </div>

                            {isOwn && (
                                <button
                                    type="button"
                                    onClick={() => onDelete(review.id)}
                                    aria-label="Delete review"
                                    title="Delete review"
                                    className="flex justify-center items-center hover:bg-danger/10 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 -mt-1 -mr-1 rounded-lg size-8 text-fg-subtle hover:text-danger transition-all shrink-0"
                                >
                                    <Trash2 size={15} />
                                </button>
                            )}
                        </div>

                        <p className="mt-1.5 text-fg/90 text-sm sm:text-[15px] leading-relaxed whitespace-pre-line wrap-break-word">
                            {review.content}
                        </p>

                        <div className="flex items-center gap-1 mt-3 -ml-2">
                            <button
                                type="button"
                                onClick={() => setIsReplyFormOpen(!isReplyFormOpen)}
                                aria-expanded={isReplyFormOpen}
                                aria-controls={isReplyFormOpen ? replyFieldId : undefined}
                                className={cx(
                                    'inline-flex items-center gap-1.5 px-2 py-1 rounded-lg font-semibold text-xs transition-colors',
                                    isReplyFormOpen
                                        ? 'text-primary-light bg-primary/10'
                                        : 'text-fg-subtle hover:text-fg hover:bg-white/6',
                                )}
                            >
                                <Reply size={14} /> {isReplyFormOpen ? 'Cancel' : 'Reply'}
                            </button>
                            {replies.length > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 text-fg-subtle text-xs">
                                    <CornerDownRight size={12} /> {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                                </span>
                            )}
                        </div>

                        <AnimatePresence initial={false}>
                            {isReplyFormOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <form onSubmit={handleReplySubmit} className="flex flex-col gap-3 pt-3">
                                        <label htmlFor={replyFieldId} className="sr-only">
                                            Reply to {authorName}
                                        </label>
                                        <textarea
                                            id={replyFieldId}
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                                    e.preventDefault();
                                                    void handleReplySubmit(e);
                                                }
                                            }}
                                            placeholder={userProfile ? `Reply to ${authorName}...` : 'Log in to reply'}
                                            disabled={!userProfile || isAddingReview}
                                            rows={3}
                                            className={cx(textareaClass, 'min-h-20')}
                                            autoFocus
                                        />
                                        <div className="flex justify-end items-center gap-2">
                                            {!userProfile && (
                                                <ButtonLink href="/login" variant="ghost" size="sm">
                                                    <LogIn size={14} /> Log in
                                                </ButtonLink>
                                            )}
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={!replyContent.trim() || !userProfile || isAddingReview}
                                            >
                                                {isAddingReview ? 'Posting...' : (
                                                    <>
                                                        <Send size={14} /> Post reply
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.article>

            {/* Render Replies Recursively */}
            {replies.length > 0 && (
                <div className="space-y-3">
                    {replies.map(reply => (
                        <ReviewItem
                            key={reply.id}
                            review={reply}
                            allReviews={allReviews}
                            mediaId={mediaId}
                            mediaType={mediaType}
                            onDelete={onDelete}
                            userProfile={userProfile}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function ReviewSection({ mediaId, mediaType }: ReviewSectionProps) {
    const [content, setContent] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reviewIdToDelete, setReviewIdToDelete] = useState<string | null>(null);
    const { addReview, deleteReview, isAddingReview, userProfile } = useUserData();
    const authUser = useSelector((state: RootState) => state.auth.user);
    const composerId = useId();
    const headingId = useId();

    const { data: reviews, isLoading } = useQuery({
        queryKey: ['reviews', mediaId, mediaType],
        queryFn: () => userDataService.getReviewsForMedia(mediaId, mediaType),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || isAddingReview) return;

        try {
            await addReview({ mediaId, mediaType, content: content.trim() });
            setContent('');
        } catch (error) {
            console.error('Failed to post review:', error);
        }
    };

    const handleDeleteClick = (reviewId: string) => {
        setReviewIdToDelete(reviewId);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!reviewIdToDelete) return;
        try {
            await deleteReview(reviewIdToDelete);
            setReviewIdToDelete(null);
        } catch (error) {
            console.error('Failed to delete review:', error);
        }
    };

    // Only get top-level reviews for initial rendering
    const rootReviews = reviews?.filter(r => !r.parent_id) || [];
    const totalCount = reviews?.length ?? 0;
    const kind = mediaType === 'movie' ? 'movie' : 'show';
    const myName = userProfile?.full_name || authUser?.name || '';

    return (
        <section aria-labelledby={headingId} className="mt-16 pt-12 border-line border-t">
            <div className="flex justify-between items-end gap-4 mb-6">
                <div className="min-w-0">
                    <div className="mb-1 font-semibold text-[11px] text-primary uppercase tracking-[0.14em]">Community</div>
                    <h2 id={headingId} className="flex items-center gap-2.5 font-display font-bold text-fg text-xl sm:text-2xl">
                        Reviews
                        {totalCount > 0 && (
                            <span className="bg-white/8 px-2 py-0.5 border border-line rounded-full font-sans font-semibold text-fg-muted text-xs tabular-nums">
                                {totalCount}
                            </span>
                        )}
                    </h2>
                    <p className="mt-0.5 text-fg-muted text-sm">What people are saying about this {kind}.</p>
                </div>
            </div>

            {/* Composer */}
            <div className="bg-surface-dark mb-8 p-4 sm:p-5 border border-line focus-within:border-line-strong rounded-3xl transition-colors">
                {userProfile ? (
                    <form onSubmit={handleSubmit} className="flex items-start gap-3 sm:gap-4">
                        <Avatar url={userProfile.avatar_url ?? null} name={myName} size={40} className="hidden sm:inline-flex" />
                        <div className="flex flex-col flex-1 gap-3 min-w-0">
                            <label htmlFor={composerId} className="sr-only">
                                Write a review
                            </label>
                            <textarea
                                id={composerId}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                        e.preventDefault();
                                        void handleSubmit(e);
                                    }
                                }}
                                placeholder={`Share your thoughts on this ${kind}...`}
                                disabled={isAddingReview}
                                rows={3}
                                className={cx(textareaClass, 'min-h-24')}
                            />
                            <div className="flex justify-between items-center gap-3">
                                <p className="hidden sm:block text-fg-subtle text-xs">
                                    Posting as <span className="font-medium text-fg-muted">{myName || 'you'}</span>
                                    <span aria-hidden> &middot; </span>
                                    <kbd className="font-sans">Ctrl</kbd> + <kbd className="font-sans">Enter</kbd> to post
                                </p>
                                <Button type="submit" disabled={!content.trim() || isAddingReview} className="ml-auto">
                                    {isAddingReview ? 'Posting...' : (
                                        <>
                                            <Send size={16} /> Post review
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="flex sm:flex-row flex-col sm:items-center gap-4">
                        <div className="flex flex-1 items-center gap-3 sm:gap-4 min-w-0">
                            <div className="flex justify-center items-center bg-primary/12 border border-primary/20 rounded-full size-10 text-primary-light shrink-0">
                                <MessageSquare size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-fg text-sm">Join the conversation</p>
                                <p className="text-fg-muted text-sm">Log in to post a review or reply to others.</p>
                            </div>
                        </div>
                        <ButtonLink href="/login" variant="secondary" size="sm" className="self-start sm:self-auto">
                            <LogIn size={14} /> Log in
                        </ButtonLink>
                    </div>
                )}
            </div>

            {/* Reviews List */}
            <div className="space-y-4" aria-busy={isLoading}>
                {isLoading ? (
                    [1, 2, 3].map((n) => (
                        <div key={n} className="flex gap-4 bg-surface-dark p-5 border border-line rounded-2xl">
                            <Skeleton className="rounded-full size-10 shrink-0" />
                            <div className="flex-1 space-y-2.5">
                                <Skeleton className="rounded-md w-40 h-3.5" />
                                <Skeleton className="rounded-md w-full h-3" />
                                <Skeleton className="rounded-md w-2/3 h-3" />
                            </div>
                        </div>
                    ))
                ) : rootReviews.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                        {rootReviews.map((review: Review) => (
                            <ReviewItem
                                key={review.id}
                                review={review}
                                allReviews={reviews || []}
                                mediaId={mediaId}
                                mediaType={mediaType}
                                onDelete={handleDeleteClick}
                                userProfile={userProfile ?? null}
                            />
                        ))}
                    </AnimatePresence>
                ) : (
                    <EmptyState
                        icon={<MessageSquare size={26} />}
                        title="No reviews yet"
                        description={`Be the first to share what you thought of this ${kind}.`}
                        className="bg-white/2 py-14 border border-line border-dashed rounded-3xl"
                    />
                )}
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete review?"
                message="Are you sure you want to delete this review? This action cannot be undone."
                confirmText="Delete"
                isDestructive={true}
            />
        </section>
    );
}
