import { useEffect, useState } from "react";
import { AudioFeature } from "../types/AudioFeatues";
import { ItemsEntity } from "../types/PlaylistType";
import GeneralTimeAnalysis from "./GeneralTimeAnalysis";
import TracksTransform from "./TracksTransform";

type Features = "Acousticness" | "Danceability" | "Energy" | "Instrumentalness" | "Valence";

interface Props {
  audioFeaturesDict: { [songId: string]: AudioFeature };
  addDate: {
    [year: string]: { [month: string]: ItemsEntity[] };
  };
  playlistId: string;
  rootMood: [Features, string][];
  artistGenres: { [id: string]: string[] };
}

const GeneralTimeOverview: React.FC<Props> = ({
  audioFeaturesDict,
  addDate,
  playlistId,
  rootMood,
  artistGenres,
}) => {
  const [monthPos, setMonthPos] = useState(2);
  const [yearPos, setYearPos] = useState(0);
  const [years, setYears] = useState<string[]>([]);
  const [months, setMonths] = useState<string[][]>([]);
  const [filterBy, setFilterBy] = useState(false);

  useEffect(() => {
    const tmpYears = Object.keys(addDate).reverse();
    const tmpMonths = [];
    for (let i = 0; i < tmpYears.length; i++) {
      tmpMonths.push(Object.keys(addDate[tmpYears[i]]).reverse());
    }
    setYears(tmpYears);
    setMonths(tmpMonths);
  }, [addDate]);

  const handlePrev = () => {
    setYearPos((yearPos) => yearPos - 1);
    setMonthPos(2);
  };

  const handleNext = () => {
    setYearPos((yearPos) => yearPos + 1);
    setMonthPos(2);
  };

  const handleSwitch = () => {
    setFilterBy(!filterBy);
  };

  return (
    <div className="flex flex-col w-10/12 mx-auto mt-3">
      <div className="flex flex-col md:flex-row justify-between align-middle mb-3">
        {" "}
        <span className="text-text font-semibold text-3xl">
          Playlist analysis based on date added
        </span>{" "}
        <div className="ml-auto md:ml-0">
          <span className="font-semibold mr-2">Sorting by:</span>
          <button
            onClick={handleSwitch}
            className="bg-lightblue text-darkgrey px-3 py-1 rounded-lg hover:rounded-full font-semibold"
          >
            {filterBy ? "Monthly" : "Yearly"}
          </button>
        </div>
      </div>

      {years.length > 0 && months.length > 0 && (
        <div key={years[yearPos] + playlistId}>
          <div className="flex">
            {yearPos > 0 && (
              <button onClick={handlePrev}>
                {" "}
                <span className="bg-lightblue text-2xl text-darkgrey font-semibold px-2 py-0.5 rounded-full">
                  &lt;
                </span>{" "}
              </button>
            )}
            <span className="text-5xl font-semibold text-text mt-3 mx-auto">{years[yearPos]}</span>
            {yearPos < years.length - 1 && (
              <button onClick={handleNext}>
                {" "}
                <span className="bg-lightblue text-2xl text-darkgrey font-semibold px-2 py-0.5 rounded-full">
                  &gt;
                </span>{" "}
              </button>
            )}
          </div>
          <hr className="mt-3 mb-2 border-lightgrey2" />
          {filterBy ? (
            months[yearPos].slice(0, monthPos + 1).map((month) => (
              <div key={month + years[yearPos] + playlistId}>
                <GeneralTimeAnalysis
                  tracks={addDate[years[yearPos]][month]}
                  time={years[yearPos] + "," + month}
                  audioFeaturesDict={audioFeaturesDict}
                  rootMood={rootMood}
                  artistGenres={artistGenres}
                />
              </div>
            ))
          ) : (
            <div>
              <TracksTransform
                tracks={addDate[years[yearPos]]}
                time={years[yearPos] + ","}
                audioFeaturesDict={audioFeaturesDict}
                rootMood={rootMood}
                artistGenres={artistGenres}
              />
            </div>
          )}
        </div>
      )}

      <div className="flex mt-3 mb-10">
        {yearPos > 0 && (
          <button onClick={handlePrev}>
            {" "}
            <span className="bg-lightblue text-2xl text-darkgrey font-semibold px-2 py-0.5 rounded-full">
              &lt;
            </span>{" "}
          </button>
        )}
        <span className="text-5xl font-semibold text-text mt-3 mx-auto">{years[yearPos]}</span>
        {yearPos < years.length - 1 && (
          <button onClick={handleNext}>
            {" "}
            <span className="bg-lightblue text-2xl text-darkgrey font-semibold px-2 py-0.5 rounded-full">
              &gt;
            </span>{" "}
          </button>
        )}
      </div>
    </div>
  );
};

export default GeneralTimeOverview;
