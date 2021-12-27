import Image from "next/image";
import { useEffect, useState } from "react";
import { AudioFeature } from "../types/AudioFeatues";
import { ItemsEntity, Playlist } from "../types/PlaylistType";

interface Props {
  trackInfo: ItemsEntity[];
  audioFeatures: AudioFeature[];
  playlistInfo: Playlist;
}

interface DateGroup {
  [year: number]: { [month: number]: ItemsEntity[] };
}

interface ArtistCount {
  [name: string]: number;
}

const PlaylistAnalysis: React.FC<Props> = ({ trackInfo, audioFeatures, playlistInfo }) => {
  const [addDate, setAddDate] = useState<DateGroup>();
  const [topArtists, setTopArtists] = useState<string[]>();
  const [artists, setArtists] = useState<ArtistCount>();

  useEffect(() => {
    if (!trackInfo) {
      return;
    }
    const tmpDict: DateGroup = {};
    const tmpArtists: ArtistCount = {};
    for (let x of trackInfo) {
      if (x.track.id === null) continue;
      const tmp = new Date(x.added_at);
      const tmpYear = tmp.getFullYear();
      const tmpMonth = tmp.getMonth();
      if (tmpYear in tmpDict) {
        if (tmpMonth in tmpDict[tmpYear]) tmpDict[tmpYear][tmpMonth].push(x);
        else tmpDict[tmpYear][tmpMonth] = [x];
      } else {
        tmpDict[tmpYear] = { [tmpMonth]: [x] };
      }
      if (x.track.artists && x.track.artists[0].name in tmpArtists) {
        tmpArtists[x.track.artists[0].name] += 1;
      } else {
        tmpArtists[x.track.artists[0].name] = 1;
      }
    }
    setAddDate(tmpDict);
    setArtists(tmpArtists);
    setTopArtists(Object.keys(tmpArtists).sort((a, b) => tmpArtists[b] - tmpArtists[a]));
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
      {topArtists && artists && (
        <div>
          Top Artists:
          {topArtists.slice(0, 3).map((artist) => (
            <div key={artist}>
              {artist}: {artists[artist]}{" "}
            </div>
          ))}
        </div>
      )}
      {addDate && console.log(addDate)}
    </div>
  );
};

export default PlaylistAnalysis;
