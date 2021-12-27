import Image from "next/image";
import { useEffect, useState } from "react";
import { AudioFeature } from "../types/AudioFeatues";
import { ItemsEntity, Playlist } from "../types/PlaylistType";

interface Props {
  trackInfo: ItemsEntity[];
  audioFeatures: AudioFeature[];
  playlistInfo: Playlist;
}

const PlaylistAnalysis: React.FC<Props> = ({ trackInfo, audioFeatures, playlistInfo }) => {
  const [addDate, setAddDate] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [artists, setArtists] = useState(null);

  useEffect(() => {
    if (!trackInfo) {
      return;
    }

    const tmpDict = {};
    const artists = {};

    for (let x of trackInfo) {
      const tmp = x.added_at.slice(0, 7);
      if (x.track.id === null) continue;
      if (tmp in tmpDict) {
        tmpDict[tmp] += 1;
      } else {
        tmpDict[tmp] = 1;
      }
      if (x.track.artists && x.track.artists[0].name in artists) {
        artists[x.track.artists[0].name] += 1;
      } else {
        artists[x.track.artists[0].name] = 1;
      }
    }
    setAddDate(tmpDict);
    setArtists(artists);
    setTopArtists(Object.keys(artists).sort((a, b) => artists[b] - artists[a]));
  }, [trackInfo, audioFeatures]);

  return (
    <div>
      {playlistInfo.images ? (
        <Image
          src={playlistInfo.images[0].url}
          alt={playlistInfo.name + " playlist art"}
          width={260}
          height={260}
          className="rounded-md"
        />
      ) : (
        <div>No image</div>
      )}
      {topArtists && (
        <div>
          {" "}
          Top Artists:{" "}
          {topArtists.slice(0, 3).map((artist) => (
            <div key={artist}>
              {artist}: {artists[artist]}{" "}
            </div>
          ))}{" "}
        </div>
      )}
      {addDate &&
        Object.keys(addDate)
          .reverse()
          .map((key) => (
            <div key={[key, addDate[key]]}>
              {key}: {addDate[key]}
            </div>
          ))}
    </div>
  );
};

export default PlaylistAnalysis;
