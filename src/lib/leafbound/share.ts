export const APP_NAME = "Leafbound";

export const SHARE_BLURB =
  "Leafbound is a pocket analog notebook. Open this on your phone, then tap Install or Add to Home Screen — it becomes an app icon. No App Store, no .exe.";

export function isPreviewHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === "[::1]" ||
    h === "grok.com" ||
    h.endsWith(".grok.com") ||
    h === "grok-sandbox.com" ||
    h.endsWith(".grok-sandbox.com") ||
    h.includes(".preview.")
  );
}

export function getShareState(): { live: boolean; url: string } {
  if (typeof window === "undefined") {
    return { live: false, url: "" };
  }
  const url = `${window.location.origin}/`;
  const framed = window.self !== window.top;
  const preview = framed || isPreviewHost(window.location.hostname);
  return { live: !preview, url };
}

export function shareMessage(url: string) {
  return `${SHARE_BLURB}\n\n${url}`;
}

export async function copyText(text: string): Promise<boolean> {
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

export async function nativeShare(url: string): Promise<"shared" | "copied" | "cancelled" | "failed"> {
  const payload = { title: APP_NAME, text: SHARE_BLURB, url };
  if (typeof navigator.share === "function") {
    try {
      await navigator.share(payload);
      return "shared";
    } catch (err) {
      const name = err instanceof Error ? err.name : "";
      if (name === "AbortError") return "cancelled";
    }
  }
  const ok = await copyText(shareMessage(url));
  return ok ? "copied" : "failed";
}

export function detectPhoneOs(): "ios" | "android" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  const touch = navigator.maxTouchPoints || 0;
  const ios =
    /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && touch > 1);
  if (ios) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}
