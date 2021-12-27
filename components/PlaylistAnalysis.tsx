import { useEffect, useState } from "react";
import { AudioFeature } from "../types/AudioFeatues";
import { ItemsEntity } from "../types/PlaylistType";

interface Props {
  playlistInfo: ItemsEntity[];
  audioFeatures: AudioFeature[];
}

const PlaylistAnalysis: React.FC<Props> = ({ playlistInfo, audioFeatures }) => {
  const [addDate, setAddDate] = useState(null);
  useEffect(() => {
    if (!playlistInfo) {
      return;
    }

    const tmpDict = {};
    const artists = {};

    for (let x of playlistInfo) {
      const tmp = x.added_at.slice(0, 7);
      if (tmp in tmpDict) {
        tmpDict[tmp] += 1;
      } else {
        tmpDict[tmp] = 1;
      }
      if (x.track.artists && x.track.artists[0].name in artists) {
        artists[x.track.artists[0].name] += 1
      } else {
        artists[x.track.artists[0].name] = 1
      }
    }
    setAddDate(tmpDict);
    console.log(artists)
    console.log(Object.keys(artists).sort((a, b) => artists[b] - artists[a]))
  }, [playlistInfo, audioFeatures]);

  return (
    <div>
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
