import { useLocalStorage } from "@/hooks/useLocalStorege";
import { useState } from "react";
import { Post } from "@/server/post";
import moment from "moment";
import { BsFillTrash3Fill } from "react-icons/bs";

import "moment/locale/pt-br";
import { ImSpinner10 } from "react-icons/im";
export function CardPost({
  post,
  getPosts,
}: {
  post: {
    id: number;
    title: string;
    content: string;
    authorId: number;
    author: { id: number; user: string };
    createdAt: Date;
  };
  getPosts: () => Promise<void>;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const [userStorage] = useLocalStorage(
    "Y.M.Notes-User",
    {} as { id: number; user: string }
  );

  async function deletePost() {
    setLoading(true);
    await Post.Delete(post.id);
    getPosts();
    setLoading(false);
  }

  return (
    <section className="flex w-[80vw] max-w-[800px] flex-col  bg-indigo-900 p-10 rounded-lg mt-10">
      <h1 className="text-2xl flex w-full justify-between">
        <b>{post.title[0].toUpperCase() + post.title.substring(1)}</b>
        {userStorage.id === post.author.id && (
          <>
            {loading ? (
              <ImSpinner10 className="animate-spin text-2xl text-red-500" />
            ) : (
              <BsFillTrash3Fill
                onClick={() => deletePost()}
                className="text-red-500 cursor-pointer"
              />
            )}
          </>
        )}
      </h1>
      <small>autor: {post.author.user}</small>
      <small className="mb-5 ">{moment(post.createdAt).fromNow()}</small>

      <p>{post.content}</p>
    </section>
  );
}
