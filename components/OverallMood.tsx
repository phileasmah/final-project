import { useEffect, useState } from "react";
import { AudioFeature } from "../types/AudioFeatues";
import { ItemsEntity } from "../types/PlaylistType";

type Features = "Acousticness" | "Danceability" | "Energy" | "Instrumentalness" | "Valence";
interface Props {
  playlistId: string;
  rootMood?: [Features, string][];
  audioFeaturesDict?: { [songId: string]: AudioFeature };
  tracks?: ItemsEntity[];
  overallFeatures?: [Features, string][];
}

const OverallMood: React.FC<Props> = ({
  playlistId,
  rootMood,
  audioFeaturesDict,
  tracks,
  overallFeatures,
}) => {
  const [features, setFeatures] = useState<[Features, string][]>();

  useEffect(() => {
    if (!tracks || !audioFeaturesDict) {
      return;
    }
    let total = tracks.length;
    const tmpFeatures: [Features, number | string][] = [
      ["Acousticness", 0],
      ["Danceability", 0],
      ["Energy", 0],
      ["Instrumentalness", 0],
      ["Valence", 0],
    ];
    for (let x of tracks) {
      try {
        (tmpFeatures[0][1] as number) += audioFeaturesDict[x.track.id].acousticness;
        (tmpFeatures[1][1] as number) += audioFeaturesDict[x.track.id].danceability;
        (tmpFeatures[2][1] as number) += audioFeaturesDict[x.track.id].energy;
        (tmpFeatures[3][1] as number) += audioFeaturesDict[x.track.id].instrumentalness;
        (tmpFeatures[4][1] as number) += audioFeaturesDict[x.track.id].valence;
      } catch {
        total--;
      }
    }

    for (let i = 0; i < tmpFeatures.length; i++) {
      tmpFeatures[i][1] =
        Math.round(((tmpFeatures[i][1] as number) / total) * 100).toString() + "%";
    }

    setFeatures(tmpFeatures as [Features, string][]);
  }, [audioFeaturesDict, tracks]);

  useEffect(() => {
    if (overallFeatures) {
      setFeatures(overallFeatures);
    }
  }, [overallFeatures]);
  
  const meanings = {
    Acousticness: " A measure from 0.0 to 1.0 of whether the track is acoustic.",
    Danceability:
      "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.",
    Energy:
      "Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy.",
    Instrumentalness:
      "Predicts whether a track contains no vocals. The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content.",
    Valence:
      "A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).",
  };

  return (
    <div className="flex flex-col mx-auto">
      {features &&
        features.map((feature, idx) => (
          <div key={feature[0] + playlistId} className="group my-2">
            <div className="text-lg font-medium">
              <div
                className={`inline-block font-semibold rounded-full mr-2 ${
                  rootMood ? "bg-darkgrey text-white" : "bg-spotify1 text-white mb-2 px-3 py-0.5"
                }`}
              >
                {feature[0]}
              </div>
              <span className="text-text font-semibold">{feature[1]}</span>
            </div>
            <div className="duration-300 mt-0.5">
              <div className="bg-gray-600 rounded-lg">
                {rootMood ? (
                  <div
                    className={`duration-300 group-hover:h-7 h-3 bg-white rounded-lg mb-1.5`}
                    style={{ width: feature[1] }}
                  ></div>
                ) : (
                  <div
                    className="duration-300 h-7 bg-spotify1 rounded-lg mb-1.5"
                    style={{ width: feature[1] }}
                  ></div>
                )}
              </div>

              <div>
                {rootMood ? (
                  <div>
                    <div className="duration-300">
                      <div className="bg-gray-600 rounded-lg">
                        <div
                          className="duration-300 group-hover:h-7 h-3 bg-spotify1 rounded-lg mb-0.5"
                          style={{ width: rootMood[idx][1] }}
                        ></div>
                      </div>
                      <div className="text-lg font-medium">
                        <div className="inline-block text-spotify1 font-semibold rounded-full mr-2">
                          Overall {feature[0]}
                        </div>
                        <span className="text-text">{rootMood[idx][1]}</span>
                      </div>
                    </div>
                    <div className="duration-300 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100">
                      {meanings[feature[0]]}
                    </div>
                  </div>
                ) : (
                  meanings[feature[0]]
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default OverallMood;
