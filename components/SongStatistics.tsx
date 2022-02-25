import { useEffect, useState } from "react";
import { ItemsEntity } from "../types/PlaylistType";

interface Props {
  tracks: ItemsEntity[],
  unique: string
}

const SongStatistics: React.FC<Props> = ({ tracks, unique }) => {
  
  const [artistCount, setArtistCount] = useState<{[artistName:string]: number}>()
  const [sortedArtistCount, setSortedArtistCount] = useState<string[]>([]);

  useEffect(() => {
    const tmpArtists: {[artistName:string]: number} = {}
    for (let x of tracks) {
      for (let artist of x.track.artists) {
        if (artist.name in tmpArtists) {
          tmpArtists[artist.name] += 1;
        } else {
          tmpArtists[artist.name] = 1;
        }
      }
    }
    setArtistCount(tmpArtists)
    setSortedArtistCount(Object.keys(tmpArtists).sort((a, b) => tmpArtists[b] - tmpArtists[a]))
  }, [tracks])

  console.log(sortedArtistCount)

  return (
    <div>
      Top Artists: 
      {artistCount && sortedArtistCount.slice(0, 3).map((artist) => (
        <div key={artist + unique}>
          {artist} - {artistCount[artist]}
        </div>
      ))}
    </div>
  );
};

export default SongStatistics;
