"use client";

import React, { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { useQuery } from '@tanstack/react-query';
import { supabaseService, Review } from '@/services/supabaseService';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, Trash2, User, Reply } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { ConfirmationModal } from './ConfirmationModal';

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

function ReviewItem({ review, allReviews, mediaId, mediaType, onDelete, userProfile, depth = 0 }: ReviewItemProps) {
    const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const { addReview, isAddingReview } = useSupabase();
    
    // Find replies for this specific review
    const replies = allReviews.filter(r => r.parent_id === review.id);

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
        <div className={`space-y-4 ${depth > 0 ? 'ml-8 sm:ml-12 border-l border-white/5 pl-4 sm:pl-6' : ''}`}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white/5 p-6 border border-white/5 hover:border-white/10 rounded-2xl transition-colors"
            >
                <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4">
                        <div className="relative flex justify-center items-center bg-white/5 border border-white/10 rounded-full w-10 h-10 overflow-hidden shrink-0">
                            {review.user?.avatar_url ? (
                                <Image
                                    src={review.user.avatar_url}
                                    alt={review.user.full_name || 'User'}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <User className="text-slate-500" size={20} />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-white text-sm sm:text-base">{review.user?.full_name || 'Anonymous'}</h4>
                                <span className="text-slate-500 text-xs text-center">•</span>
                                <span className="text-slate-500 text-xs">
                                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                </span>
                            </div>
                            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">{review.content}</p>
                            
                            <div className="flex items-center gap-4 mt-3">
                                <button
                                    onClick={() => setIsReplyFormOpen(!isReplyFormOpen)}
                                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                                        isReplyFormOpen ? 'text-primary' : 'text-slate-500 hover:text-primary'
                                    }`}
                                >
                                    <Reply size={14} /> {isReplyFormOpen ? 'Cancel' : 'Reply'}
                                </button>
                            </div>
                        </div>
                    </div>
                    {userProfile && review.user_id === userProfile.id && (
                        <button
                            onClick={() => onDelete(review.id)}
                            className="hover:bg-red-500/10 opacity-0 group-hover:opacity-100 p-2 rounded-lg text-slate-500 hover:text-red-500 transition-all"
                            title="Delete Review"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>

                {isReplyFormOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 pt-4 border-t border-white/5"
                    >
                        <form onSubmit={handleReplySubmit} className="flex flex-col gap-3">
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder={userProfile ? "Write your reply..." : "Please login to reply"}
                                disabled={!userProfile || isAddingReview}
                                className="bg-black/20 px-4 py-3 border border-white/5 focus:border-primary/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/30 w-full min-h-[80px] text-sm text-white placeholder:text-slate-500 transition-all resize-none"
                                autoFocus
                            />
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={!replyContent.trim() || !userProfile || isAddingReview}
                                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 px-4 py-2 rounded-lg font-bold text-background-dark text-xs transition-all hover:-translate-y-0.5"
                                >
                                    {isAddingReview ? 'Posting...' : 'Post Reply'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </motion.div>

            {/* Render Replies Recursively */}
            {replies.length > 0 && (
                <div className="space-y-4">
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
    const { addReview, deleteReview, isAddingReview, userProfile } = useSupabase();

    const { data: reviews, isLoading } = useQuery({
        queryKey: ['reviews', mediaId, mediaType],
        queryFn: () => supabaseService.getReviewsForMedia(mediaId, mediaType),
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

    return (
        <section className="mt-16 pt-12 border-white/5 border-t">
            <div className="flex justify-between items-center mb-8 pb-4 border-surface-dark border-b">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                        <MessageSquare className="text-primary" size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-2xl">Guest Reviews</h2>
                        <p className="text-slate-400 text-sm">Read what others think about this {mediaType === 'movie' ? 'movie' : 'show'}</p>
                    </div>
                </div>
            </div>

            {/* Post Review Form */}
            <div className="bg-white/5 backdrop-blur-md mb-12 p-6 border border-white/10 rounded-2xl">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                        <div className="relative flex justify-center items-center bg-white/5 border border-white/10 rounded-full w-10 h-10 overflow-hidden shrink-0">
                            {userProfile?.avatar_url ? (
                                <Image
                                    src={userProfile.avatar_url}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <User className="text-slate-500" size={20} />
                            )}
                        </div>
                        <div className="relative flex-1">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={userProfile ? "Write your thoughts..." : "Please login to post a review"}
                                disabled={!userProfile || isAddingReview}
                                className="bg-black/20 px-4 py-3 border border-white/5 focus:border-primary/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/30 w-full min-h-[100px] text-white placeholder:text-slate-500 transition-all resize-none"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={!content.trim() || !userProfile || isAddingReview}
                            className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 px-6 py-2.5 rounded-xl font-bold text-background-dark transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0 transform"
                        >
                            {isAddingReview ? 'Posting...' : (
                                <>
                                    <Send size={18} /> Post Review
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-8">
                {isLoading ? (
                    [1, 2, 3].map((n) => (
                        <div key={n} className="bg-white/5 rounded-2xl w-full h-24 animate-pulse" />
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
                                userProfile={userProfile}
                            />
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="bg-white/5 py-12 border border-white/10 border-dashed rounded-2xl text-center">
                        <MessageSquare className="mx-auto mb-3 text-slate-600" size={40} />
                        <p className="text-slate-400">No reviews yet. Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Review"
                message="Are you sure you want to delete this review? This action cannot be undone."
                confirmText="Delete"
                isDestructive={true}
            />
        </section>
    );
}
