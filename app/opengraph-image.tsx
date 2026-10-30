import { ImageResponse } from "next/og";
import { connection } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Profile } from "@/lib/models";

export const alt = "Haider Ali";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  await connection();
  await connectDB();
  const p = await Profile.findOne().select("headline photo").lean();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 80,
          background: "#101114",
          color: "#f3efe6",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>Haider Ali</div>
          <div style={{ fontSize: 36, marginTop: 28, color: "#ffd23f" }}>{p?.headline || "Full-stack developer"}</div>
        </div>
        {p?.photo && (
          // eslint-disable-next-line @next/next/no-img-element -- satori renders plain <img>
          <img src={p.photo} width={380} height={475} alt="" style={{ objectFit: "cover", borderRadius: 28 }} />
        )}
      </div>
    ),
    size,
  );
}
