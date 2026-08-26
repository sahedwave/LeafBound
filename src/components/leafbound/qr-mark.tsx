import { useMemo } from "react";
import { encode } from "uqr";

export function QrMark({ value, label }: { value: string; label?: string }) {
  const { size, d } = useMemo(() => {
    const qr = encode(value, { ecc: "M", border: 2 });
    const parts: string[] = [];
    for (let y = 0; y < qr.size; y++) {
      for (let x = 0; x < qr.size; x++) {
        if (qr.data[y][x]) parts.push(`M${x} ${y}h1v1h-1z`);
      }
    }
    return { size: qr.size, d: parts.join("") };
  }, [value]);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="sh-qr"
      role="img"
      aria-label={label ?? "QR code"}
      shapeRendering="crispEdges"
    >
      <rect className="sh-qr-bg" width={size} height={size} />
      <path className="sh-qr-fg" d={d} />
    </svg>
  );
}
