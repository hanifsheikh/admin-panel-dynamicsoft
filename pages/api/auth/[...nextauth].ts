import db from "@/database/db";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
 
const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",   
      credentials: {
        email: { label: "Email", type: "text"},
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials, _req) => {   
        await db.connect();
          const user = await User.findOne({
          email: credentials?.email,
        });
        await db.disconnect();
        if (user && bcrypt.compareSync(credentials?.password || "", user.password)) {
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          }        
        }
        throw new Error("Invalid email or password"); 
      },
    }),
  ],
  pages: {
    signIn: "/", 
  },
  callbacks: {
    async jwt({ token, user }: {token:any, user:any }) {
      if (user?._id) token._id = user._id;
      if (user?.role) token.role = user.role;
      return token;
    },
    async session({ session, token } : {session:any, token:any}) {
      if (token?._id) session.user._id = token._id;
      if (token?.role) session.user.role = token.role;
      return session;
    },
  },
};

export default NextAuth(authOptions);