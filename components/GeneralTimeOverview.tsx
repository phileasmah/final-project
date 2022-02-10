import { useEffect, useState } from "react";
import { AudioFeature } from "../types/AudioFeatues";
import { ItemsEntity } from "../types/PlaylistType";
import GeneralTimeAnalysis from "./GeneralTimeAnalysis";

interface Props {
  audioFeaturesDict: { [songId: string]: AudioFeature };
  addDate: {
    [year: string]: { [month: string]: ItemsEntity[] };
  };
  playlistId: string;
  avgAudioFeatures: string[][];
}

const GeneralTimeOverview: React.FC<Props> = ({
  audioFeaturesDict,
  addDate,
  playlistId,
  avgAudioFeatures,
}) => {
  const [monthPos, setMonthPos] = useState(2);
  const [yearPos, setYearPos] = useState(0);
  const [years, setYears] = useState<string[]>([]);
  const [months, setMonths] = useState<string[][]>([]);
  const [fullLoad, setFullLoad] = useState(false);

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
  console.log(addDate);
  return (
    <div className="flex flex-col w-10/12 mx-auto">
      {years.length > 0 && months.length > 0 && (
        <div key={years[yearPos] + playlistId}>
          <div className="flex">
            {yearPos > 0 && <button onClick={handlePrev}> &lt; </button>}
            <span className="text-5xl font-medium mx-auto">{years[yearPos]}</span>
            {yearPos < years.length - 1 && <button onClick={handleNext}> &gt; </button>}
          </div>
          <hr className="border-gray-400 mb-3" />
          {months[yearPos].slice(0, monthPos + 1).map((month) => (
            <div key={month + years[yearPos] + playlistId}>
              <GeneralTimeAnalysis
                tracks={addDate[years[yearPos]][month]}
                time={years[yearPos] + "," + month}
                audioFeaturesDict={audioFeaturesDict}
                avgAudioFeatures={avgAudioFeatures}
              />
            </div>
          ))}
        </div>
      )}
      {!fullLoad && (
        <div>
          <button onClick={handleLoadMore}>Load more</button>
          <button onClick={handleLoadAll}>Load all months</button>
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
