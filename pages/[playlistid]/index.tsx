// import { GetServerSideProps } from "next";
import axios from "axios";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../../components/Contexts/ApiContext";
import PlaylistOverview from "../../components/PlaylistOverview";
import { ApiContextProvider } from "../../types/ApiContextProvider";
import { AudioFeature, AudioFeatures } from "../../types/AudioFeatues";
import { ItemsEntity, Playlist } from "../../types/PlaylistType";

const PlaylistProfile: React.FC = () => {
  const router = useRouter();
  const [playlistInfo, setPlaylistInfo] = useState<ItemsEntity[]>([]);
  const [audioFeatures, setAudioFeatures] = useState<AudioFeature[]>([]);
  const [unauthorized, setUnauthorized] = useState<boolean>(false);
  const { clientToken, finish } = useContext(ApiContext) as ApiContextProvider;
  const [session, loading] = useSession();

  useEffect(() => {
    if (loading || !finish) return;
    const getPlaylistRec = async (url: string) => {
      const response = await axios.get<Playlist>(url, {
        headers: {
          Authorization:
            "Bearer " + `${session ? session.user.accessToken : clientToken?.access_token}`,
        },
      });
      if (response.data.items) {
        setPlaylistInfo((p) => p.concat(response.data.items));
        getAudioFeatures(response.data.items, false);
        if (response.data.next) {
          getPlaylistRec(response.data.next);
        }
      }
    };

    const getAudioFeatures = async (tracks: ItemsEntity[], initial: boolean) => {
      const ids = tracks.map((e) => e.track.id).join(",");
      const response = await axios.get<AudioFeatures>(
        `https://api.spotify.com/v1/audio-features?ids=${ids}`,
        {
          headers: {
            Authorization:
              "Bearer " + `${session ? session.user.accessToken : clientToken?.access_token}`,
          },
        }
      );
      if (initial) {
        setAudioFeatures(response.data.audio_features);
      } else {
        setAudioFeatures((p) => p.concat(response.data.audio_features));
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
          getAudioFeatures(response.data.items, true);
          if (response.data.next) {
            getPlaylistRec(response.data.next);
          }
        }
      } catch (err) {
        setUnauthorized(true);
      }
    };

    getPlaylist(router.query.playlistid as string);
  }, [router, loading, session, clientToken, finish]);

  return (
    <div>
      {unauthorized ? (
        <div>You need permission to access this album</div>
      ) : playlistInfo.length ? (
        <PlaylistOverview playlistInfo={playlistInfo} audioFeatures={audioFeatures} />
      ) : (
        <div> This playlist is empty</div>
      )}
    </div>
  );
};

export default PlaylistProfile;
