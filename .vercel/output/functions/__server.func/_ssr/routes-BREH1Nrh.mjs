import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as MessageCircle, c as Leaf, d as Camera, i as Share2, l as Copy, n as Star, o as Menu, r as Smartphone, s as Link2, u as Check } from "../_libs/lucide-react.mjs";
import { t as encode } from "../_libs/uqr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BREH1Nrh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QrMark({ value, label }) {
	const { size, d } = (0, import_react.useMemo)(() => {
		const qr = encode(value, {
			ecc: "M",
			border: 2
		});
		const parts = [];
		for (let y = 0; y < qr.size; y++) for (let x = 0; x < qr.size; x++) if (qr.data[y][x]) parts.push(`M${x} ${y}h1v1h-1z`);
		return {
			size: qr.size,
			d: parts.join("")
		};
	}, [value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${size} ${size}`,
		className: "sh-qr",
		role: "img",
		"aria-label": label ?? "QR code",
		shapeRendering: "crispEdges",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			className: "sh-qr-bg",
			width: size,
			height: size
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			className: "sh-qr-fg",
			d
		})]
	});
}
var APP_NAME = "Leafbound";
var SHARE_BLURB = "Leafbound is a pocket analog notebook. Open this on your phone, then tap Install or Add to Home Screen — it becomes an app icon. No App Store, no .exe.";
function isPreviewHost(hostname) {
	const h = hostname.toLowerCase();
	return h === "localhost" || h === "127.0.0.1" || h === "[::1]" || h === "grok.com" || h.endsWith(".grok.com") || h === "grok-sandbox.com" || h.endsWith(".grok-sandbox.com") || h.includes(".preview.");
}
function getShareState() {
	if (typeof window === "undefined") return {
		live: false,
		url: ""
	};
	const url = `${window.location.origin}/`;
	return {
		live: !(window.self !== window.top || isPreviewHost(window.location.hostname)),
		url
	};
}
function shareMessage(url) {
	return `${SHARE_BLURB}\n\n${url}`;
}
async function copyText(text) {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		try {
			const el = document.createElement("textarea");
			el.value = text;
			el.setAttribute("readonly", "");
			el.style.position = "fixed";
			el.style.left = "-9999px";
			document.body.appendChild(el);
			el.select();
			const ok = document.execCommand("copy");
			document.body.removeChild(el);
			return ok;
		} catch {
			return false;
		}
	}
}
async function nativeShare(url) {
	const payload = {
		title: APP_NAME,
		text: SHARE_BLURB,
		url
	};
	if (typeof navigator.share === "function") try {
		await navigator.share(payload);
		return "shared";
	} catch (err) {
		if ((err instanceof Error ? err.name : "") === "AbortError") return "cancelled";
	}
	return await copyText(shareMessage(url)) ? "copied" : "failed";
}
function detectPhoneOs() {
	if (typeof navigator === "undefined") return "other";
	const ua = navigator.userAgent || "";
	const touch = navigator.maxTouchPoints || 0;
	if (/iPad|iPhone|iPod/.test(ua) || /Macintosh/.test(ua) && touch > 1) return "ios";
	if (/Android/i.test(ua)) return "android";
	return "other";
}
function ShareSheet({ tone, onClose }) {
	const [live, setLive] = (0, import_react.useState)(false);
	const [url, setUrl] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)(null);
	const os = detectPhoneOs();
	(0, import_react.useEffect)(() => {
		const state = getShareState();
		setLive(state.live);
		setUrl(state.url);
	}, []);
	async function onCopy() {
		if (!live) {
			setNote("Publish Leafbound first — then this copies a real link your friend can open.");
			return;
		}
		const ok = await copyText(shareMessage(url));
		setCopied(ok);
		setNote(ok ? "Link copied. Paste it into a text, WhatsApp, or email." : "Couldn’t copy. Long-press the link instead.");
		if (ok) window.setTimeout(() => setCopied(false), 2200);
	}
	async function onShare() {
		if (!live) {
			setNote("Publish Leafbound first so the share sheet has a public link.");
			return;
		}
		const result = await nativeShare(url);
		if (result === "shared") setNote("Sent.");
		else if (result === "copied") {
			setCopied(true);
			setNote("Share isn’t available here, so the message was copied instead.");
			window.setTimeout(() => setCopied(false), 2200);
		} else if (result === "failed") setNote("Couldn’t share from this browser. Copy the link instead.");
	}
	const wa = live ? `https://wa.me/?text=${encodeURIComponent(shareMessage(url))}` : void 0;
	const sms = live ? `sms:?body=${encodeURIComponent(shareMessage(url))}` : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `sh-overlay tone-${tone}`,
		onClick: onClose,
		role: "presentation",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `sh-sheet tone-${tone}`,
			onClick: (e) => e.stopPropagation(),
			role: "dialog",
			"aria-labelledby": "sh-title",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sh-handle",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					id: "sh-title",
					children: "Send to a friend"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "sh-lead",
					children: [
						"Phones can’t run a Windows ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sh-mono",
							children: ".exe"
						}),
						". Send a link — they tap Install, and ",
						APP_NAME,
						" lands on the home screen like any other app."
					]
				}),
				live ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sh-qr-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrMark, {
							value: url,
							label: `${APP_NAME} install link`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "sh-qr-caption",
							children: "They can scan this with their camera"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sh-url",
							children: url.replace(/^https?:\/\//, "").replace(/\/$/, "")
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sh-preview-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, {
						className: "size-5",
						strokeWidth: 1.8
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Publish first, then send." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"This preview is only on your screen. Publish ",
						APP_NAME,
						", then this sheet gives you a link and QR code to text your friend."
					] })] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sh-actions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "sh-btn primary",
						onClick: onShare,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, {
							className: "size-4",
							strokeWidth: 2
						}), "Share"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "sh-btn",
						onClick: onCopy,
						children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							className: "size-4",
							strokeWidth: 2
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
							className: "size-4",
							strokeWidth: 2
						}), copied ? "Copied" : "Copy link"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sh-actions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: `sh-btn ghost${live ? "" : " disabled"}`,
						href: sms,
						"aria-disabled": !live,
						onClick: (e) => {
							if (!live) {
								e.preventDefault();
								setNote("Publish first so Messages has a real link to send.");
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
							className: "size-4",
							strokeWidth: 2
						}), "Messages"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: `sh-btn ghost${live ? "" : " disabled"}`,
						href: wa,
						target: "_blank",
						rel: "noopener noreferrer",
						"aria-disabled": !live,
						onClick: (e) => {
							if (!live) {
								e.preventDefault();
								setNote("Publish first so WhatsApp has a real link to send.");
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, {
							className: "size-4",
							strokeWidth: 2
						}), "WhatsApp"]
					})]
				}),
				note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "sh-note",
					role: "status",
					children: note
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sh-steps",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "What your friend does" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: os === "ios" ? "is-you" : void 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "iPhone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open in Safari → Share → Add to Home Screen → Add." })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: os === "android" ? "is-you" : void 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Android" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open in Chrome → Install app, or menu ⋮ → Add to Home screen." })]
						})] }),
						os === "ios" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "sh-guide",
							href: "/?install=1&platform=ios",
							children: "Show the iPhone Home Screen guide"
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "sh-close",
					onClick: onClose,
					children: "Close"
				})
			]
		})
	});
}
function buildMap(baseUpper, baseLower, baseDigit) {
	const map = {};
	for (let i = 0; i < 26; i++) {
		if (baseUpper != null) map[String.fromCharCode(65 + i)] = String.fromCodePoint(baseUpper + i);
		if (baseLower != null) map[String.fromCharCode(97 + i)] = String.fromCodePoint(baseLower + i);
	}
	if (baseDigit != null) for (let i = 0; i < 10; i++) map[String.fromCharCode(48 + i)] = String.fromCodePoint(baseDigit + i);
	return map;
}
var FRAKTUR_BOLD = buildMap(120172, 120198, null);
var DOUBLE_STRUCK = buildMap(120120, 120146, 120792);
var DS_EXC = {
	C: 8450,
	H: 8461,
	N: 8469,
	P: 8473,
	Q: 8474,
	R: 8477,
	Z: 8484
};
for (const k of Object.keys(DS_EXC)) DOUBLE_STRUCK[k] = String.fromCodePoint(DS_EXC[k]);
var BOLD_SERIF = buildMap(119808, 119834, 120782);
var BOLD_SCRIPT = buildMap(120016, 120042, null);
function convert(text, map) {
	let out = "";
	for (const ch of text) out += map[ch] !== void 0 ? map[ch] : ch;
	return out;
}
var TEXT_STYLES = [
	{
		id: "gothic",
		label: "Gothic / Blackletter",
		sample: "Dream Plan",
		apply: (t) => convert(t, FRAKTUR_BOLD)
	},
	{
		id: "double",
		label: "Double-Struck / Outline",
		sample: "Dream Plan",
		apply: (t) => convert(t, DOUBLE_STRUCK)
	},
	{
		id: "serif",
		label: "Serif Bold",
		sample: "Dream Plan",
		apply: (t) => convert(t, BOLD_SERIF)
	},
	{
		id: "squiggle",
		label: "Squiggle / Fancy Script",
		sample: "Dream Plan",
		apply: (t) => convert(t, BOLD_SCRIPT)
	},
	{
		id: "plain",
		label: "Plain",
		sample: "Dream Plan",
		apply: (t) => t
	}
];
function applyStyle(id, text) {
	return (TEXT_STYLES.find((s) => s.id === id) ?? TEXT_STYLES[0]).apply(text);
}
function defaultLeafSrc(index) {
	return `/leaves/${String(index + 1).padStart(2, "0")}.jpg`;
}
var DEFAULT_LEAVES = Array.from({ length: 18 }, (_, i) => defaultLeafSrc(i));
var STORAGE_KEY = "leafbound_notebook_v1";
var OPENED_KEY = "leafbound_app_opened_v1";
function emptyPages() {
	return Array.from({ length: 18 }, (_, i) => ({
		photo: defaultLeafSrc(i),
		raw: "",
		style: "gothic",
		sheetNum: Math.floor(i / 2) + 1,
		side: i % 2 === 0 ? "Front" : "Back",
		customPhoto: false
	}));
}
function loadSaved() {
	const pages = emptyPages();
	let current = 0;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return {
			current,
			pages
		};
		const saved = JSON.parse(raw);
		if (Number.isInteger(saved.current) && saved.current >= 0 && saved.current < 18) current = saved.current;
		if (Array.isArray(saved.pages)) for (let i = 0; i < 18; i++) {
			const s = saved.pages[i];
			if (!s) continue;
			pages[i].raw = typeof s.raw === "string" ? s.raw : "";
			pages[i].style = s.style || "gothic";
			if (s.photo) {
				pages[i].photo = s.photo;
				pages[i].customPhoto = true;
			}
		}
	} catch {}
	return {
		current,
		pages
	};
}
function persistDump(current, pages) {
	try {
		const dump = {
			current,
			pages: pages.map((p) => ({
				raw: p.raw,
				style: p.style,
				photo: p.customPhoto ? p.photo : void 0
			}))
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(dump));
	} catch {}
}
var FLIP_MS = 550;
var HOLD_MS = 500;
function Notebook() {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [pages, setPages] = (0, import_react.useState)([]);
	const [current, setCurrent] = (0, import_react.useState)(0);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [sheet, setSheet] = (0, import_react.useState)("none");
	const [lightbox, setLightbox] = (0, import_react.useState)(null);
	const [hint, setHint] = (0, import_react.useState)(true);
	const [flip, setFlip] = (0, import_react.useState)(null);
	const animating = (0, import_react.useRef)(false);
	const holdTimer = (0, import_react.useRef)(null);
	const holdStart = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const swipeX = (0, import_react.useRef)(null);
	const camInput = (0, import_react.useRef)(null);
	const galInput = (0, import_react.useRef)(null);
	const editRef = (0, import_react.useRef)(null);
	const pagesRef = (0, import_react.useRef)(pages);
	const currentRef = (0, import_react.useRef)(current);
	pagesRef.current = pages;
	currentRef.current = current;
	(0, import_react.useEffect)(() => {
		const loaded = loadSaved();
		setPages(loaded.pages);
		setCurrent(loaded.current);
		setReady(true);
		const t = window.setTimeout(() => setHint(false), 2800);
		return () => window.clearTimeout(t);
	}, []);
	const patchPage = (0, import_react.useCallback)((idx, patch) => {
		setPages((prev) => {
			const next = prev.map((p, i) => i === idx ? {
				...p,
				...patch
			} : p);
			pagesRef.current = next;
			persistDump(currentRef.current, next);
			return next;
		});
	}, []);
	const goTo = (0, import_react.useCallback)((newIdx, dir) => {
		if (animating.current) return;
		if (newIdx < 0 || newIdx >= 18 || newIdx === currentRef.current) return;
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
			inCls: forward ? "blur-in-start-fwd" : "blur-in-start-back"
		});
		requestAnimationFrame(() => {
			setFlip({
				out,
				inn,
				outCls: forward ? "blur-out-fwd" : "blur-out-back",
				inCls: "blur-in-end"
			});
		});
		window.setTimeout(() => {
			setCurrent(inn);
			currentRef.current = inn;
			persistDump(inn, pagesRef.current);
			setFlip(null);
			animating.current = false;
		}, FLIP_MS);
	}, [editing]);
	function onPointerDownPhoto(e, src) {
		if (editing || animating.current || lightbox) return;
		if (e.target.closest(".lb-cam")) return;
		holdStart.current = {
			x: e.clientX,
			y: e.clientY
		};
		if (holdTimer.current) window.clearTimeout(holdTimer.current);
		holdTimer.current = window.setTimeout(() => {
			setLightbox(src);
			swipeX.current = null;
		}, HOLD_MS);
	}
	function onPointerMovePhoto(e) {
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
	function onSwipeStart(e) {
		if (lightbox || sheet !== "none") return;
		const x = "touches" in e ? e.touches[0].clientX : e.clientX;
		swipeX.current = x;
	}
	function onSwipeEnd(e) {
		if (swipeX.current == null || lightbox) {
			swipeX.current = null;
			return;
		}
		const dx = ("changedTouches" in e ? e.changedTouches[0].clientX : e.clientX) - swipeX.current;
		swipeX.current = null;
		if (Math.abs(dx) > 48) {
			if (dx < 0) goTo(currentRef.current + 1, "fwd");
			else goTo(currentRef.current - 1, "back");
		}
	}
	function onFile(file) {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			const dataUrl = String(reader.result || "");
			patchPage(currentRef.current, {
				photo: dataUrl,
				customPhoto: true
			});
		};
		reader.readAsDataURL(file);
	}
	function restoreDefault() {
		const i = currentRef.current;
		patchPage(i, {
			photo: defaultLeafSrc(i),
			customPhoto: false
		});
		setSheet("none");
	}
	function printPages(all) {
		setSheet("none");
		const list = all ? pagesRef.current : [pagesRef.current[currentRef.current]];
		const start = all ? 0 : currentRef.current;
		const html = list.map((p, k) => {
			const idx = all ? k : start;
			const body = p.raw ? applyStyle(p.style, p.raw).replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/\n/g, "<br>") : "<em style='opacity:.5'>Empty page</em>";
			return `<section class="print-leaf">
          <div class="print-photo"><img src="${p.photo}" alt=""></div>
          <div class="print-flourish">✦ ⟡ ✦</div>
          <div class="print-text">${body}</div>
          <div class="print-footer"><span>Sheet ${p.sheetNum} · ${p.side}</span><span>Leaf ${idx + 1}/18</span></div>
        </section>`;
		}).join("");
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
	if (!ready || pages.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "lb-app",
		"aria-busy": "true"
	});
	const visible = /* @__PURE__ */ new Set([current]);
	if (flip) {
		visible.add(flip.out);
		visible.add(flip.inn);
	}
	const p = pages[current];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lb-app",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lb-book",
				onTouchStart: onSwipeStart,
				onTouchEnd: onSwipeEnd,
				onMouseDown: onSwipeStart,
				onMouseUp: onSwipeEnd,
				children: [pages.map((page, idx) => {
					if (!visible.has(idx)) return null;
					let cls = "lb-page";
					if (flip) {
						if (idx === flip.out) cls += flip.outCls ? ` ${flip.outCls}` : "";
						if (idx === flip.inn) cls += flip.inCls ? ` ${flip.inCls}` : "";
					}
					const z = flip ? idx === flip.out ? 3 : idx === flip.inn ? 2 : 1 : idx === current ? 3 : 1;
					const styled = page.raw ? applyStyle(page.style, page.raw) : "";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: cls,
						style: {
							zIndex: z,
							display: "flex"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "lb-photo",
								onPointerDown: (e) => onPointerDownPhoto(e, page.photo),
								onPointerMove: onPointerMovePhoto,
								onPointerUp: clearHold,
								onPointerCancel: clearHold,
								onPointerLeave: clearHold,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lb-tape" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "lb-photo-clip",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: page.photo,
											alt: ""
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "lb-cam",
										"aria-label": "Add photo",
										onClick: (e) => {
											e.stopPropagation();
											clearHold();
											setSheet("photo");
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
											className: "size-4",
											strokeWidth: 2
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "lb-text",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "lb-flourish",
									children: "✦ ⟡ ✦"
								}), editing && idx === current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									ref: editRef,
									className: "lb-styled",
									value: page.raw,
									placeholder: "Write something for this page...",
									onChange: (e) => patchPage(idx, { raw: e.target.value }),
									autoFocus: true
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "lb-styled",
									"data-empty": page.raw ? "false" : "true",
									"data-placeholder": "Tap Write to add a line...",
									children: styled
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "lb-footer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Sheet ",
									page.sheetNum,
									" · ",
									page.side
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "lb-stamp",
									children: [
										"Leaf ",
										idx + 1,
										"/",
										18
									]
								})]
							})
						]
					}, idx);
				}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lb-hint",
					children: "swipe to turn the page"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: `lb-menu${editing ? " editing" : ""}`,
				"aria-label": "Menu",
				onClick: () => setSheet("tools"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
					className: "size-5",
					strokeWidth: 2
				})
			}),
			sheet === "tools" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lb-overlay",
				onClick: () => setSheet("none"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lb-sheet",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", { children: [
							current + 1,
							" / ",
							18,
							" · Sheet ",
							p.sheetNum,
							" · ",
							p.side
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "lb-opt",
							onClick: () => goTo(current - 1, "back"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Previous page" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Back" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "lb-opt",
							onClick: () => goTo(current + 1, "fwd"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Next page" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Forward" })]
						}),
						editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "lb-opt",
							onClick: () => {
								setEditing(false);
								setSheet("none");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Done" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Finish writing" })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "lb-opt",
							onClick: () => {
								setEditing(true);
								setSheet("none");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Write" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Edit text" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "lb-opt",
							onClick: () => setSheet("font"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Font Style" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Script" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "lb-opt",
							onClick: () => {
								patchPage(current, { raw: "" });
								setSheet("none");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Clear Page" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Text only" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "lb-opt",
							onClick: () => printPages(false),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Print Page" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "This leaf" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "lb-opt",
							onClick: () => printPages(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Print All Pages" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Full notebook" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "lb-opt",
							onClick: () => setSheet("share"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Send to a friend" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Install on their phone" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "lb-close",
							onClick: () => setSheet("none"),
							children: "Close"
						})
					]
				})
			}) : null,
			sheet === "font" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lb-overlay",
				onClick: () => setSheet("none"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lb-sheet",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "Choose a Text Style" }),
						TEXT_STYLES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: `lb-opt${p.style === s.id ? " selected" : ""}`,
							onClick: () => {
								patchPage(current, { style: s.id });
								setSheet("none");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.apply(s.sample) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: s.label })]
						}, s.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "lb-close",
							onClick: () => setSheet("none"),
							children: "Close"
						})
					]
				})
			}) : null,
			sheet === "photo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lb-overlay",
				onClick: () => setSheet("none"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lb-sheet",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "Add Photo" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "lb-opt",
							onClick: () => {
								setSheet("none");
								camInput.current?.click();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Take Photo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Camera" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "lb-opt",
							onClick: () => {
								setSheet("none");
								galInput.current?.click();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Choose from Gallery" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Library" })]
						}),
						p.customPhoto ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "lb-opt",
							onClick: restoreDefault,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Remove Photo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Default image" })]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "lb-close",
							onClick: () => setSheet("none"),
							children: "Close"
						})
					]
				})
			}) : null,
			sheet === "share" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareSheet, {
				tone: "paper",
				onClose: () => setSheet("none")
			}) : null,
			lightbox ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lb-lightbox",
				onClick: () => setLightbox(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: lightbox,
					alt: ""
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: camInput,
				type: "file",
				accept: "image/*",
				capture: "environment",
				className: "hidden",
				onChange: (e) => {
					onFile(e.target.files?.[0]);
					e.target.value = "";
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: galInput,
				type: "file",
				accept: "image/*",
				className: "hidden",
				onChange: (e) => {
					onFile(e.target.files?.[0]);
					e.target.value = "";
				}
			})
		]
	});
}
function isStandalone$1() {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}
function StoreListing({ onOpen }) {
	const [deferred, setDeferred] = (0, import_react.useState)(null);
	const [toast, setToast] = (0, import_react.useState)(null);
	const [installed, setInstalled] = (0, import_react.useState)(false);
	const [sharing, setSharing] = (0, import_react.useState)(false);
	const os = detectPhoneOs();
	(0, import_react.useEffect)(() => {
		setInstalled(isStandalone$1());
		const onBip = (e) => {
			e.preventDefault();
			setDeferred(e);
		};
		const onInstalled = () => {
			setInstalled(true);
			setToast("Leafbound is installed. Open it from your home screen.");
		};
		window.addEventListener("beforeinstallprompt", onBip);
		window.addEventListener("appinstalled", onInstalled);
		return () => {
			window.removeEventListener("beforeinstallprompt", onBip);
			window.removeEventListener("appinstalled", onInstalled);
		};
	}, []);
	async function install() {
		if (deferred) {
			await deferred.prompt();
			const choice = await deferred.userChoice;
			setDeferred(null);
			if (choice.outcome === "accepted") {
				setToast("Installing Leafbound…");
				return;
			}
		}
		if (os === "ios") {
			window.location.href = "/?install=1&platform=ios";
			return;
		}
		if (os === "android") {
			setToast("Tap the browser menu (⋮) → Install app / Add to Home screen.");
			return;
		}
		setToast("Open this page on a phone, then use Install / Add to Home Screen.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ps-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ps-top",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, {
					className: "size-4",
					strokeWidth: 2
				}), "Play Store"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ps-hero",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ps-icon",
					"aria-hidden": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, {
						className: "size-9 text-ink",
						strokeWidth: 1.6
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ps-title",
						children: "Leafbound"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ps-dev",
						children: "Analog notebook"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ps-stars",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-current" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-current" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-current" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-current" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-current" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Editor’s choice" })
						]
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ps-meta",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "4.9" }), "reviews"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "18" }), "leaves"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Everyone" }), "rated"] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ps-actions",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "ps-install",
					onClick: install,
					children: installed ? "Installed" : "Install"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "ps-open",
					onClick: onOpen,
					children: "Open"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ps-actions",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "ps-share",
					onClick: () => setSharing(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, {
						className: "size-4",
						strokeWidth: 2
					}), "Send to a friend"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ps-shots",
				"aria-label": "Screenshots",
				children: DEFAULT_LEAVES.slice(0, 6).map((src) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: ""
				}, src))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ps-about",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "About this app" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Leafbound is a pocket analog notebook. Eighteen leaves, a polaroid frame, and a fountain-pen script — swipe to turn pages, hold a photo to expand it, and print any leaf." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Install it to your home screen for a full-screen app: no browser chrome, just paper. Camera and gallery replace the photo on the current leaf; Remove Photo restores the original." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ps-send",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ps-send-kicker",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, {
							className: "size-4",
							strokeWidth: 2
						}), "Putting it on a phone"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "No .exe — send a link" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "A Windows installer won’t run on iPhone or Android. After you publish Leafbound, send your friend the link (or the QR code). They open it on their phone and tap Install / Add to Home Screen. The notebook icon lands next to their other apps." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Publish Leafbound so it has a public address." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Tap Send to a friend — copy, text, WhatsApp, or show the QR." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: os === "ios" ? "They open it in Safari, tap Share, then Add to Home Screen." : os === "android" ? "They open it in Chrome and tap Install app." : "They open it on their phone and tap Install / Add to Home Screen." })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "ps-share",
						onClick: () => setSharing(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, {
							className: "size-4",
							strokeWidth: 2
						}), "Send to a friend"]
					})
				]
			}),
			toast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ps-toast",
				role: "status",
				children: toast
			}) : null,
			sharing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareSheet, {
				tone: "play",
				onClose: () => setSharing(false)
			}) : null
		]
	});
}
function isStandalone() {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}
function Home() {
	const [mode, setMode] = (0, import_react.useState)("boot");
	(0, import_react.useEffect)(() => {
		if (isStandalone() || localStorage.getItem("leafbound_app_opened_v1") === "1") setMode("app");
		else setMode("store");
	}, []);
	function openApp() {
		localStorage.setItem(OPENED_KEY, "1");
		setMode("app");
	}
	if (mode === "boot") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lb-app" });
	if (mode === "store") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreListing, { onOpen: openApp });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notebook, {});
}
//#endregion
export { Home as component };
