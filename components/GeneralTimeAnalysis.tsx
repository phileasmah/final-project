import Image from "next/image";
import { useEffect, useState } from "react";
import { AudioFeature } from "../types/AudioFeatues";
import { ItemsEntity } from "../types/PlaylistType";
import OverallMood from "./OverallMood";
import SongStatistics from "./SongStatistics";

interface Props {
  time: string;
  tracks: ItemsEntity[];
  audioFeaturesDict: { [songId: string]: AudioFeature };
  rootMood: [Features, string][];
  artistGenres: { [id: string]: string[] };
}

type Features = "Acousticness" | "Danceability" | "Energy" | "Liveness" | "Valence";

const GeneralTimeAnalysis: React.FC<Props> = ({ audioFeaturesDict, time, tracks, rootMood, artistGenres }) => {
  const [month, setMonth] = useState<number | undefined>();
  const [year, setYear] = useState("");
  const [avgAudioFeatures, setAvgAudioFeatures] = useState<[Features, string][]>();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    const tmp = time.split(",");
    setMonth(parseInt(tmp[1]));
    setYear(tmp[0]);
  }, [time]);

  useEffect(() => {
    if (!tracks) {
      return;
    }
    const features = [0, 0, 0, 0, 0];
    let total = tracks.length;
    const tmpFeaturesAvg = [
      ["Acousticness"],
      ["Danceability"],
      ["Energy"],
      ["Liveness"],
      ["Valence"],
    ];
    for (let x of tracks) {
      try {
        features[0] += audioFeaturesDict[x.track.id].acousticness;
        features[1] += audioFeaturesDict[x.track.id].danceability;
        features[2] += audioFeaturesDict[x.track.id].energy;
        features[3] += audioFeaturesDict[x.track.id].liveness;
        features[4] += audioFeaturesDict[x.track.id].valence;
      } catch {
        total--;
      }
    }
    for (let i = 0; i < features.length; i++) {
      tmpFeaturesAvg[i].push(Math.round((features[i] / total) * 100).toString() + "%");
    }
    setAvgAudioFeatures(tmpFeaturesAvg as [Features, string][]);
  }, [audioFeaturesDict, tracks]);

  return (
    <div>
      {tracks && (
        <div className="flex flex-col mx-auto mt-5">
          {month || month == 0 ? (
            <div>
              <div className="inline-block border text-text text-lg font-medium bg-lightgrey3 border-lightgrey2 px-3 py-0.5 rounded-xl mb-2">
                {months[month] + " " + year}
              </div>
            </div>
          ) : (
            <> </>
          )}
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 mb-3">
              <div>{<SongStatistics tracks={tracks} unique={time} artistGenres={artistGenres}/>}</div>
              {avgAudioFeatures && (
                <OverallMood features={avgAudioFeatures} playlistId={time} rootMood={rootMood} />
              )}
            </div>
          </div>
          <div className="text-lg">
            You added <span className="text-text font-medium">{tracks.length}</span> songs this
            period:
          </div>
          <div className="border border-darkgrey2 rounded-lg">
            <div className="grid grid-cols-10 py-3 border-b shadow-custom border-darkgrey2 font-medium">
              <span className="col-span-1 my-auto ml-3 lg:ml-5">#</span>
              <div className="col-span-6 sm:col-span-4 my-auto mr-3 md:mr-2 ml-2">
                <span>Title</span>
              </div>
              <div className="hidden sm:block col-span-4 my-auto mr-3 md:mr-2 ml-2">
                <span>Album</span>
              </div>
              <div className="col-span-3 sm:col-span-1 my-auto font-medium ml-1 sm:-ml-2">
                Date Added
              </div>
            </div>
            <ul className="overflow-auto max-h-72">
              {tracks.map((track, idx) => (
                <li
                  key={track.track.id + idx + time}
                  className={`grid grid-cols-10 py-3 border-r border-lightgrey2 ${
                    idx % 2 !== 0 && "border"
                  }`}
                >
                  <span className="col-span-1 my-auto ml-3 lg:ml-5">{idx + 1}</span>
                  <div className="flex items-center col-span-6 sm:col-span-4 my-auto mr-3 md:mr-2 ml-2">
                    <div className="flex flex-none itmes-center">
                      {track.track.album.images && (
                        <Image
                          src={track.track.album.images[track.track.album.images.length - 1].url}
                          alt={track.track.album.name + " playlist art"}
                          width={41}
                          height={41}
                        />
                      )}
                    </div>
                    <div className="ml-4">
                      <span className="text-text font-semibold">{track.track.name}</span>
                      <div>
                        {track.track.artists[0].name}
                        {track.track.artists.length > 1 &&
                          track.track.artists
                            .slice(1)
                            .map((artist) => <span key={artist.id}>, {artist.name}</span>)}
                      </div>
                    </div>
                  </div>
                  <div className="hidden col-span-4 my-auto mr-3 md:mr-2 ml-2 sm:block">
                    <span className="font-semibold">{track.track.album.name}</span>
                    <div className="text-darkgrey2">
                      {track.track.album.artists[0].name}
                      {track.track.album.artists.length > 1 &&
                        track.track.album.artists
                          .slice(1)
                          .map((artist) => <span key={artist.id}>, {artist.name}</span>)}
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-1 my-auto font-medium ml-1 sm:-ml-2">
                    {(month ? months[month] : months[Number(track.added_at.slice(5, 7))-1]) + " " + track.added_at.slice(8, 10) + ", " + year}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralTimeAnalysis;
