export async function featchApi<T = Response>(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) {
  var url = "http://localhost:3000";
  if (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_SITE_URL)
    url = process.env.NEXT_PUBLIC_SITE_URL;

  const data = await fetch(`${url}${input}`, {
    ...init,
    headers: {
      Authentication: `Bearer ${Buffer.from(
        process.env.NEXT_PUBLIC_TOKEN!
      ).toString("base64")}`,
    },
  });
  const result = data.json();

  return result as T;
}
