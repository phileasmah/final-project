import { useEffect, useState } from "react";
import { AudioFeature } from "../types/AudioFeatues";
import { ItemsEntity } from "../types/PlaylistType";

interface Props {
  playlistInfo: ItemsEntity[];
  audioFeatures: AudioFeature[];
}

const PlaylistOverview: React.FC<Props> = ({ playlistInfo, audioFeatures }) => {
  const [addDate, setAddDate] = useState(null);
  console.log(audioFeatures, playlistInfo)
  useEffect(() => {
    if (!playlistInfo) {
      return;
    }

    const tmpDict = {};

    for (let x of playlistInfo) {
      const tmp = x.added_at.slice(0, 7);
      if (tmp in tmpDict) {
        tmpDict[tmp] += 1;
      } else {
        tmpDict[tmp] = 1;
      }
    }
    setAddDate(tmpDict);
  }, [playlistInfo]);

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

export default PlaylistOverview;
