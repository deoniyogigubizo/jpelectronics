import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { getUserByEmail } from '@/lib/db';
import { connectToDatabase } from '@/lib/mongodb';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  providers: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        },
      },
    }),
  ] : [],
  pages: {
    signIn: '/profile',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        token.id = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user }) {
      if (!user.email) return false;

      // Check if user exists in our database
      const existingUser = await getUserByEmail(user.email);

      if (!existingUser) {
        // Create new user from Google profile directly in database
        const db = await connectToDatabase();
        const newUser = {
          name: user.name || '',
          email: user.email,
          role: 'customer',
          phone: '',
          district: '',
          sector: '',
          address: '',
          password: '', // Google users don't need password
          createdAt: new Date(),
        };

        await db.collection('users').insertOne(newUser);
      }

      return true;
    },
  },
});