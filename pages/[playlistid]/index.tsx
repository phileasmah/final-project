// import { GetServerSideProps } from "next";
import axios from "axios";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../../components/Contexts/ApiContext";
import { ApiContextProvider } from "../../types/ApiContextProvider";
import { ItemsEntity, Playlist } from "../../types/PlaylistType";

const PlaylistProfile: React.FC = () => {
  const router = useRouter();
  const [playlistInfo, setPlaylistInfo] = useState<ItemsEntity[]>([]);
  const [unauthorized, setUnauthorized] = useState<boolean>(false);
  const { clientToken } = useContext(ApiContext) as ApiContextProvider;
  const [session, loading] = useSession();

  useEffect(() => {
    if (loading) return;
    const getPlaylistRec = async (url: string) => {
      const response = await axios.get<Playlist>(url, {
        headers: {
          Authorization:
            "Bearer " + `${session ? session.user.accessToken : clientToken?.access_token}`,
        },
      });
      if (response.data.items) {
        setPlaylistInfo((p) => p.concat(response.data.items));
        if (response.data.next) {
          getPlaylistRec(response.data.next);
        }
      }
    };

    const getPlaylist = async (id: string) => {
      try {
        const response = await axios.get<Playlist>(
          `https://api.spotify.com/v1/playlists/${id}/tracks`,
          {
            headers: {
              Authorization:
                "Bearer " + `${session ? session.user.accessToken : clientToken?.access_token}`,
            },
          }
        );
        if (response.data.items) {
          setPlaylistInfo(response.data.items);
          if (response.data.next) {
            getPlaylistRec(response.data.next);
          }
        }
      } catch (err) {
        setUnauthorized(true);
      }
    };
    getPlaylist(router.query.playlistid as string);
  }, [router, loading, session, clientToken]);
  console.log(playlistInfo);
  return (
    <div>
      {unauthorized ? (
        <div>You need permission to access this album</div>
      ) : playlistInfo.length ? (
        <div> Yes </div>
      ) : (
        <div> This playlist is empty</div>
      )}
    </div>
  );
};

export default PlaylistProfile;
