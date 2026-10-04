import { ID, type Models } from 'appwrite';
import { account } from '@/lib/appwrite';
import type { User } from '@/store/features/authSlice';
import { userDataService } from './userDataService';

const toAuthUser = (user: Models.User<Models.Preferences>): User => ({
    id: user.$id,
    name: user.name || user.email.split('@')[0] || 'User',
    email: user.email,
});

export const authService = {
    /** Creates the account, opens a session and seeds the public profile row. */
    async signUp({ name, email, password }: { name: string; email: string; password: string }): Promise<User> {
        await account.create({ userId: ID.unique(), email, password, name });
        await account.createEmailPasswordSession({ email, password });
        const user = await account.get();

        try {
            await userDataService.createUserProfile(user.$id, name);
        } catch {
            // getUserProfile() recreates a missing profile lazily, so signup still succeeds.
        }

        return toAuthUser(user);
    },

    async signIn({ email, password }: { email: string; password: string }): Promise<User> {
        await account.createEmailPasswordSession({ email, password });
        return toAuthUser(await account.get());
    },

    /** Returns the logged-in user, or null when there is no active session. */
    async getCurrentUser(): Promise<User | null> {
        try {
            return toAuthUser(await account.get());
        } catch {
            return null;
        }
    },

    async signOut() {
        try {
            await account.deleteSession({ sessionId: 'current' });
        } catch {
            // Session may already be gone (e.g. right after account deletion).
        }
    },

    /** Emails a recovery link that lands on /reset-password?userId=…&secret=… */
    async requestPasswordReset(email: string) {
        await account.createRecovery({
            email,
            url: `${window.location.origin}/reset-password`,
        });
    },

    async completePasswordReset({ userId, secret, password }: { userId: string; secret: string; password: string }) {
        await account.updateRecovery({ userId, secret, password });
    },

    /** Appwrite requires the current password to change the login email. */
    async updateEmail(email: string, currentPassword: string): Promise<User> {
        return toAuthUser(await account.updateEmail({ email, password: currentPassword }));
    },

    /** Short-lived token used to prove identity to our own API routes. */
    async createJWT(): Promise<string> {
        const { jwt } = await account.createJWT();
        return jwt;
    },
};
