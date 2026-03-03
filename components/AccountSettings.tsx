import React, { useEffect } from 'react';
import { Camera, Laptop } from 'lucide-react';
import { useSupabase } from '@/hooks/useSupabase';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { login } from '@/store/features/authSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImage';

const accountSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
});
type AccountFormData = z.infer<typeof accountSchema>;

export default function AccountSettings() {
    const { userProfile, updateProfile, isUpdatingProfile, isLoadingProfile, uploadAvatar, isUploadingAvatar } = useSupabase();
    const [submitSuccess, setSubmitSuccess] = React.useState(false);
    const [submitError, setSubmitError] = React.useState('');
    const dispatch = useDispatch();
    const authUser = useSelector((state: RootState) => state.auth.user);

    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
    const [crop, setCrop] = React.useState({ x: 0, y: 0 });
    const [zoom, setZoom] = React.useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(null);
    const [isCropping, setIsCropping] = React.useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<AccountFormData>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            fullName: authUser?.name || '',
            email: authUser?.email || '',
        }
    });

    // Reset form when profile data loads
    useEffect(() => {
        if (userProfile && authUser) {
            reset({
                fullName: userProfile.full_name || authUser.name || '',
                email: authUser.email || '',
            });
        }
    }, [userProfile, authUser, reset]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImage(reader.result as string);
            setIsCropping(true);
        };
        reader.readAsDataURL(file);

        // reset input
        event.target.value = '';
    };

    const handleCropComplete = React.useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const uploadCroppedImage = async () => {
        if (!selectedImage || !croppedAreaPixels) return;

        try {
            setIsCropping(false);
            const croppedFile = await getCroppedImg(selectedImage, croppedAreaPixels);
            if (!croppedFile) return;

            await uploadAvatar(croppedFile);
            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to save cropped image');
        }
    };

    const handleAvatarRemove = async () => {
        setSubmitError('');
        try {
            await updateProfile({ avatar_url: null });
            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to remove avatar');
        }
    };

    const onSubmit = async (data: AccountFormData) => {
        setSubmitError('');
        setSubmitSuccess(false);
        try {
            await updateProfile({
                full_name: data.fullName,
                email: data.email !== authUser?.email ? data.email : undefined,
            });

            // Update Redux state if email or name changes
            if (authUser) {
                dispatch(login({
                    id: authUser.id,
                    name: data.fullName,
                    email: data.email,
                }));
            }

            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (error) {
            if (error instanceof Error) {
                setSubmitError(error.message);
            } else {
                setSubmitError('Failed to update profile');
            }
        }
    };

    if (isLoadingProfile) {
        return <div className="p-10 text-slate-400 text-center animate-pulse">Loading profile data...</div>;
    }

    return (
        <div className="space-y-10">
            {/* Public Profile */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-white/5 border-b">
                    <h3 className="flex items-center gap-2 font-bold text-white text-xl">
                        <span className="bg-primary rounded-full w-1 h-5"></span> Personal Information
                    </h3>
                </div>

                <div className="flex sm:flex-row flex-col items-start sm:items-center gap-6 pt-2">
                    <div className="group relative cursor-pointer shrink-0">
                        <div className="border-2 border-primary/20 group-hover:border-primary rounded-full w-24 h-24 overflow-hidden transition-colors">
                            <div className="bg-cover bg-center w-full h-full" style={{ backgroundImage: `url('${userProfile?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCedjOjCf4XTbJ8yVlGUAF-fcHQDrCuA3FEuyM7AJVDTzUzUGmJqn4BleiID4vRtQNdFFsNnHdBjq02Kf85qXBNoSMW-Y32AOcIbSzTRZ7fQi5lmTIko1fDvgBE0DaiJl7MP8Y-vyNFjvLqhyhHouvVemgiNutFMhMM4Qckkw6hfhv6c84RayYobmykBpYfUH7CR5sAVYGEp1CuL6kR-S2rCXzWLsg1yA07VwzNl2ZD3EFKUC4kxUmA7YQOFsRHtXw4ZQfAwq8OGw'}')` }} />
                        </div>
                        <div className="absolute inset-0 flex justify-center items-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                            <Camera className="text-white" size={24} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-3">
                            <label className={`bg-white/10 hover:bg-white/20 shadow-sm px-5 py-2 rounded-lg font-bold text-white text-sm transition-colors ${isUploadingAvatar ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                {isUploadingAvatar ? 'Uploading...' : 'Change Picture'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                    disabled={isUploadingAvatar}
                                />
                            </label>
                            <button
                                type="button"
                                onClick={handleAvatarRemove}
                                disabled={isUploadingAvatar || !userProfile?.avatar_url}
                                className="disabled:opacity-50 px-5 py-2 rounded-lg font-bold text-slate-400 hover:text-white text-sm transition-colors disabled:cursor-not-allowed"
                            >
                                Remove
                            </button>
                        </div>
                        <p className="text-slate-500 text-xs">Recommended size: 256x256px. Max 2MB.</p>
                    </div>
                </div>

                <div className="gap-6 grid grid-cols-1 md:grid-cols-2 pt-4">
                    <div className="relative space-y-2 md:col-span-2">
                        <label className="ml-1 font-bold text-slate-300 text-sm">Full Name</label>
                        <input
                            type="text"
                            {...register('fullName')}
                            className={`bg-background-dark px-4 py-3 border ${errors.fullName ? 'border-red-500' : 'border-white/5 focus:border-primary'} rounded-xl focus:outline-none focus:ring-1 focus:ring-primary w-full font-medium text-white transition-all`}
                        />
                        {errors.fullName && <span className="text-red-500 text-xs">{errors.fullName.message}</span>}
                    </div>
                    <div className="relative space-y-2">
                        <label className="ml-1 font-bold text-slate-300 text-sm">Email Address</label>
                        <input
                            type="email"
                            {...register('email')}
                            className={`bg-background-dark px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-white/5 focus:border-primary'} rounded-xl focus:outline-none focus:ring-1 focus:ring-primary w-full font-medium text-white transition-all`}
                        />
                        {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-white/5 border-t">
                    <div className="flex-1">
                        {submitSuccess && <span className="font-bold text-green-500 text-sm">Profile updated successfully!</span>}
                        {submitError && <span className="font-bold text-red-500 text-sm">{submitError}</span>}
                    </div>
                    <button
                        type="submit"
                        disabled={!isDirty || isUpdatingProfile}
                        className="bg-primary hover:bg-primary/90 disabled:opacity-50 hover:shadow-lg hover:shadow-primary/20 disabled:hover:shadow-none px-8 py-3 rounded-xl font-bold text-background-dark text-sm transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
                    >
                        {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>

            {/* Connected Devices */}
            <div className="space-y-6 opacity-50 pt-6 border-white/5 border-t pointer-events-none">
                <div className="flex justify-between items-center pb-4 border-white/5 border-b">
                    <h3 className="flex items-center gap-2 font-bold text-white text-xl">
                        <span className="bg-primary rounded-full w-1 h-5"></span> Connected Devices (Coming Soon)
                    </h3>
                </div>

                <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-2">
                    {/* Device 1 */}
                    <div className="group relative flex flex-col gap-4 bg-background-dark p-4 border border-primary/20 rounded-xl overflow-hidden">
                        <div className="top-0 right-0 absolute bg-primary/5 group-hover:bg-primary/10 blur-2xl rounded-full w-24 h-24 transition-colors -translate-y-1/2 translate-x-1/3"></div>
                        <div className="z-10 flex items-start gap-4">
                            <div className="flex justify-center items-center bg-primary/10 rounded-lg w-10 h-10 shrink-0">
                                <Laptop className="text-primary" size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-white">Current Device</span>
                                <span className="flex items-center gap-1 mt-0.5 font-bold text-primary text-xs"><div className="bg-primary rounded-full w-1.5 h-1.5"></div> Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cropping Modal */}
            {isCropping && selectedImage && (
                <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/80 p-4">
                    <div className="flex flex-col gap-4 bg-background-dark p-6 border border-white/10 rounded-2xl w-full max-w-md">
                        <h3 className="font-bold text-white text-xl">Crop Image</h3>
                        <div className="relative bg-black rounded-xl w-full h-64 overflow-hidden">
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
                        </div>
                        <div className="flex justify-between items-center gap-4 pt-2">
                            <div className="flex items-center gap-3 w-full">
                                <span className="font-bold text-slate-400 text-xs uppercase">Zoom</span>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="flex-1 w-full accent-primary"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setIsCropping(false)}
                                className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl font-bold text-white text-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={uploadCroppedImage}
                                className="flex-1 bg-primary hover:bg-primary/90 py-3 rounded-xl font-bold text-background-dark text-sm transition-colors"
                            >
                                Apply & Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
