"use client";

import { useLocalStorage } from "@/hooks/useLocalStorege";
import { User } from "@/server/user";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { ImSpinner10 } from "react-icons/im";
import { toast } from "react-toastify";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [userStorage, setUserStorage] = useLocalStorage(
    "Y.M.Notes-User",
    {} as { id: number; user: string }
  );

  useEffect(() => {
    userStorage.id && router.push("/posts");
  }, [userStorage, router]);

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.current) return;
    setLoading(true);
    if (input.current.value.length > 0) {
      const user = await User.Create({
        user: input.current.value,
      });
      if (user.data.id) {
        setUserStorage(user.data);
      }
    } else {
      toast.info("Insira um usuario");
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5">
      <form
        onSubmit={(e) => createUser(e)}
        className="flex flex-col bg-indigo-950 p-7 rounded-lg max-w-[80vw]"
      >
        <label>
          <p>Nome de usuario</p>
          <input
            ref={input}
            className="p-2 w-full rounded-lg bg-indigo-900"
            placeholder="user"
          />
        </label>

        <button type="submit" className="mt-6 p-2 rounded-lg bg-indigo-700">
          {loading ? (
            <ImSpinner10 className="animate-spin text-2xl mx-auto" />
          ) : (
            "entrar"
          )}
        </button>
      </form>
    </main>
  );
}
