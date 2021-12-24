import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";

interface URLProps extends ParsedUrlQuery {
  username: string;
}

interface Props {
  // userProfileInfo: UserProfileArr | null;
}

export const getServerSideProps: GetServerSideProps<{}, URLProps> = async (context) => {
  const data = await context.query
  console.log(data)
  return {
    props: { data },
  };
};

const PlaylistProfile: React.FC<Props> = ({ data }) => {
  console.log(data)
  return (
    <div>

    </div>
  );
};

export default PlaylistProfile;
