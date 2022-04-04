// import { GetServerSideProps } from "next";
import axios from "axios";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../../components/Contexts/ApiContext";
import PlaylistAnalysis from "../../components/PlaylistAnalysis";
import { ApiContextProvider } from "../../types/ApiContextProvider";
import { AudioFeature, AudioFeatures } from "../../types/AudioFeatues";
import { ItemsEntity, Playlist, Tracks } from "../../types/PlaylistType";

const PlaylistProfile: React.FC = () => {
  const router = useRouter();
  const [trackInfo, setTrackInfo] = useState<ItemsEntity[]>([]);
  const [audioFeatures, setAudioFeatures] = useState<AudioFeature[]>([]);
  const [playlistInfo, setPlaylistInfo] = useState<Playlist>();
  const [unauthorized, setUnauthorized] = useState<boolean>(false);
  const { clientToken, finish } = useContext(ApiContext) as ApiContextProvider;
  const [session, loading] = useSession();
  const [prevSession, setPrevSession] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading || !finish || (prevSession && session && prevSession === session.user.accessToken))
      return;
    setIsLoading(true);
    setTrackInfo([]);
    setAudioFeatures([]);
    const getTracksRec = async (url: string) => {
      const response = await axios.get<Tracks>(url, {
        headers: {
          Authorization:
            "Bearer " + `${session ? session.user.accessToken : "error"}`,
        },
      });
      if (response.data.items) {
        setTrackInfo((p) => p.concat(response.data.items));
        await getAudioFeatures(response.data.items);
        if (response.data.next) {
          getTracksRec(response.data.next);
        } else {
          setIsLoading(false);
        }
      }
    };

    const getAudioFeatures = async (tracks: ItemsEntity[]) => {
      const ids = tracks.map((e) => e.track.id).join(",");
      const response = await axios.get<AudioFeatures>(
        `https://api.spotify.com/v1/audio-features?ids=${ids}`,
        {
          headers: {
            Authorization:
              "Bearer " + `${session ? session.user.accessToken : "error"}`,
          },
        }
      );

      setAudioFeatures((p) => p.concat(response.data.audio_features));
    };

    const getTracks = async (id: string) => {
      try {
        const response = await axios.get<Playlist>(`https://api.spotify.com/v1/playlists/${id}`, {
          headers: {
            Authorization:
              "Bearer " + `${session ? session.user.accessToken : "error"}`,
          },
        });
        if (response.data.tracks.items) {
          setTrackInfo((p) => p.concat(response.data.tracks.items));
          setPlaylistInfo(response.data);
          await getAudioFeatures(response.data.tracks.items);
          if (response.data.tracks.next) {
            getTracksRec(response.data.tracks.next);
          } else {
            setIsLoading(false);
          }
        }
      } catch (err) {
        setUnauthorized(true);
      }
    };

    getTracks(router.query.playlistid as string);
    if (session) {
      setPrevSession(session.user.accessToken);
    }
  }, [router, loading, session, clientToken, finish]);

  return (
    <div>
      {unauthorized ? (
        <div>You need permission to access this album or this album doesnt exist</div>
      ) : isLoading ? (
        <div>
          Loading Songs...{audioFeatures.length} / {playlistInfo?.tracks.total}
        </div>
      ) : audioFeatures && playlistInfo ? (
        <PlaylistAnalysis
          trackInfo={trackInfo}
          audioFeatures={audioFeatures}
          playlistInfo={playlistInfo}
          clientToken={clientToken?.access_token}
          session={session ? session.user.accessToken : null}
        />
      ) : (
        <div> This playlist is empty</div>
      )}
    </div>
  );
};

export default PlaylistProfile;
