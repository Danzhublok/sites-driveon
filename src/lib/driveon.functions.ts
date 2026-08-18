import { createServerFn } from "@tanstack/react-start";

export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const { loadCatalog } = await import("./driveon.server");
  return await loadCatalog();
});