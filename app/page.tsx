import PostFilters from "@/shared/components/PostFilters";
import PostList from "@/shared/components/PostList";
import { Button } from "@/shared/components/ui/button";
import { slugToString } from "@/shared/lib/utils";
import { fetchPosts } from "@/shared/orbis/queries";
import { OrbisDBRow } from "@/shared/types";
import { Post } from "@/shared/types/post";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { like } from "@useorbis/db-sdk/operators";
import { isNil, omitBy } from "lodash-es";
import Link from "next/link";
import Header from "./_components/Header";
import { config } from "./_providers/react-query/config";

type Props = {
  searchParams: {
    category: string;
    [key: string]: string | string[] | undefined;
  };
};
const HomePage = async ({ searchParams }: Props) => {
  const { category, sortBy } = searchParams;
  const filter = omitBy(
    {
      category: category ? like(slugToString(category)) : undefined,
    },
    isNil,
  );

  const orderBy: [keyof OrbisDBRow<Post>, "asc" | "desc"][] | undefined =
    sortBy === "newest"
      ? [["indexed_at", "desc"]]
      : sortBy === "oldest"
        ? [["indexed_at", "asc"]]
        : undefined;

  const queryClient = new QueryClient(config);

  await queryClient.prefetchInfiniteQuery({
    initialPageParam: 0,
    queryKey: ["posts"],
    queryFn: ({ pageParam }) =>
      fetchPosts({ page: pageParam, filter, orderBy }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Header />
      <section className="container mb-10">
        <div className="mx-auto max-w-2xl">
          <div className="xs:ml-0 xs:flex-row xs:justify-between mb-5 ml-auto flex flex-col items-end gap-5">
            <PostFilters />
            <Button size="sm" asChild>
              <Link href="/posts/new">Create Post</Link>
            </Button>
          </div>
          <PostList fetchPostsOptions={{ filter, orderBy }} />
        </div>
      </section>
    </HydrationBoundary>
  );
};

export default HomePage;
