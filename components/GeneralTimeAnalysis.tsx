import { useEffect, useState } from "react";
import { AudioFeature } from "../types/AudioFeatues";
import { ItemsEntity } from "../types/PlaylistType";

interface Props {
  year: string;
  month: string;
  tracks:  ItemsEntity[];
  audioFeaturesDict: { [songId: string]: AudioFeature };
}

const GeneralTimeAnalysis: React.FC<Props> = ({ audioFeaturesDict, month, tracks, year}) => {
  const [period, setPeriods] = useState([]);

  useEffect(() => {
    console.log(tracks)
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

    </div>
  );
};

export default GeneralTimeAnalysis;
