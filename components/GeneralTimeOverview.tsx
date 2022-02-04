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
  avgAudioFeatures: string[][]
}

const GeneralTimeOverview: React.FC<Props> = ({ audioFeaturesDict, addDate, playlistId, avgAudioFeatures }) => {
  const [period, setPeriods] = useState([]);

  useEffect(() => {
    console.log(addDate);
    // for (let x in addDate) {
    //   for (let y in addDate[x]) {
    //     for (let i of addDate[x][y]) {
    //       total += 1;
    //     }
    //   }
    // }
  });

  return (
    <div className="flex flex-col w-10/12 mx-auto">
      {Object.keys(addDate)
        .reverse()
        .map((year) => (
          <div key={year + playlistId}>
            <div>{year}</div>
            <hr className="border-gray-400 mb-3" />
            {Object.keys(addDate[year])
              .reverse()
              .map((month) => (
                <div key={month + year + playlistId}>
                  <GeneralTimeAnalysis
                    tracks={addDate[year][month]}
                    time={year+","+month}
                    audioFeaturesDict={audioFeaturesDict}
                    avgAudioFeatures={avgAudioFeatures}
                  />
                </div>
              ))}
          </div>
        ))}
    </div>
  );
};

export default GeneralTimeOverview;