import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import defaultPic from "../public/default-playlist-pic-min.png";
import { Artist } from "../types/Artist";
import { AudioFeature } from "../types/AudioFeatues";
import { ItemsEntity, LikedSongs, Playlist } from "../types/PlaylistType";
import GeneralTimeOverview from "./GeneralTimeOverview";
import GenreColour from "./GenreColour";
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

type Features = "Acousticness" | "Danceability" | "Energy" | "Instrumentalness" | "Valence";

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
          Authorization: "Bearer " + `${session}`,
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
      setTopGenres(
        Object.keys(artistGenreCount)
          .sort((a, b) => artistGenreCount[b] - artistGenreCount[a])
          .slice(0, 20)
      );
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

    setTopArtists(
      Object.keys(tmpArtists)
        .sort((a, b) => tmpArtists[b] - tmpArtists[a])
        .slice(0, 6)
    );
    setAddDate(tmpDict);
    setArtists(tmpArtists);
    setArtistGenres(tmpArtistGenres);
    setGenreCount(tmpArtistGenreCount);
  }, [trackInfo, session, clientToken]);

  useEffect(() => {
    const tmpAudioFeaturesDict: { [songId: string]: AudioFeature } = {};
    const features = [0, 0, 0, 0, 0];
    let total = audioFeatures.length;
    const tmpFeaturesAvg = [
      ["Acousticness"],
      ["Danceability"],
      ["Energy"],
      ["Instrumentalness"],
      ["Valence"],
    ];
    for (let x of audioFeatures) {
      try {
        tmpAudioFeaturesDict[x.id] = x;
        features[0] += x.acousticness;
        features[1] += x.danceability;
        features[2] += x.energy;
        features[3] += x.instrumentalness;
        features[4] += x.valence;
      } catch {
        total--;
      }
    }
    for (let i = 0; i < features.length; i++) {
      tmpFeaturesAvg[i].push(Math.round((features[i] / total) * 100).toString() + "%");
    }
    setAudioFeaturesDict(tmpAudioFeaturesDict);
    setAvgAudioFeatures(tmpFeaturesAvg as [Features, string][]);
  }, [audioFeatures]);

  return (
    <div className="flex flex-col align-middle justify-center max-w-8xl mx-auto">
      <h1 className="text-center text-4xl my-8">
        <b>{"public" in playlistInfo ? playlistInfo.name : "Liked Songs"}</b>
      </h1>
      {topArtists &&
        artists &&
        artistGenres &&
        Object.keys(artists).length === Object.keys(artistGenres).length &&
        genreCount &&
        topGenres && (
          <div className="w-11/12 xl:w-10/12 mx-auto flex flex-col lg:flex-row justify-between">
            <div className="w-70 mx-auto lg:mx-0">
              <div className="ml-1">
                {"public" in playlistInfo && playlistInfo.images ? (
                  <Image
                    src={playlistInfo.images[0].url}
                    alt={playlistInfo.name + " playlist art"}
                    width={271}
                    height={271}
                    className="rounded-md"
                  />
                ) : (
                  <Image
                    src={defaultPic}
                    alt={"default playlist art"}
                    width={271}
                    height={271}
                    className="rounded-md"
                  />
                )}
                <div className="text-lg">
                  <b>{"public" in playlistInfo ? playlistInfo.tracks.total : playlistInfo.total}</b>{" "}
                  song
                  {"public" in playlistInfo
                    ? playlistInfo.tracks.total > 1 && "s"
                    : playlistInfo.total > 1 && "s"}{" "}
                  with <b>{Object.keys(artists).length}</b> artist
                  {Object.keys(artists).length > 1 && "s"}
                </div>
              </div>
              <div className="bg-darkgrey3 rounded-3xl py-4 pl-6 mt-2">
                <div className="font-semibold text-text text-2xl mb-2">Genre Colours</div>
                <div className="text-white flex align-middle flex-wrap font-semibold gap-x-2.5">
                  <div className="my-2">
                    <span className="bg-folk rounded-full text-center px-3 py-1.5">Folk</span>
                  </div>
                  <div className="my-2 text-darkgrey ">
                    <span className="bg-country rounded-full text-center px-3 py-1.5">Country</span>
                  </div>
                  <div className="my-2">
                    <span className="bg-rock rounded-full text-center px-3 py-1.5"> Rock</span>
                  </div>
                  <div className="my-2 text-darkgrey">
                    <span className="bg-indie rounded-full text-center px-3 py-1.5">
                      Indie, Alternative
                    </span>
                  </div>
                  <div className="my-2">
                    <span className="bg-pop rounded-full text-center px-3 py-1.5">Pop</span>
                  </div>
                  <div className="my-2 text-darkgrey">
                    <span className="bg-rap rounded-full text-center px-3 py-1.5">
                      {" "}
                      Rap, Hip Hop
                    </span>
                  </div>
                  <div className="my-2 text-darkgrey">
                    <span className="bg-metal rounded-full text-center px-3 py-1.5"> Metal</span>
                  </div>
                  <div className="my-2 ">
                    <span className="bg-electronic rounded-full text-center px-3 py-1.5">
                      Electronic, EDM, House
                    </span>
                  </div>
                  <div className="my-2 text-darkgrey">
                    <span className="bg-classical rounded-full text-center px-3 py-1.5">
                      Classical
                    </span>
                  </div>
                  <div className="my-2">
                    <span className="bg-jazz rounded-full text-center px-3 py-1.5"> Jazz</span>
                  </div>
                  <div className="my-2 text-darkgrey">
                    <span className="bg-soul rounded-full text-center px-3 py-1.5"> Soul, R&B</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-6">
                <span className="text-text font-semibold text-2xl">Top Artists</span>
                <hr className="my-1.5 border-lightgrey2" />
                <ul className="grid grid-cols-2">
                  {topArtists.map((artist) => (
                    <li key={artist}>
                      <span className="text-text font-semibold">{artist}</span> - {artists[artist]}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-6 lg:mb-0">
                <span className="text-text font-semibold text-2xl">Top Genres</span>
                <hr className="my-1.5 border-lightgrey2" />
                <ul className="grid grid-cols-2 gap-x-3">
                  {topGenres.map((genre) => (
                    <li key={genre} className="w-max">
                      <GenreColour genre={genre} quantity={genreCount[genre]} />{" "}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <span className="text-text font-semibold text-2xl">Genres of Top Artists</span>
              <hr className="my-1.5 border-lightgrey2" />
              {topArtists.map((artist) => (
                <div key={`${artist} genre`} className="mb-3">
                  <span className="text-text font-semibold">{artist}:</span>
                  <ul className="grid grid-cols-2 gap-x-3">
                    {artistGenres[artist].map((genre) => (
                      <li key={artist + genre}>
                        <GenreColour genre={genre} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      <div className="flex flex-col mb-3 w-10/12 mx-auto">
        <div className="text-text font-semibold text-3xl mt-6">Overall Mood</div>
        <hr className="my-2 border-lightgrey2" />
        {avgAudioFeatures && (
          <OverallMood
            overallFeatures={avgAudioFeatures}
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
