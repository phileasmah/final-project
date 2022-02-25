type Features = "Acousticness" | "Danceability" | "Energy" | "Liveness" | "Valence";
interface Props {
  features: [Features, string][];
  playlistId: string;
  rootMood?: [Features, string][];
}

const OverallMood: React.FC<Props> = ({ features, playlistId, rootMood }) => {
  const meanings = {
    Acousticness: " A measure from 0.0 to 1.0 of whether the track is acoustic.",
    Danceability:
      "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.",
    Energy:
      "Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy.",
    Liveness:
      "Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live.",
    Valence:
      "A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).",
  };
  
  return (
    <div className="flex flex-col mx-auto">
      {features.map((feature, idx) => (
        <div key={feature[0] + playlistId} className="group my-2">
          <div className="text-lg font-medium">
            {feature[0]} - <span className="text-text">{feature[1]}</span>
          </div>
          <div className="duration-300 mt-0.5">
            <div className="bg-gray-600 rounded-lg">
              {rootMood ? (
                <div
                  className="duration-300 group-hover:h-7 h-3 bg-gray-400 rounded-lg mb-1.5"
                  style={{ width: feature[1] }}
                ></div>
              ) : (
                <div
                  className="duration-300 h-7 bg-gray-400 rounded-lg mb-1.5"
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
                        className="duration-300 group-hover:h-7 h-3 bg-gray-400 rounded-lg mb-1.5"
                        style={{ width: rootMood[idx][1] }}
                      ></div>
                    </div>
                    <div className="text-lg font-medium">
                      Overall {feature[0]} - <span className="text-text">{rootMood[idx][1]}</span>
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
