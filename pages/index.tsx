import { signIn, useSession } from "next-auth/client";
import Head from "next/head";
import CurrentPlaylist from "../components/CurrentPlaylist";
import NavBar from "../components/NavBar/NavBar";

export default function Home() {
  const [session, loading] = useSession();

  return (
    <div>
      <Head>
        <title>Music Mood Analyser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {session || loading ? (
          <div>
            <NavBar />
            <CurrentPlaylist session={session} />
          </div>
        ) : (
          <div className="flex flex-col justify-center align-middle h-screen">
            <h1 className="text-center text-5xl font-medium">Music Taste Explorer</h1>
            <div className="mx-auto mt-4">
              <button
                onClick={() => signIn("spotify")}
                className="px-2.5 md:px-4 py-2 font-medium bg-lightblue rounded text-darkgrey duration-200 hover:bg-lightblue2 focus:bg-lightblue3 hover:rounded-2xl focus:rounded-2xl"
              >
                Sign in with <b className="text-darkgrey">Spotify</b>
              </button>
            </div>
            <h2 className="text-center mt-4">All connections are secure and no user data will be stored remotely</h2>
          </div>
        )}
      </div>
    </div>
  );
}
