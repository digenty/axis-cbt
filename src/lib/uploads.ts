export async function uploadImage(
  file: File,
  folder?: string,
): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  if (folder) fd.append("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) {
    const { message } = await res
      .json()
      .catch(() => ({ message: "Upload failed" }));
    throw new Error(message ?? "Upload failed");
  }
  const { imageUrl } = (await res.json()) as { imageUrl: string };
  return imageUrl;
}
