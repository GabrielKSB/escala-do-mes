import { ImageResponse } from "next/og";
import { Simbolo } from "@/components/Logo";

export const dynamic = "force-static";

const TIPOS = ["5x2", "6x1", "4x2", "12x36"];

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 96px",
          background: "radial-gradient(70% 60% at 30% 0%, rgba(94, 230, 200, 0.16), #090c0b 70%)",
          backgroundColor: "#090c0b",
          color: "#e6ecea",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Simbolo tamanho={72} />
            <span style={{ fontSize: 44, fontWeight: 600 }}>Escala do Mês</span>
          </div>
          <div style={{ marginTop: 48, fontSize: 64, fontWeight: 600, lineHeight: 1.1, letterSpacing: -1 }}>
            A escala de trabalho do mês pronta em um minuto
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
            {TIPOS.map((tipo) => (
              <span
                key={tipo}
                style={{
                  padding: "8px 20px",
                  borderRadius: 999,
                  border: "2px solid #222a27",
                  backgroundColor: "#101513",
                  fontSize: 28,
                  color: "#5ee6c8",
                }}
              >
                {tipo}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 28, fontSize: 28, color: "#8b9893" }}>Grátis e sem cadastro</div>
        </div>
        <Simbolo tamanho={340} />
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
