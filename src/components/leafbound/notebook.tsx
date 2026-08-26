import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Menu } from "lucide-react";
import { ShareSheet } from "@/components/leafbound/share-sheet";
import { applyStyle, TEXT_STYLES, type StyleId } from "@/lib/leafbound/fonts";
import { LEAF_COUNT, defaultLeafSrc } from "@/lib/leafbound/images";
import { loadSaved, persistDump, type LeafPage } from "@/lib/leafbound/storage";

const FLIP_MS = 550;
const HOLD_MS = 500;

type Sheet = "none" | "tools" | "font" | "photo" | "share";
type FlipClass = "" | "blur-out-fwd" | "blur-out-back" | "blur-in-start-fwd" | "blur-in-start-back" | "blur-in-end";

export function Notebook() {
  const [ready, setReady] = useState(false);
  const [pages, setPages] = useState<LeafPage[]>([]);
  const [current, setCurrent] = useState(0);
  const [editing, setEditing] = useState(false);
  const [sheet, setSheet] = useState<Sheet>("none");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [hint, setHint] = useState(true);
  const [flip, setFlip] = useState<{ out: number; inn: number; outCls: FlipClass; inCls: FlipClass } | null>(null);

  const animating = useRef(false);
  const holdTimer = useRef<number | null>(null);
  const holdStart = useRef({ x: 0, y: 0 });
  const swipeX = useRef<number | null>(null);
  const camInput = useRef<HTMLInputElement>(null);
  const galInput = useRef<HTMLInputElement>(null);
  const editRef = useRef<HTMLTextAreaElement>(null);
  const pagesRef = useRef(pages);
  const currentRef = useRef(current);
  pagesRef.current = pages;
  currentRef.current = current;

  useEffect(() => {
    const loaded = loadSaved();
    setPages(loaded.pages);
    setCurrent(loaded.current);
    setReady(true);
    const t = window.setTimeout(() => setHint(false), 2800);
    return () => window.clearTimeout(t);
  }, []);

  const patchPage = useCallback(
    (idx: number, patch: Partial<LeafPage>) => {
      setPages((prev) => {
        const next = prev.map((p, i) => (i === idx ? { ...p, ...patch } : p));
        pagesRef.current = next;
        persistDump(currentRef.current, next);
        return next;
      });
    },
    [],
  );

  const goTo = useCallback(
    (newIdx: number, dir: "fwd" | "back") => {
      if (animating.current) return;
      if (newIdx < 0 || newIdx >= LEAF_COUNT || newIdx === currentRef.current) return;
      if (editing) setEditing(false);
      setSheet("none");
      setHint(false);
      animating.current = true;
      const out = currentRef.current;
      const inn = newIdx;
      const forward = dir === "fwd";
      setFlip({
        out,
        inn,
        outCls: "",
        inCls: forward ? "blur-in-start-fwd" : "blur-in-start-back",
      });
      requestAnimationFrame(() => {
        setFlip({
          out,
          inn,
          outCls: forward ? "blur-out-fwd" : "blur-out-back",
          inCls: "blur-in-end",
        });
      });
      window.setTimeout(() => {
        setCurrent(inn);
        currentRef.current = inn;
        persistDump(inn, pagesRef.current);
        setFlip(null);
        animating.current = false;
      }, FLIP_MS);
    },
    [editing],
  );

  function onPointerDownPhoto(e: React.PointerEvent, src: string) {
    if (editing || animating.current || lightbox) return;
    if ((e.target as HTMLElement).closest(".lb-cam")) return;
    holdStart.current = { x: e.clientX, y: e.clientY };
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => {
      setLightbox(src);
      swipeX.current = null;
    }, HOLD_MS);
  }

  function onPointerMovePhoto(e: React.PointerEvent) {
    if (!holdTimer.current) return;
    const dx = e.clientX - holdStart.current.x;
    const dy = e.clientY - holdStart.current.y;
    if (Math.abs(dx) > 18 || Math.abs(dy) > 18) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }

  function clearHold() {
    if (holdTimer.current) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }

  function onSwipeStart(e: React.TouchEvent | React.MouseEvent) {
    if (lightbox || sheet !== "none") return;
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    swipeX.current = x;
  }

  function onSwipeEnd(e: React.TouchEvent | React.MouseEvent) {
    if (swipeX.current == null || lightbox) {
      swipeX.current = null;
      return;
    }
    const x = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const dx = x - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) > 48) {
      if (dx < 0) goTo(currentRef.current + 1, "fwd");
      else goTo(currentRef.current - 1, "back");
    }
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      patchPage(currentRef.current, { photo: dataUrl, customPhoto: true });
    };
    reader.readAsDataURL(file);
  }

  function restoreDefault() {
    const i = currentRef.current;
    patchPage(i, { photo: defaultLeafSrc(i), customPhoto: false });
    setSheet("none");
  }

  function printPages(all: boolean) {
    setSheet("none");
    const list = all ? pagesRef.current : [pagesRef.current[currentRef.current]];
    const start = all ? 0 : currentRef.current;
    const html = list
      .map((p, k) => {
        const idx = all ? k : start;
        const body = p.raw
          ? applyStyle(p.style, p.raw)
              .replace(/&/g, "&")
              .replace(/</g, "<")
              .replace(/>/g, ">")
              .replace(/\n/g, "<br>")
          : "<em style='opacity:.5'>Empty page</em>";
        return `<section class="print-leaf">
          <div class="print-photo"><img src="${p.photo}" alt=""></div>
          <div class="print-flourish">✦ ⟡ ✦</div>
          <div class="print-text">${body}</div>
          <div class="print-footer"><span>Sheet ${p.sheetNum} · ${p.side}</span><span>Leaf ${idx + 1}/${LEAF_COUNT}</span></div>
        </section>`;
      })
      .join("");
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) {
      window.print();
      return;
    }
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Leafbound</title>
<style>
@page{margin:12mm}
body{margin:0;font-family:Georgia,serif;color:#2b2116}
.print-leaf{max-width:700px;margin:0 auto;display:flex;flex-direction:column;align-items:center;page-break-after:always;padding:8mm 0}
.print-leaf:last-child{page-break-after:auto}
.print-photo{width:100%;max-width:520px;aspect-ratio:4/3;overflow:hidden;background:#000;margin-bottom:18px}
.print-photo img{width:100%;height:100%;object-fit:cover}
.print-flourish{letter-spacing:3px;opacity:.55;margin-bottom:10px}
.print-text{text-align:center;font-size:22px;line-height:1.4;white-space:pre-wrap;max-width:520px}
.print-footer{width:100%;max-width:520px;margin-top:20px;display:flex;justify-content:space-between;font-size:11px;color:#5a4a37}
</style></head><body>${html}</body></html>`);
    w.document.close();
    w.focus();
    w.onload = () => w.print();
    setTimeout(() => w.print(), 400);
  }

  if (!ready || pages.length === 0) {
    return <div className="lb-app" aria-busy="true" />;
  }

  const visible = new Set<number>([current]);
  if (flip) {
    visible.add(flip.out);
    visible.add(flip.inn);
  }

  const p = pages[current];

  return (
    <div className="lb-app">
      <div
        className="lb-book"
        onTouchStart={onSwipeStart}
        onTouchEnd={onSwipeEnd}
        onMouseDown={onSwipeStart}
        onMouseUp={onSwipeEnd}
      >
        {pages.map((page, idx) => {
          if (!visible.has(idx)) return null;
          let cls = "lb-page";
          if (flip) {
            if (idx === flip.out) cls += flip.outCls ? ` ${flip.outCls}` : "";
            if (idx === flip.inn) cls += flip.inCls ? ` ${flip.inCls}` : "";
          }
          const z = flip ? (idx === flip.out ? 3 : idx === flip.inn ? 2 : 1) : idx === current ? 3 : 1;
          const styled = page.raw ? applyStyle(page.style, page.raw) : "";
          return (
            <article key={idx} className={cls} style={{ zIndex: z, display: "flex" }}>
              <div
                className="lb-photo"
                onPointerDown={(e) => onPointerDownPhoto(e, page.photo)}
                onPointerMove={onPointerMovePhoto}
                onPointerUp={clearHold}
                onPointerCancel={clearHold}
                onPointerLeave={clearHold}
              >
                <div className="lb-tape" />
                <div className="lb-photo-clip">
                  <img src={page.photo} alt="" />
                </div>
                <button
                  type="button"
                  className="lb-cam"
                  aria-label="Add photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearHold();
                    setSheet("photo");
                  }}
                >
                  <Camera className="size-4" strokeWidth={2} />
                </button>
              </div>
              <div className="lb-text">
                <div className="lb-flourish">✦ ⟡ ✦</div>
                {editing && idx === current ? (
                  <textarea
                    ref={editRef}
                    className="lb-styled"
                    value={page.raw}
                    placeholder="Write something for this page..."
                    onChange={(e) => patchPage(idx, { raw: e.target.value })}
                    autoFocus
                  />
                ) : (
                  <div
                    className="lb-styled"
                    data-empty={page.raw ? "false" : "true"}
                    data-placeholder="Tap Write to add a line..."
                  >
                    {styled}
                  </div>
                )}
              </div>
              <div className="lb-footer">
                <span>
                  Sheet {page.sheetNum} · {page.side}
                </span>
                <span className="lb-stamp">
                  Leaf {idx + 1}/{LEAF_COUNT}
                </span>
              </div>
            </article>
          );
        })}
        {hint ? <div className="lb-hint">swipe to turn the page</div> : null}
      </div>

      <button
        type="button"
        className={`lb-menu${editing ? " editing" : ""}`}
        aria-label="Menu"
        onClick={() => setSheet("tools")}
      >
        <Menu className="size-5" strokeWidth={2} />
      </button>

      {sheet === "tools" ? (
        <div className="lb-overlay" onClick={() => setSheet("none")}>
          <div className="lb-sheet" onClick={(e) => e.stopPropagation()}>
            <h4>
              {current + 1} / {LEAF_COUNT} · Sheet {p.sheetNum} · {p.side}
            </h4>
            <button type="button" className="lb-opt" onClick={() => goTo(current - 1, "back")}>
              <span>Previous page</span>
              <small>Back</small>
            </button>
            <button type="button" className="lb-opt" onClick={() => goTo(current + 1, "fwd")}>
              <span>Next page</span>
              <small>Forward</small>
            </button>
            {editing ? (
              <button
                type="button"
                className="lb-opt"
                onClick={() => {
                  setEditing(false);
                  setSheet("none");
                }}
              >
                <span>Done</span>
                <small>Finish writing</small>
              </button>
            ) : (
              <button
                type="button"
                className="lb-opt"
                onClick={() => {
                  setEditing(true);
                  setSheet("none");
                }}
              >
                <span>Write</span>
                <small>Edit text</small>
              </button>
            )}
            <button type="button" className="lb-opt" onClick={() => setSheet("font")}>
              <span>Font Style</span>
              <small>Script</small>
            </button>
            <button
              type="button"
              className="lb-opt"
              onClick={() => {
                patchPage(current, { raw: "" });
                setSheet("none");
              }}
            >
              <span>Clear Page</span>
              <small>Text only</small>
            </button>
            <button type="button" className="lb-opt" onClick={() => printPages(false)}>
              <span>Print Page</span>
              <small>This leaf</small>
            </button>
            <button type="button" className="lb-opt" onClick={() => printPages(true)}>
              <span>Print All Pages</span>
              <small>Full notebook</small>
            </button>
            <button type="button" className="lb-opt" onClick={() => setSheet("share")}>
              <span>Send to a friend</span>
              <small>Install on their phone</small>
            </button>
            <button type="button" className="lb-close" onClick={() => setSheet("none")}>
              Close
            </button>
          </div>
        </div>
      ) : null}

      {sheet === "font" ? (
        <div className="lb-overlay" onClick={() => setSheet("none")}>
          <div className="lb-sheet" onClick={(e) => e.stopPropagation()}>
            <h4>Choose a Text Style</h4>
            {TEXT_STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`lb-opt${p.style === s.id ? " selected" : ""}`}
                onClick={() => {
                  patchPage(current, { style: s.id as StyleId });
                  setSheet("none");
                }}
              >
                <span>{s.apply(s.sample)}</span>
                <small>{s.label}</small>
              </button>
            ))}
            <button type="button" className="lb-close" onClick={() => setSheet("none")}>
              Close
            </button>
          </div>
        </div>
      ) : null}

      {sheet === "photo" ? (
        <div className="lb-overlay" onClick={() => setSheet("none")}>
          <div className="lb-sheet" onClick={(e) => e.stopPropagation()}>
            <h4>Add Photo</h4>
            <button
              type="button"
              className="lb-opt"
              onClick={() => {
                setSheet("none");
                camInput.current?.click();
              }}
            >
              <span>Take Photo</span>
              <small>Camera</small>
            </button>
            <button
              type="button"
              className="lb-opt"
              onClick={() => {
                setSheet("none");
                galInput.current?.click();
              }}
            >
              <span>Choose from Gallery</span>
              <small>Library</small>
            </button>
            {p.customPhoto ? (
              <button type="button" className="lb-opt" onClick={restoreDefault}>
                <span>Remove Photo</span>
                <small>Default image</small>
              </button>
            ) : null}
            <button type="button" className="lb-close" onClick={() => setSheet("none")}>
              Close
            </button>
          </div>
        </div>
      ) : null}

      {sheet === "share" ? <ShareSheet tone="paper" onClose={() => setSheet("none")} /> : null}

      {lightbox ? (
        <div className="lb-lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" />
        </div>
      ) : null}

      <input
        ref={camInput}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={galInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
