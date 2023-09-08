import { useLocalStorage } from "@/hooks/useLocalStorege";
import { Post } from "@/server/post";
import { useParams, useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ImSpinner10 } from "react-icons/im";
import { LogoutModal } from "../logoutModal";
import { getDictionary } from "@/dictionary";

export function FormCreatePost({
  getPosts,
}: {
  getPosts: () => Promise<void>;
}) {
  const router = useRouter();
  const { lang }: any = useParams();
  const formRef = useRef<HTMLFormElement>(null);
  const title = useRef<HTMLInputElement>(null);
  const content = useRef<HTMLTextAreaElement>(null);
  const dict = getDictionary(lang);
  const [loading, setLoading] = useState<boolean>(false);

  const [userStorage] = useLocalStorage(
    "Y.M.Notes-User",
    {} as { id: number; user: string }
  );

  useEffect(() => {
    if (!userStorage.id) {
      return lang === "pt" ? router.push("/posts") : router.push("/en/posts");
    }
  }, [userStorage, router, lang]);

  const createPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.current || !content.current) return;
    setLoading(true);
    await Post.Create({
      authorId: userStorage.id,
      content: content.current.value,
      title: title.current.value,
    });
    getPosts();
    formRef.current?.reset();
    setLoading(false);
  };

  return (
    <>
      <LogoutModal />
      <form
        ref={formRef}
        onSubmit={(e) => createPost(e)}
        className="flex flex-col w-[80vw] max-w-[500px] bg-indigo-950 p-10 rounded-lg mt-[25vh]"
      >
        <label>
          <p>{dict.postTitle}</p>
          <input
            ref={title}
            className="p-2 w-full rounded-lg bg-indigo-900"
            placeholder={dict.title}
          />
        </label>
        <label className="my-6">
          <p>Post</p>
          <textarea
            ref={content}
            className="p-2 w-full rounded-lg bg-indigo-900"
          />
        </label>

        <button type="submit" className="p-2 rounded-lg bg-indigo-700">
          {loading ? (
            <ImSpinner10 className="animate-spin text-2xl mx-auto" />
          ) : (
            dict.toSave
          )}
        </button>
      </form>
    </>
  );
}
