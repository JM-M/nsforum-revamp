import PostList from "@/shared/components/PostList";
import useUser from "@/shared/hooks/useUser";

type Props = { did: string };
const Posts = ({ did }: Props) => {
  const { user } = useUser({ did });
  if (!user) return null;
  const { controller } = user;
  return (
    <PostList
      fetchPostsOptions={{ filter: { controller, status: "published" } }}
    />
  );
};
export default Posts;
