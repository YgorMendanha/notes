import { useLocalStorage } from "@/hooks/useLocalStorege";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ImSpinner10 } from "react-icons/im";

export function LogoutModal() {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | undefined>();
  const [userStorage] = useLocalStorage(
    "Y.M.Notes-User",
    {} as { id: number; user: string }
  );

  useEffect(() => {
    setUserName(userStorage.user);
  }, [userStorage]);

  useEffect(() => {
    function handleResize(e: any) {
      var container = document.getElementById("modal");
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
    router.push("/");
  };

  return (
    <>
      <div className="flex ml-auto absolute top-5 right-10 items-center">
        {userName ? (
          <>
            <p className="mr-3 ">
              autor: <b className="text-xl">{userStorage.user}</b>
            </p>
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
