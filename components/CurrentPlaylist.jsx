import { useEffect, useState } from "react";

const CurrentPlaylist = ({ session }) => {
  const [playlists, setPlaylists] = useState(null);

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
    const offset = total - 100
    const axios = require("axios");
    const response = await axios.get(id + `?offset=${offset}`, {
      headers: { Authorization: "Bearer " + session.user.accessToken },
    });
    console.log(response);
  };

  console.log(playlists);
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
    </div>
  );
};

export default CurrentPlaylist;
