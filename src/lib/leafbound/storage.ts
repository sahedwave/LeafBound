import { LEAF_COUNT, defaultLeafSrc } from "./images";
import type { StyleId } from "./fonts";

export const STORAGE_KEY = "leafbound_notebook_v1";
export const OPENED_KEY = "leafbound_app_opened_v1";

export type LeafPage = {
  photo: string;
  raw: string;
  style: StyleId;
  sheetNum: number;
  side: "Front" | "Back";
  customPhoto: boolean;
};

export type SavedDump = {
  current: number;
  pages: Array<{ raw: string; style: StyleId; photo?: string }>;
};

export function emptyPages(): LeafPage[] {
  return Array.from({ length: LEAF_COUNT }, (_, i) => ({
    photo: defaultLeafSrc(i),
    raw: "",
    style: "gothic" as StyleId,
    sheetNum: Math.floor(i / 2) + 1,
    side: i % 2 === 0 ? "Front" : "Back",
    customPhoto: false,
  }));
}

export function loadSaved(): { current: number; pages: LeafPage[] } {
  const pages = emptyPages();
  let current = 0;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { current, pages };
    const saved = JSON.parse(raw) as SavedDump;
    if (Number.isInteger(saved.current) && saved.current >= 0 && saved.current < LEAF_COUNT) {
      current = saved.current;
    }
    if (Array.isArray(saved.pages)) {
      for (let i = 0; i < LEAF_COUNT; i++) {
        const s = saved.pages[i];
        if (!s) continue;
        pages[i].raw = typeof s.raw === "string" ? s.raw : "";
        pages[i].style = s.style || "gothic";
        if (s.photo) {
          pages[i].photo = s.photo;
          pages[i].customPhoto = true;
        }
      }
    }
  } catch {
    /* ignore */
  }
  return { current, pages };
}

export function persistDump(current: number, pages: LeafPage[]) {
  try {
    const dump: SavedDump = {
      current,
      pages: pages.map((p) => ({
        raw: p.raw,
        style: p.style,
        photo: p.customPhoto ? p.photo : undefined,
      })),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dump));
  } catch {
    /* quota / private mode */
  }
}
