import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Artist } from "../types/Artist";
import { AudioFeature } from "../types/AudioFeatues";
import { ItemsEntity, Playlist } from "../types/PlaylistType";
import OverallMood from "./OverallMood";

interface Props {
  trackInfo: ItemsEntity[];
  audioFeatures: AudioFeature[];
  playlistInfo: Playlist;
  clientToken: string | undefined;
  session: string | null;
}

interface DateGroup {
  [year: number]: { [month: number]: ItemsEntity[] };
}

interface ArtistCount {
  [name: string]: number;
}

interface ArtistGenre {
  [id: string]: string[];
}

interface GenreCount {
  [genre: string]: number;
}

const PlaylistAnalysis: React.FC<Props> = ({
  trackInfo,
  audioFeatures,
  playlistInfo,
  clientToken,
  session,
}) => {
  const [addDate, setAddDate] = useState<DateGroup>();
  const [topArtists, setTopArtists] = useState<string[]>([]);
  const [artists, setArtists] = useState<ArtistCount>();
  const [artistGenres, setArtistGenres] = useState<ArtistGenre>();
  const [topGenres, setTopGenres] = useState<string[]>();
  const [genreCount, setGenreCount] = useState<GenreCount>();
  // console.log(audioFeatures)
  // console.log(playlistInfo)
  // console.log(trackInfo)
  useEffect(() => {
    if (!trackInfo) {
      return;
    }

    const getArtistInfo = async (
      artistIds: string[],
      artistGenres: ArtistGenre,
      artistGenreCount: GenreCount,
    ) => {

      const id = artistIds.join();
      const response = await axios.get<Artist>(`https://api.spotify.com/v1/artists?ids=${id}`, {
        headers: {
          Authorization: "Bearer " + `${session ? session : clientToken}`,
        },
      });

      for (const x of response.data.artists) {
        artistGenres[x.name] = x.genres;
        for (const genre of x.genres) {
          if (genre in artistGenreCount) {
            artistGenreCount[genre] += 1;
          } else {
            artistGenreCount[genre] = 1;
          }
        }
      }
      setTopGenres(Object.keys(artistGenreCount).sort((a, b) => artistGenreCount[b] - artistGenreCount[a]));
    };

    const tmpDict: DateGroup = {};
    const tmpArtists: ArtistCount = {};
    const tmpArtistGenres: ArtistGenre = {};
    const tmpArtistGenreCount: GenreCount = {};

    let artistIds = [];
    for (let x of trackInfo) {
      if (x.track.id === null) continue;
      const tmp = new Date(x.added_at);
      const tmpYear = tmp.getFullYear();
      const tmpMonth = tmp.getMonth();
      if (tmpYear in tmpDict) {
        if (tmpMonth in tmpDict[tmpYear]) tmpDict[tmpYear][tmpMonth].push(x);
        else tmpDict[tmpYear][tmpMonth] = [x];
      } else {
        tmpDict[tmpYear] = { [tmpMonth]: [x] };
      }
      for (const artist of x.track.artists) {
        if (artist.name in tmpArtists) {
          tmpArtists[artist.name] += 1;
        } else {
          artistIds.push(artist.id);
          tmpArtists[artist.name] = 1;
          if (artistIds.length === 50) {
            getArtistInfo(artistIds, tmpArtistGenres, tmpArtistGenreCount);
            artistIds = [];
          }
        }
      }
    }
    if (artistIds.length > 0) {
      getArtistInfo(artistIds, tmpArtistGenres, tmpArtistGenreCount);
    }
    setAddDate(tmpDict);
    setArtists(tmpArtists);
    setTopArtists(Object.keys(tmpArtists).sort((a, b) => tmpArtists[b] - tmpArtists[a]));
    setArtistGenres(tmpArtistGenres);
    setGenreCount(tmpArtistGenreCount);
  }, [trackInfo, audioFeatures, session, clientToken]);
  // console.log(topGenres)
  // console.log(genreCount)
  return (
    <div className="flex flex-col align-middle justify-center">
      <h1 className="text-center text-4xl my-8">
        <b>{playlistInfo.name}</b>
      </h1>
      <div className="flex mx-auto gap-x-7">
        {playlistInfo.images ? (
          <Image
            src={playlistInfo.images[0].url}
            alt={playlistInfo.name + " playlist art"}
            width={260}
            height={260}
            className="rounded-md"
          />
        ) : (
          <div>No image</div>
        )}
        <div>
          <div className="text-lg">
            <b>{playlistInfo.tracks.total}</b> song{playlistInfo.tracks.total > 1 && "s"} by{" "}
            <b>{topArtists.length}</b> artist{topArtists.length > 1 && "s"}
          </div>
        </div>
      </div>
      {topArtists && artists && (
        <div>
          Top Artists:
          {topArtists.slice(0, 3).map((artist) => (
            <div key={artist}>
              {artist}: {artists[artist]}{" "}
            </div>
          ))}
        </div>
      )}
      <OverallMood audioFeatures={audioFeatures} playlistId={playlistInfo.id}/>
    </div>
  );
};

export default PlaylistAnalysis;
