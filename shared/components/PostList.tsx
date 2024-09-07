"use client";

import PostCard from "@/shared/components/PostCard";
import { Button } from "@/shared/components/ui/button";
import { InfiniteScroll } from "@/shared/components/ui/infinite-scroll";
import usePostList from "@/shared/hooks/usePostList";
import { FetchPostsOptions } from "@/shared/orbis/queries";
import { ReactNode } from "react";

type Props = {
  fetchPostsOptions?: FetchPostsOptions;
  emptyContent?: ReactNode;
};
const PostList = ({ fetchPostsOptions, emptyContent }: Props) => {
  const { postListQuery } = usePostList({ fetchPostsOptions });
  const { hasNextPage, isLoading, fetchNextPage } = postListQuery;
  const posts = postListQuery.data?.pages.map((page) => page).flat() || [];

  return (
    <div>
      <ul>
        {posts.map((post, i) => {
          return (
            <li key={i} className="mb-5">
              <PostCard post={post} />
            </li>
          );
        })}
      </ul>
      <InfiniteScroll
        hasMore={hasNextPage}
        isLoading={isLoading}
        next={fetchNextPage}
        threshold={1}
      >
        {isLoading && (
          <Button
            variant="ghost"
            className="mx-auto flex gap-2"
            loading={true}
            loadingText="Loading..."
            loaderProps={{ className: "text-primary" }}
          />
        )}
      </InfiniteScroll>
      {!posts.length &&
        !isLoading &&
        (emptyContent || (
          <div className="py-10 text-center text-neutral-500">
            No post found
          </div>
        ))}
    </div>
  );
};
export default PostList;
