"use client";

import { Post } from "@/server/post";
import { FormCreatePost } from "./components/form";
import { CardPost } from "./components/card";
import { useCallback, useState, useEffect } from "react";
import { ImSpinner10 } from "react-icons/im";

export default function Posts() {
  const [posts, setPosts] = useState([]);

  const getPosts = useCallback(async () => {
    const response = await Post.Get();
    setPosts(response.data);
  }, []);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <FormCreatePost getPosts={getPosts} />

      {posts.length > 0 ? (
        posts.map(
          (post: {
            id: number;
            title: string;
            content: string;
            authorId: number;
            author: { id: number; user: string };
            createdAt: Date;
          }) => <CardPost getPosts={getPosts} post={post} key={post.id} />
        )
      ) : (
        <ImSpinner10 className="animate-spin text-5xl m-auto" />
      )}
    </main>
  );
}
