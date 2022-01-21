import { useEffect, useState } from "react";
import { AudioFeature } from "../types/AudioFeatues";

interface Props {
  audioFeatures: AudioFeature[];
  playlistId: string;
}

const OverallMood: React.FC<Props> = ({ audioFeatures, playlistId }) => {
  const [features, setFeatures] = useState<string[][]>([]);

  useEffect(() => {
    // 0: acousticness
    // 1: danceability
    // 2: energy
    // 3: liveness
    // 4: valence
    let features = [0, 0, 0, 0, 0];
    let total = audioFeatures.length;
    for (let x of audioFeatures) {
      try {
        features[0] += x.acousticness;
        features[1] += x.danceability;
        features[2] += x.energy;
        features[3] += x.liveness;
        features[4] += x.valence;
      } catch {
        total--;
      }
    }
    const tmp = [["Acousticness"], ["Danceability"], ["Energy"], ["Liveness"], ["Valence"]];
    for (let i = 0; i < features.length; i++) {
      tmp[i].push(Math.round((features[i] / total) * 100).toString() + "%");
    }

    setFeatures(tmp);
  }, [audioFeatures]);
  return (
    <div className="flex flex-col w-10/12 mx-auto">
      {features.map((feature, idx) => (
        <div key={idx + playlistId} className="group my-2">
          <div>{feature[0]}</div>
          <div className="duration-300 group-hover:h-7 group-hover:mb-4 h-3 bg-gray-600 rounded-lg mt-0.5">
            <div
              className="duration-300 group-hover:h-7 h-3 bg-gray-400 rounded-lg mb-1.5"
              style={{ width: feature[1] }}
            ></div>
            <span className="duration-300 hidden group-hover:inline font-bold">{feature[1].slice()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverallMood;
