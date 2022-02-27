import { useEffect, useState } from "react";
import { AudioFeature } from "../types/AudioFeatues";
import { ItemsEntity } from "../types/PlaylistType";
import GeneralTimeAnalysis from "./GeneralTimeAnalysis";

interface Props {
  time: string;
  tracks: { [month: string]: ItemsEntity[] };
  audioFeaturesDict: { [songId: string]: AudioFeature };
  rootMood: [Features, string][];
  artistGenres: { [id: string]: string[] };
}

type Features = "Acousticness" | "Danceability" | "Energy" | "Liveness" | "Valence";

const TracksTransform: React.FC<Props> = ({ audioFeaturesDict, time, tracks, rootMood, artistGenres }) => {
  const [final, setFinal] = useState<[] | ItemsEntity[]>([]);

  useEffect(() => {
    let tmp: ItemsEntity[] = [];

    for (let x of Object.keys(tracks).reverse()) {
      tmp = tmp.concat(tracks[x]);
    }
    setFinal(tmp);
  }, [tracks]);
  return (
    <div>
      {final && (
        <div>
          <GeneralTimeAnalysis
            tracks={final}
            time={time}
            audioFeaturesDict={audioFeaturesDict}
            rootMood={rootMood}
            artistGenres={artistGenres}
          />
        </div>
      )}
    </div>
  );
};

export default TracksTransform;
