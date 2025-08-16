import { getDictionary } from "@/dictionary";
import { useLocalStorage } from "@/hooks/useLocalStorege";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ImSpinner10 } from "react-icons/im";

export function LogoutModal() {
  const { lang }: any = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | undefined>();
  const dict = getDictionary(lang);
  const [userStorage] = useLocalStorage(
    "Y.M.Notes-User",
    {} as { id: number; user: string }
  );

  useEffect(() => {
    setUserName(userStorage.user);
  }, [userStorage]);

  useEffect(() => {
    function handleResize(e: any) {
      const container = document.getElementById("modal");
      if (!container?.contains(e.target)) {
        setOpen(false);
      }
    }
    window.addEventListener("mouseup", handleResize);
    return () => {
      window.removeEventListener("mouseup", handleResize);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("Y.M.Notes-User");
    return lang === "pt" ? router.push("/") : router.push("/en");
  };

  return (
    <>
      <div className="flex ml-auto absolute top-5 right-10 items-center">
        {userName ? (
          <>
            <p>
              {dict.author}: <b className="text-xl">{userStorage.user}</b>
            </p>

            <select
              onChange={(e) => {
                if (e.target.value === "pt-BR") {
                  if (pathname.split("/")[1] === "en") {
                    const newUrl = pathname.split("/").slice(2).join("/");
                    return router.push(`/${newUrl}`);
                  }
                }
                return router.push(`/en/${pathname}`);
              }}
              value={lang === "en" ? "en-US" : "pt-BR"}
              className="text-xs border-2 text-end appearance-none rounded outline-10 outline-indigo-500 cursor-pointer p-1 mx-5"
            >
              <option value="pt-BR">pt-BR</option>
              <option value="en-US">en-US</option>
            </select>

            <button
              className="py-2 px-5 rounded-lg bg-indigo-700"
              onClick={() => setOpen(true)}
            >
              sair
            </button>
          </>
        ) : (
          <ImSpinner10 className="animate-spin text-4xl mx-auto" />
        )}
      </div>

      {open && (
        <div
          id="modal"
          className="absolute z-50 h-screen w-[100%] bg-[#000000b8] top-0 left-0 flex m-auto"
        >
          <section className="m-auto bg-indigo-700 flex flex-col p-5 rounded-lg w-[500px] max-w-[90vw] ">
            <p>Deseja sair?</p>
            <p>Voce não podera mais apagar seus posts!</p>
            <div className="flex mt-6">
              <button
                className="py-2 px-5 rounded-lg bg-indigo-400"
                onClick={() => setOpen(false)}
              >
                Voltar
              </button>
              <button
                type="button"
                className="py-2 px-5 rounded-lg ml-5  bg-red-500"
                onClick={logout}
              >
                Continuar
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
