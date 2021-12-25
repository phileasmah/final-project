import { signIn, signOut, useSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const NavBar = () => {
  const [scroll, setScroll] = useState(false);
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (document.scrollingElement === null) return;
      if (document.scrollingElement.scrollTop > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    document.addEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav
      className={`${!session && router.asPath === "/" && "hidden"} sticky top-0 bg-darkgrey z-10 ${
        !scroll && "border-lightgrey2 border-b-2"
      }`}
    >
      <div className={`flex h-16 items-center ${scroll && "shadow-custom"} px-6 lg:px-10`}>
        <Link href={{ pathname: "/" }}>
          <a
            className="px-2 pt-1.5 pb-2 duration-200 text-text font-medium text-xl focus:underline rounded-xl"
            tabIndex={1}
          >
            Home
          </a>
        </Link>
        <div className="flex ml-auto">
          {session ? (
            <button
              onClick={() => signOut()}
              className="hover:bg-lightgrey px-4 py-2 text-text font-medium border border-lightgrey2 rounded duration-200 focus:bg-lightgrey3"
              tabIndex={4}
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => signIn("spotify")}
              className="px-2.5 md:px-4 py-2 font-medium bg-spotify1 rounded text-darkgrey duration-200 hover:bg-spotify2 focus:bg-spotify3 hover:rounded-2xl focus:rounded-2xl"
            >
              Sign in with <b className="text-darkgrey">Spotify</b>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
