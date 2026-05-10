import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;

const EXT_FROM_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

function safeFolder(input: string | null): string {
  if (!input) return "cbt/questions";
  const trimmed = input.replace(/^\/+|\/+$/g, "");
  if (!/^[a-z0-9/_-]+$/i.test(trimmed)) return "cbt/questions";
  return trimmed;
}

export async function POST(req: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const region = process.env.DIGITAL_OCEAN_SPACES_REGION;
  const bucket = process.env.DIGITAL_OCEAN_SPACES_BUCKET;
  const accessKeyId = process.env.DIGITAL_OCEAN_SPACES_KEY;
  const secretAccessKey = process.env.DIGITAL_OCEAN_SPACES_SECRET;
  if (!region || !bucket || !accessKeyId || !secretAccessKey) {
    return NextResponse.json(
      { message: "Storage not configured" },
      { status: 500 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ message: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { message: "Only image uploads are allowed" },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { message: "Image must be 5MB or smaller" },
      { status: 400 },
    );
  }

  const folder = safeFolder(form.get("folder")?.toString() ?? null);
  const ext =
    EXT_FROM_MIME[file.type] ??
    (file.name.includes(".") ? file.name.split(".").pop() : "bin");
  const key = `${folder}/${crypto.randomUUID()}.${ext}`;

  const client = new S3Client({
    region,
    endpoint: `https://${region}.digitaloceanspaces.com`,
    forcePathStyle: false,
    credentials: { accessKeyId, secretAccessKey },
  });

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
        ACL: "public-read",
      }),
    );
  } catch (err) {
    console.error("Upload failed", err);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }

  const imageUrl = `https://${bucket}.${region}.digitaloceanspaces.com/${key}`;
  return NextResponse.json({ imageUrl });
}
