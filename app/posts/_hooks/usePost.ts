import useAuth from "@/shared/hooks/useAuth";
import useOrbis from "@/shared/hooks/useOrbis";
import { models } from "@/shared/orbis";
import { PostStatus } from "@/shared/schema/post";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Level } from "@tiptap/extension-heading";
import { catchError } from "@useorbis/db-sdk/util";
import { produce } from "immer";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

export type PostHeadingTagName = "h2" | "h3" | "h4" | "h5" | "h6";
export type PostHeadingViewportPosition = "above" | "below" | "in-view";
export type PostHeading = {
  tagName: PostHeadingTagName;
  level: Level;
  textContent: string;
  id: string;
  viewportPosition?: PostHeadingViewportPosition;
};

const usePost = () => {
  const router = useRouter();

  const params = useParams();
  const postId = params.postId;

  const { db } = useOrbis();
  const { connectOrbis } = useAuth();

  const queryClient = useQueryClient();

  const fetchPost = async () => {
    if (!postId) throw new Error("Cannot fetch post without postId");
    const selectStatement = db?.select().from(models.posts).where({
      stream_id: postId,
    });
    const [result, error] = await catchError(() => selectStatement?.run());
    if (error) throw new Error(`Error while fetching post: ${error}`);
    if (!result?.rows.length)
      throw new Error(`Error while fetching post: Post not found`);
    const post = result.rows[0];
    return post;
  };

  const postQuery = useQuery({
    queryKey: ["post", { postId }],
    queryFn: fetchPost,
  });

  const deletePost = async (postId: string) => {
    // Orbis does not support delete statements yet
    // To delete a post change the deleted field to true
    if (!db) return;
    await connectOrbis(); // Does nothing if user is already connected
    if (!db.getConnectedUser()) {
      throw new Error("Cannot create a post without connection to orbis");
    }

    const insertStatement = db
      .update(postId)
      .set({ status: "deleted" as PostStatus });
    const [result, error] = await catchError(() => insertStatement.run());
    if (error) throw new Error(`Error during create post query: ${error}`);
    if (!result) throw new Error("No result was returned from orbis");
    return result;
  };

  const deletePostMutation = useMutation({
    mutationKey: ["delete-post"],
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.setQueryData(["post", { postId }], (post: any) => ({
        ...post,
        status: "deleted",
      }));
      queryClient.removeQueries({
        queryKey: ["post", { postId }],
        exact: true,
      });
      router.push("/");
    },
  });

  const postHeadingsQuery = useQuery({
    queryKey: ["post-headings", { postId }],
    initialData: [] as PostHeading[],
    enabled: false,
  });

  const addPostHeading = useCallback(
    (postHeading: PostHeading) => {
      const queryKey = ["post-headings", { postId }];
      const existingHeadings: PostHeading[] | undefined =
        queryClient.getQueryData(queryKey);
      const alreadyAdded = !!existingHeadings?.find(
        (h) => h.id === postHeading.id,
      );
      if (!alreadyAdded) {
        queryClient.setQueryData(
          queryKey,
          produce((draft?: PostHeading[]) => {
            if (Array.isArray(draft)) draft.push(postHeading);
          }),
        );
      }
    },
    [queryClient],
  );

  const updateHeadingViewportPosition = useCallback(
    ({
      id,
      viewportPosition,
    }: {
      id: string;
      viewportPosition: PostHeadingViewportPosition;
    }) => {
      const queryKey = ["post-headings", { postId }];
      queryClient.setQueryData(
        queryKey,
        produce((draft?: PostHeading[]) => {
          if (Array.isArray(draft)) {
            const heading = draft.find((h) => h.id === id);
            if (heading) heading.viewportPosition = viewportPosition;
          }
        }),
      );
    },
    [queryClient],
  );

  const postHeadings = postHeadingsQuery.data;
  const activePostHeadingId = useMemo(() => {
    const inViewHeading = postHeadings.find(
      (heading) => heading.viewportPosition === "in-view",
    );
    if (inViewHeading) {
      return inViewHeading.id;
    }

    const aboveHeadings = postHeadings.filter(
      (heading) => heading.viewportPosition === "above",
    );
    if (aboveHeadings.length > 0) {
      return aboveHeadings[aboveHeadings.length - 1].id;
    }

    return null; // or some fallback value if no headings match the criteria
  }, [postHeadings]);

  return {
    postQuery,
    deletePostMutation,
    postHeadingsQuery,
    postHeadings,
    activePostHeadingId,
    addPostHeading,
    updateHeadingViewportPosition,
  };
};

export default usePost;
