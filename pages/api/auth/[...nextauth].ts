
import NextAuth, { Account, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Providers from "next-auth/providers";


async function refreshAccessToken(token: JWT) {
  try {
    const url =
      "https://accounts.spotify.com/api/token?" +
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });
    const encryptedAuth = Buffer.from(
      process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
    );
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + encryptedAuth.toString("base64"),
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

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
}

export default NextAuth({
  providers: [
    Providers.Spotify({
      scope:
        "user-read-email user-read-recently-played user-read-playback-state user-top-read app-remote-control playlist-modify-public user-modify-playback-state user-read-currently-playing playlist-read-private user-library-read playlist-read-collaborative",
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt(token: JWT, user: User, account: Account) {
      if (account && user) {
        token.id = account.id;
        token.accessToken = account.accessToken;
        if (typeof account.refreshToken === "string") {
          token.refreshToken = account.refreshToken;
        }
        token.accessTokenExpires = Date.now() + (account.expires_in as number) * 1000;
        return token;
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session(session, user: JWT) {
      session.user = user;
      return session;
    },
  },
  jwt: {
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
  },
});
