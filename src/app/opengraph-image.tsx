import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Idriss Bhugeloo"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "80px",
                backgroundColor: "#09090b",
                fontFamily: "sans-serif",
            }}
        >
            <p style={{ color: "#71717a", fontSize: 20, margin: 0, marginBottom: 16 }}>
                ibhugeloo.com
            </p>
            <h1 style={{ color: "#fafafa", fontSize: 64, fontWeight: 700, margin: 0, lineHeight: 1.1 }}>
                Idriss Bhugeloo
            </h1>
            <p style={{ color: "#a1a1aa", fontSize: 28, margin: 0, marginTop: 20 }}>
                Ingénieur télécom · Développeur · La Réunion
            </p>
        </div>,
        { width: 1200, height: 630 },
    )
}
