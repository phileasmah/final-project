import { Provider } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { useEffect, useMemo, useState } from "react";
import "tailwindcss/tailwind.css";
import { ApiContext } from "../components/Contexts/ApiContext";

function MyApp({ Component, pageProps }) {
  const axios = require("axios");
  useEffect(() => {
    const getToken = async () => {
      const res = await axios({
        url: "api/connect",
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      });
      setClientToken(res.data);
      setFinish(true);
      setTimeout(getToken, 3500000);
    };
    getToken();
  }, []);

  const [clientToken, setClientToken] = useState(null);
  const [finish, setFinish] = useState(false);
  const router = useRouter();

  const providerToken = useMemo(
    () => ({ clientToken, setClientToken, finish }),
    [clientToken, setClientToken, finish]
  );

  return (
    <ApiContext.Provider value={providerToken}>
      <Provider session={pageProps.session}>
        <Component {...pageProps} key={router.asPath} />
      </Provider>
    </ApiContext.Provider>
  );
}

export default MyApp;
