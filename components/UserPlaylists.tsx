import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import defaultPic from "../public/default-playlist-pic-min.png";
import likedSongsCover from "../public/liked-songs-cover.png";
import { UserAlbums } from "../types/UserAlbums";

interface Props {
  session: Session;
}

const UserPlaylists: React.FC<Props> = ({ session }) => {
  const [playlists, setPlaylists] = useState<UserAlbums | null>(null);
  const [prevSession, setPrevSession] = useState<null | string>(null);

  useEffect(() => {
    if (prevSession && session && prevSession === session.user.accessToken) return;
    const getPlaylists = async () => {
      if (!session) {
        return;
      }
      const axios = require("axios");
      const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
        headers: { Authorization: "Bearer " + session.user.accessToken },
      });
      setPlaylists(response.data.items);
    };

    getPlaylists();
    if (session) {
      setPrevSession(session.user.accessToken);
    }
  }, [session]);

  return (
    <div className="flex flex-col w-10/12 mx-auto">
      <h1 className="text-text text-4xl font-medium text-center mt-6 mb-2">
        Select Playlist for Analysis
      </h1>
      <div className="max-w-7xl grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center mx-auto gap-x-20">
        <Link href={"/liked-songs"}>
          <a className="mt-4 w-max md:w-56 2xl:w-60 3xl:w-66 group flex flex-col flex-shrink-0 rounded-lg focus:bg-lightgrey hover:bg-lightgrey duration-300 border-2 border-darkgrey hover:border-lightgrey2 focus:border-lightgrey2">
            <div className="transform duration-200 hover:scale-90 group-focus:scale-90">
              <Image
                src={likedSongsCover}
                alt={"liked songs cover art"}
                width={260}
                height={260}
                className="rounded-md"
              />
              <div className="w-64 md:w-52 2xl:w-56 3xl:w-64">
                <span className="font-semibold text-lg">Liked Songs</span>
                <div className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {session.user.name}
                </div>
              </div>
            </div>
          </a>
        </Link>
        {playlists &&
          playlists.map((playlist) => (
            <Link key={playlist.id} href={`/${playlist.id}`}>
              <a className="mt-4 w-max md:w-56 2xl:w-60 3xl:w-66 group flex flex-col flex-shrink-0 rounded-lg focus:bg-lightgrey hover:bg-lightgrey duration-300 border-2 border-darkgrey hover:border-lightgrey2 focus:border-lightgrey2">
                <div className="transform duration-200 hover:scale-90 group-focus:scale-90">
                  {playlist.images.length ? (
                    <Image
                      src={playlist.images[0].url}
                      alt={playlist.name + " playlist art"}
                      width={260}
                      height={260}
                      className="rounded-md"
                    />
                  ) : (
                    <Image
                      src={defaultPic}
                      alt={"default playlist art"}
                      width={260}
                      height={260}
                      className="rounded-md"
                    />
                  )}
                  <div className="w-64 md:w-52 2xl:w-56 3xl:w-64">
                    <span className="font-semibold text-lg">{playlist.name}</span>
                    <div className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                      {playlist.owner.display_name}
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default UserPlaylists;
