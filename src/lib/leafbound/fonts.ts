export type StyleId = "gothic" | "double" | "serif" | "squiggle" | "plain";

function buildMap(
  baseUpper: number | null,
  baseLower: number | null,
  baseDigit: number | null,
) {
  const map: Record<string, string> = {};
  for (let i = 0; i < 26; i++) {
    if (baseUpper != null) map[String.fromCharCode(65 + i)] = String.fromCodePoint(baseUpper + i);
    if (baseLower != null) map[String.fromCharCode(97 + i)] = String.fromCodePoint(baseLower + i);
  }
  if (baseDigit != null) {
    for (let i = 0; i < 10; i++) {
      map[String.fromCharCode(48 + i)] = String.fromCodePoint(baseDigit + i);
    }
  }
  return map;
}

const FRAKTUR_BOLD = buildMap(0x1d56c, 0x1d586, null);
const DOUBLE_STRUCK = buildMap(0x1d538, 0x1d552, 0x1d7d8);
const DS_EXC: Record<string, number> = {
  C: 0x2102,
  H: 0x210d,
  N: 0x2115,
  P: 0x2119,
  Q: 0x211a,
  R: 0x211d,
  Z: 0x2124,
};
for (const k of Object.keys(DS_EXC)) {
  DOUBLE_STRUCK[k] = String.fromCodePoint(DS_EXC[k]);
}
const BOLD_SERIF = buildMap(0x1d400, 0x1d41a, 0x1d7ce);
const BOLD_SCRIPT = buildMap(0x1d4d0, 0x1d4ea, null);

function convert(text: string, map: Record<string, string>) {
  let out = "";
  for (const ch of text) out += map[ch] !== undefined ? map[ch] : ch;
  return out;
}

export const TEXT_STYLES: {
  id: StyleId;
  label: string;
  sample: string;
  apply: (t: string) => string;
}[] = [
  { id: "gothic", label: "Gothic / Blackletter", sample: "Dream Plan", apply: (t) => convert(t, FRAKTUR_BOLD) },
  { id: "double", label: "Double-Struck / Outline", sample: "Dream Plan", apply: (t) => convert(t, DOUBLE_STRUCK) },
  { id: "serif", label: "Serif Bold", sample: "Dream Plan", apply: (t) => convert(t, BOLD_SERIF) },
  { id: "squiggle", label: "Squiggle / Fancy Script", sample: "Dream Plan", apply: (t) => convert(t, BOLD_SCRIPT) },
  { id: "plain", label: "Plain", sample: "Dream Plan", apply: (t) => t },
];

export function applyStyle(id: StyleId, text: string) {
  const def = TEXT_STYLES.find((s) => s.id === id) ?? TEXT_STYLES[0];
  return def.apply(text);
}
