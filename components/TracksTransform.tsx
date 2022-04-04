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

type Features = "Acousticness" | "Danceability" | "Energy" | "Instrumentalness" | "Valence";

const TracksTransform: React.FC<Props> = ({ audioFeaturesDict, time, tracks, rootMood, artistGenres }) => {
  const [yearlyTracks, setYearlyTracks] = useState<[] | ItemsEntity[]>([]);

  useEffect(() => {
    let tmp: ItemsEntity[] = [];

    for (let x of Object.keys(tracks).reverse()) {
      tmp = tmp.concat(tracks[x]);
    }
    setYearlyTracks(tmp);
  }, [tracks]);
  
  return (
    <div>
      {yearlyTracks && (
        <div>
          <GeneralTimeAnalysis
            tracks={yearlyTracks}
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
