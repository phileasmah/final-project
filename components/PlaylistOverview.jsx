import { useEffect, useState } from "react";

const PlaylistOverview = ({ playlistInfo }) => {
  const [addDate, setAddDate] = useState(null);

  useEffect(() => {
    if (!playlistInfo) {
      return;
    }
    const tmpDict = {};
    console.log(playlistInfo);
    for (let x of playlistInfo.items) {
      const tmp = x.added_at.slice(0, 7);
      if (tmp in tmpDict) {
        tmpDict[tmp] += 1;
      } else {
        tmpDict[tmp] = 1;
      }
    }
    setAddDate(tmpDict);
  }, [playlistInfo]);

  return (
    <div>
      <h1>Selected Playlist</h1>
      {addDate ? (
        Object.keys(addDate).reverse().map((key) => <div key={[key, addDate[key]]}>{key}: {addDate[key]}</div>)
      ) : (
        <div>Pick a playlist!</div>
      )}
    </div>
  );
};

export default PlaylistOverview;
