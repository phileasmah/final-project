import { useEffect, useState } from "react";
import { AudioFeature } from "../types/AudioFeatues";
import { ItemsEntity } from "../types/PlaylistType";
import GeneralTimeAnalysis from "./GeneralTimeAnalysis";
import TracksTransform from "./TracksTransform";


type Features = "Acousticness" | "Danceability" | "Energy" | "Liveness" | "Valence";

interface Props {
  audioFeaturesDict: { [songId: string]: AudioFeature };
  addDate: {
    [year: string]: { [month: string]: ItemsEntity[] };
  };
  playlistId: string;
  rootMood: [Features, string][];
}

const GeneralTimeOverview: React.FC<Props> = ({
  audioFeaturesDict,
  addDate,
  playlistId,
  rootMood,
}) => {
  const [monthPos, setMonthPos] = useState(2);
  const [yearPos, setYearPos] = useState(0);
  const [years, setYears] = useState<string[]>([]);
  const [months, setMonths] = useState<string[][]>([]);
  const [fullLoad, setFullLoad] = useState(false);
  const [filterBy, setFilterBy] = useState(true);

  useEffect(() => {
    const tmpYears = Object.keys(addDate).reverse();
    const tmpMonths = [];
    for (let i = 0; i < tmpYears.length; i++) {
      tmpMonths.push(Object.keys(addDate[tmpYears[i]]).reverse());
    }
    setYears(tmpYears);
    setMonths(tmpMonths);
    if (2 >= tmpMonths[0].length) {
      setFullLoad(true);
    }
  }, [addDate]);

  const handleLoadMore = () => {
    setMonthPos((monthPos) => monthPos + 2);
    if (monthPos + 2 >= months[yearPos].length - 1) {
      setFullLoad(true);
    }
  };

  const handleLoadAll = () => {
    setMonthPos(11);
    setFullLoad(true);
  };

  const handlePrev = () => {
    setYearPos((yearPos) => yearPos - 1);
    setMonthPos(2);
    if (2 >= months[yearPos - 1].length) {
      setFullLoad(true);
    } else {
      setFullLoad(false);
    }
  };

  const handleNext = () => {
    setYearPos((yearPos) => yearPos + 1);
    setMonthPos(2);
    if (2 >= months[yearPos + 1].length) {
      setFullLoad(true);
    } else {
      setFullLoad(false);
    }
  };

  const handleSwitch = () => {
    setFilterBy(!filterBy);
  };

  return (
    <div className="flex flex-col w-10/12 mx-auto">
      <button onClick={handleSwitch}>switch</button>
      {years.length > 0 && months.length > 0 && (
        <div key={years[yearPos] + playlistId}>
          <div className="flex">
            {yearPos > 0 && <button onClick={handlePrev}> &lt; </button>}
            <span className="text-5xl font-medium mx-auto">{years[yearPos]}</span>
            {yearPos < years.length - 1 && <button onClick={handleNext}> &gt; </button>}
          </div>
          <hr className="border-gray-400 mb-3" />
          {filterBy ? (
            months[yearPos].slice(0, monthPos + 1).map((month) => (
              <div key={month + years[yearPos] + playlistId}>
                <GeneralTimeAnalysis
                  tracks={addDate[years[yearPos]][month]}
                  time={years[yearPos] + "," + month}
                  audioFeaturesDict={audioFeaturesDict}
                  rootMood={rootMood}
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
              /> 
            </div>
          )}
        </div>
      )}
      {!fullLoad && (
        <div className="flex align-middle justify-center gap-x-5 my-6">
          <button
            onClick={handleLoadMore}
            className="bg-green-900 rounded-md w-36 py-2 text-text duration-150 hover:rounded-2xl hover:bg-green-800"
          >
            Load More
          </button>
          <button
            onClick={handleLoadAll}
            className="bg-green-900 rounded-md w-36 py-2 text-text duration-150 hover:rounded-2xl hover:bg-green-800"
          >
            Load All
          </button>
        </div>
      )}
      <div className="flex">
        {yearPos > 0 && <button onClick={handlePrev}> &lt; </button>}
        <span className="text-5xl font-medium mx-auto">{years[yearPos]}</span>
        {yearPos < years.length - 1 && <button onClick={handleNext}> &gt; </button>}
      </div>
    </div>
  );
};

export default GeneralTimeOverview;
