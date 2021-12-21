import { useEffect, useState } from "react";
import PlaylistOverview from "./PlaylistOverview";

const PlaylistSelection = ({ session }) => {
  const [playlists, setPlaylists] = useState(null);
  const [playlistInfo, setPlaylistInfo] = useState(null)
  useEffect(() => {
    const getPlaylists = async () => {
      if (!session) {
        return;
      }
      const axios = require("axios");
      const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
        headers: { Authorization: "Bearer " + session.user.accessToken },
      });
      setPlaylists(response.data.items);
    };

    getPlaylists();
  }, [session]);

  const getPlaylist = async (id, total) => {
    let offset = 0;
    if (total > 100) {
      offset = total - 100
    }
    const axios = require("axios");
    const response = await axios.get(id + `?offset=${offset}`, {
      headers: { Authorization: "Bearer " + session.user.accessToken },
    });
    setPlaylistInfo(response.data)
  };

  return (
    <div>
      <h1>Current Playlists</h1>
      <div className="flex overflow-scroll">
        {playlists &&
          playlists.map((playlist) => (
            <button
              key={playlist.id}
              className="p-3 border-2"
              onClick={() => getPlaylist(playlist.tracks.href, playlist.tracks.total)}
            >
              {playlist.name}
            </button>
          ))}
      </div>
      <PlaylistOverview playlistInfo={playlistInfo} />
    </div>
  );
};

export default PlaylistSelection;
