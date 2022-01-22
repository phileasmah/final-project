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
}

const GeneralTimeOverview: React.FC<Props> = ({ audioFeaturesDict, addDate, playlistId }) => {
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
      {Object.keys(addDate).reverse().map((year) => (
        <div key={year + playlistId}>
          <div>{year}</div>
          {Object.keys(addDate[year]).reverse().map((month) => (
            <div key={month+year+playlistId}>
              <GeneralTimeAnalysis tracks={addDate[year][month]} year={year} month={month} audioFeaturesDict={audioFeaturesDict}/>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GeneralTimeOverview;
