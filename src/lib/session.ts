import { NextAuthOptions, User, Account } from "next-auth";
// import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import AzureProvider, { AzureADProfile } from "next-auth/providers/azure-ad";
import jwt, { JwtPayload } from "jsonwebtoken";

const refreshAccessToken = async (token: any) => {
  console.log("token inside refresh token ", token);
  try {
    const url = `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`;

    const requestBody = new URLSearchParams();
    requestBody.append("client_id", process.env.AZURE_AD_CLIENT_ID as string);
    requestBody.append(
      "client_secret",
      process.env.AZURE_AD_CLIENT_SECRET as string
    );
    requestBody.append("grant_type", "refresh_token");
    requestBody.append("refresh_token", token?.refreshToken);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: requestBody.toString(),
    });
    console.log("response", response);

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }
    console.log("refreshedTokens", refreshedTokens);

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    AzureProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      tenantId: process.env.AZURE_AD_TENANT_ID || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline_access",
          response_type: "code",
          scope: `openid profile email offline_access`, //"openid profile email offline_access",
        },
      },
      profile(profile: AzureADProfile) {
        return {
          id: profile.sub.toString(),
          name: profile.name,
          email: profile.email,
          role: profile.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 1000,
  },
  pages: {
    signIn: "/signin",
    signOut: "/",
  },
  jwt: {
    maxAge: Date.now() + 1 * 60 * 1000,
  },
  callbacks: {
    async jwt({
      token,
      user,
      account,
    }: {
      token: any;
      user: User;
      account: Account | null;
    }) {
      if (user?.id) token = Object.assign({}, token, { _id: user.id });

      if (account && account.expires_at) {
        token.accessToken = account.access_token;
        token.accessTokenExpires = Date.now() + 5 * 60 * 1000;
        token.refreshToken = account.refresh_token;

        const decodedToken = jwt.decode(
          account?.id_token as string
        ) as JwtPayload;
        console.log(decodedToken?.groups);
        return token;
      }

      const isAccessTokenExpire = Date.now() > token.accessTokenExpires;
      const timeToRefreshBeforeExpiration = 2 * 60 * 1000;
      if (isAccessTokenExpire) {
        return refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.accessToken = token.accessToken as string;

        return {
          ...session,
          user: {
            ...session.user,
            name: token.name,
            username: token.username,
            role: token.role,
          },
        };
      }
      return session;
    },
  },
};
