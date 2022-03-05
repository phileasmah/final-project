import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import defaultPic from "../public/default-playlist-pic-min.png";
import { Artist } from "../types/Artist";
import { AudioFeature } from "../types/AudioFeatues";
import { ItemsEntity, LikedSongs, Playlist } from "../types/PlaylistType";
import GeneralTimeOverview from "./GeneralTimeOverview";
import OverallMood from "./OverallMood";

interface Props {
  trackInfo: ItemsEntity[];
  audioFeatures: AudioFeature[];
  playlistInfo: Playlist | LikedSongs;
  clientToken: string | undefined;
  session: string | null;
}

interface DateGroup {
  [year: string]: { [month: string]: ItemsEntity[] };
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

type Features = "Acousticness" | "Danceability" | "Energy" | "Liveness" | "Valence";

const PlaylistAnalysis: React.FC<Props> = ({
  trackInfo,
  audioFeatures,
  playlistInfo,
  clientToken,
  session,
}) => {
  const [addDate, setAddDate] = useState<DateGroup>();
  const [sortedArtists, setSortedArtists] = useState<string[]>([]);
  const [artists, setArtists] = useState<ArtistCount>();
  const [artistGenres, setArtistGenres] = useState<ArtistGenre>();
  const [sortedGenres, setSortedGenres] = useState<string[]>();
  const [genreCount, setGenreCount] = useState<GenreCount>();
  const [audioFeaturesDict, setAudioFeaturesDict] = useState<{ [songId: string]: AudioFeature }>(
    {}
  );
  const [avgAudioFeatures, setAvgAudioFeatures] = useState<[Features, string][]>();

  useEffect(() => {
    if (!trackInfo) {
      return;
    }

    const getArtistInfo = async (
      artistIds: string[],
      artistGenres: ArtistGenre,
      artistGenreCount: GenreCount
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
      setSortedGenres(
        Object.keys(artistGenreCount)
          .sort((a, b) => artistGenreCount[b] - artistGenreCount[a])
          .slice(0, 20)
      );
    };

    const tmpAddDateDict: DateGroup = {};
    const tmpArtists: ArtistCount = {};
    const tmpArtistGenres: ArtistGenre = {};
    const tmpArtistGenreCount: GenreCount = {};
    let artistIds = [];

    for (let x of trackInfo) {
      if (x.track.id === null) continue;
      const tmpDate = new Date(x.added_at);
      const tmpYear = tmpDate.getFullYear();
      const tmpMonth = tmpDate.getMonth();
      if (tmpYear in tmpAddDateDict) {
        if (tmpMonth in tmpAddDateDict[tmpYear]) tmpAddDateDict[tmpYear][tmpMonth].push(x);
        else tmpAddDateDict[tmpYear][tmpMonth] = [x];
      } else {
        tmpAddDateDict[tmpYear] = { [tmpMonth]: [x] };
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

    setSortedArtists(
      Object.keys(tmpArtists)
        .sort((a, b) => tmpArtists[b] - tmpArtists[a])
        .slice(0, 5)
    );
    setAddDate(tmpAddDateDict);
    setArtists(tmpArtists);
    setArtistGenres(tmpArtistGenres);
    setGenreCount(tmpArtistGenreCount);
  }, [trackInfo, session, clientToken]);

  useEffect(() => {
    const tmp: { [songId: string]: AudioFeature } = {};
    const features = [0, 0, 0, 0, 0];
    let total = audioFeatures.length;
    const tmpFeaturesAvg = [
      ["Acousticness"],
      ["Danceability"],
      ["Energy"],
      ["Liveness"],
      ["Valence"],
    ];
    for (let x of audioFeatures) {
      try {
        tmp[x.id] = x;
        features[0] += x.acousticness;
        features[1] += x.danceability;
        features[2] += x.energy;
        features[3] += x.liveness;
        features[4] += x.valence;
      } catch {
        total--;
      }
    }
    for (let i = 0; i < features.length; i++) {
      tmpFeaturesAvg[i].push(Math.round((features[i] / total) * 100).toString() + "%");
    }
    setAudioFeaturesDict(tmp);
    setAvgAudioFeatures(tmpFeaturesAvg as [Features, string][]);
  }, [audioFeatures]);

  return (
    <div className="flex flex-col align-middle justify-center max-w-8xl mx-auto">
      <h1 className="text-center text-4xl my-8">
        <b>{"public" in playlistInfo ? playlistInfo.name : "Liked Songs"}</b>
      </h1>
      {sortedArtists &&
        artists &&
        artistGenres &&
        Object.keys(artists).length === Object.keys(artistGenres).length &&
        genreCount &&
        sortedGenres && (
          <div className="w-10/12 mx-auto flex flex-col lg:flex-row justify-between">
            <div className="w-70 mx-auto lg:mx-0">
              {"public" in playlistInfo && playlistInfo.images ? (
                <Image
                  src={playlistInfo.images[0].url}
                  alt={playlistInfo.name + " playlist art"}
                  width={260}
                  height={260}
                  className="rounded-md"
                />
              ) : (
                <Image
                  src={defaultPic}
                  alt={"default playlist art"}
                  width={260}
                  height={260}
                  className="rounded-md"
                />
              )}
              <div className="text-lg">
                <b>{"public" in playlistInfo ? playlistInfo.tracks.total : playlistInfo.total}</b>{" "}
                song
                {"public" in playlistInfo
                  ? playlistInfo.tracks.total > 1 && "s"
                  : playlistInfo.total > 1 && "s"}{" "}
                with <b>{sortedArtists.length}</b> artist{sortedArtists.length > 1 && "s"}
              </div>
            </div>
            <div>
              <div className="mb-6">
                <span className="text-text font-semibold text-lg">Top Artists:</span>
                <ul>
                  {sortedArtists.map((artist) => (
                    <li key={artist}>
                      <span className="text-text">{artist}</span> - {artists[artist]}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-6 lg:mb-0">
                <span className="text-text font-semibold text-lg">Top Genres:</span>
                <ul className="grid grid-cols-2 gap-x-3">
                  {sortedGenres.map((genre) => (
                    <li key={genre}>
                      <span className="">{genre}</span> -{" "}
                      <span className="text-text">{genreCount[genre]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <span className="text-text font-semibold text-lg">Genres of Top Artists:</span>
              {sortedArtists.map((artist) => (
                <div key={`${artist} genre`} className="mb-3">
                  <span className="text-text">{artist}:</span>
                  <ul className="grid grid-cols-2 gap-x-3">
                    {artistGenres[artist].map((genre) => (
                      <li key={artist + genre} className="list-disc ml-5">
                        {genre}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      <div className="flex flex-col mb-3 w-10/12 mx-auto">
        <div className="text-text font-semibold text-2xl -mb-2 mt-6">Overall Mood:</div>
        {avgAudioFeatures && (
          <OverallMood
            features={avgAudioFeatures}
            playlistId={"public" in playlistInfo ? playlistInfo.id : "liked-songs"}
          />
        )}
      </div>
      {addDate &&
        audioFeatures &&
        avgAudioFeatures &&
        artistGenres &&
        artists &&
        Object.keys(artists).length == Object.keys(artistGenres).length && (
          <GeneralTimeOverview
            audioFeaturesDict={audioFeaturesDict}
            addDate={addDate}
            playlistId={"public" in playlistInfo ? playlistInfo.id : "liked-songs"}
            rootMood={avgAudioFeatures}
            artistGenres={artistGenres}
          />
        )}
    </div>
  );
};

export default PlaylistAnalysis;
