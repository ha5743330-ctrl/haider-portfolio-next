export type Item = { _id: string; [k: string]: unknown };

// first failing Zod issue per field name, e.g. { title: "Too small" }
export type Errors = Record<string, string>;

// JSON helper. A 401 means the session expired, so go back to the login page.
export async function api<T = unknown>(method: string, path: string, body?: unknown) {
  let res: Response;
  try {
    res = await fetch(path, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    return { ok: false, status: 0, data: null as T, errors: {} as Errors, message: "Network error. Please try again." };
  }
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- full reload also drops stale state
  if (res.status === 401) window.location.href = "/admin/login";
  const json = await res.json().catch(() => null);
  const errors: Errors = {};
  for (const i of json?.issues ?? []) errors[String(i.path?.[0] ?? "_")] ??= i.message;
  return { ok: res.ok, status: res.status, data: json as T, errors, message: res.ok ? "" : json?.error || "Something went wrong" };
}
