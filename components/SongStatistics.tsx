import { useEffect, useState } from "react";
import { ItemsEntity } from "../types/PlaylistType";
import GenreColour from "./GenreColour";

interface Props {
  tracks: ItemsEntity[];
  unique: string;
  artistGenres: { [id: string]: string[] };
}

const SongStatistics: React.FC<Props> = ({ tracks, unique, artistGenres }) => {
  const [artistCount, setArtistCount] = useState<{ [artistName: string]: number }>();
  const [sortedArtistCount, setSortedArtistCount] = useState<string[]>([]);
  const [genreCount, setGenreCount] = useState<{ [genre: string]: number }>({});
  const [sortedGenreCount, setSortedGenreCount] = useState<string[]>([]);

  useEffect(() => {
    const tmpArtists: { [artistName: string]: number } = {};
    const tmpGenreCount: { [genre: string]: number } = {};
    for (let x of tracks) {
      for (let artist of x.track.artists) {
        if (artist.name in tmpArtists) {
          tmpArtists[artist.name] += 1;
        } else {
          tmpArtists[artist.name] = 1;
          for (let genre of artistGenres[artist.name]) {
            if (genre in tmpGenreCount) {
              tmpGenreCount[genre] += 1;
            } else {
              tmpGenreCount[genre] = 1;
            }
          }
        }
      }
    }

    setSortedArtistCount(
      Object.keys(tmpArtists)
        .sort((a, b) => tmpArtists[b] - tmpArtists[a])
        .slice(0, 3)
    );
    setSortedGenreCount(
      Object.keys(tmpGenreCount)
        .sort((a, b) => tmpGenreCount[b] - tmpGenreCount[a])
        .slice(0, 10)
    );
    setArtistCount(tmpArtists);
    setGenreCount(tmpGenreCount);
  }, [tracks, artistGenres]);

  return (
    <div>
      <div className="mb-6">
        <span className="text-text font-semibold text-2xl">Top Artists</span>
        <hr className="my-1.5 border-lightgrey2" />
        <ul>
          {artistCount &&
            sortedArtistCount.map((artist) => (
              <li key={artist + unique}>
                <span className="text-text font-semibold">{artist}</span> - {artistCount[artist]}
              </li>
            ))}
        </ul>
      </div>
      <div>
        <span className="text-text font-semibold text-2xl">Genres of Top Artists</span>
        <hr className="my-1.5 border-lightgrey2" />
        {sortedArtistCount.map((artist) => (
          <div key={`${artist} ${unique} genre`} className="mb-3">
            <span className="text-text font-semibold">{artist}:</span>
            <ul className="grid grid-cols-2">
              {artistGenres[artist].map((genre) => (
                <li key={artist + genre}>
                  <GenreColour genre={genre} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div>
        <span className="text-text font-semibold text-2xl">Top Genres</span>
        <hr className="my-1.5 border-lightgrey2" />
        <ul className="grid grid-cols-2">
          {sortedGenreCount.map((genre) => (
            <li key={`${genre} ${unique}`}>
              <GenreColour genre={genre} quantity={genreCount[genre]} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SongStatistics;
