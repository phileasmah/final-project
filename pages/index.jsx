import { signIn, signOut, useSession } from "next-auth/client";
import Head from "next/head";
import CurrentPlaylist from "../components/CurrentPlaylist";

export default function Home() {
  const [session, loading] = useSession();

  return (
    <div>
      <Head>
        <title>Music Mood Analyser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="m-auto text-center text-5xl font-semibold">Music Mood Analyzer</h1>
      <div>
        {session || loading ? (
          <button
            onClick={() => signOut()}
            className="hover:bg-lightgrey px-4 py-2 text-text font-semibold border border-lightgrey2 rounded duration-200 focus:bg-lightgrey3"
            tabIndex={4}
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => signIn("spotify")}
            className="px-2.5 md:px-4 py-2 font-semibold bg-blue-600 rounded text-white duration-200 hover:bg-blue-500 focus:bg-blue-500 hover:rounded-2xl focus:rounded-2xl"
          >
            Login with Spotify
          </button>
        )}
      </div>
      <CurrentPlaylist session = {session}/>
    </div>
  );
}
