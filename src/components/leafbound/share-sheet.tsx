import { useEffect, useState } from "react";
import { Check, Copy, Link2, MessageCircle, Share2, Smartphone } from "lucide-react";
import { QrMark } from "@/components/leafbound/qr-mark";
import {
  APP_NAME,
  copyText,
  detectPhoneOs,
  getShareState,
  nativeShare,
  shareMessage,
} from "@/lib/leafbound/share";

type Tone = "play" | "paper";

export function ShareSheet({
  tone,
  onClose,
}: {
  tone: Tone;
  onClose: () => void;
}) {
  const [live, setLive] = useState(false);
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const os = detectPhoneOs();

  useEffect(() => {
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
    } else if (result === "failed") {
      setNote("Couldn’t share from this browser. Copy the link instead.");
    }
  }

  const wa = live ? `https://wa.me/?text=${encodeURIComponent(shareMessage(url))}` : undefined;
  const sms = live ? `sms:?body=${encodeURIComponent(shareMessage(url))}` : undefined;

  return (
    <div className={`sh-overlay tone-${tone}`} onClick={onClose} role="presentation">
      <div
        className={`sh-sheet tone-${tone}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="sh-title"
      >
        <div className="sh-handle" aria-hidden />
        <h3 id="sh-title">Send to a friend</h3>
        <p className="sh-lead">
          Phones can’t run a Windows <span className="sh-mono">.exe</span>. Send a link —
          they tap Install, and {APP_NAME} lands on the home screen like any other app.
        </p>

        {live ? (
          <div className="sh-qr-wrap">
            <QrMark value={url} label={`${APP_NAME} install link`} />
            <p className="sh-qr-caption">They can scan this with their camera</p>
            <div className="sh-url">{url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</div>
          </div>
        ) : (
          <div className="sh-preview-card">
            <Smartphone className="size-5" strokeWidth={1.8} />
            <div>
              <strong>Publish first, then send.</strong>
              <p>
                This preview is only on your screen. Publish {APP_NAME}, then this sheet
                gives you a link and QR code to text your friend.
              </p>
            </div>
          </div>
        )}

        <div className="sh-actions">
          <button type="button" className="sh-btn primary" onClick={onShare}>
            <Share2 className="size-4" strokeWidth={2} />
            Share
          </button>
          <button type="button" className="sh-btn" onClick={onCopy}>
            {copied ? <Check className="size-4" strokeWidth={2} /> : <Copy className="size-4" strokeWidth={2} />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>

        <div className="sh-actions">
          <a
            className={`sh-btn ghost${live ? "" : " disabled"}`}
            href={sms}
            aria-disabled={!live}
            onClick={(e) => {
              if (!live) {
                e.preventDefault();
                setNote("Publish first so Messages has a real link to send.");
              }
            }}
          >
            <MessageCircle className="size-4" strokeWidth={2} />
            Messages
          </a>
          <a
            className={`sh-btn ghost${live ? "" : " disabled"}`}
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!live}
            onClick={(e) => {
              if (!live) {
                e.preventDefault();
                setNote("Publish first so WhatsApp has a real link to send.");
              }
            }}
          >
            <Link2 className="size-4" strokeWidth={2} />
            WhatsApp
          </a>
        </div>

        {note ? (
          <p className="sh-note" role="status">
            {note}
          </p>
        ) : null}

        <div className="sh-steps">
          <h4>What your friend does</h4>
          <ol>
            <li className={os === "ios" ? "is-you" : undefined}>
              <b>iPhone</b>
              <span>Open in Safari → Share → Add to Home Screen → Add.</span>
            </li>
            <li className={os === "android" ? "is-you" : undefined}>
              <b>Android</b>
              <span>Open in Chrome → Install app, or menu ⋮ → Add to Home screen.</span>
            </li>
          </ol>
          {os === "ios" ? (
            <a className="sh-guide" href="/?install=1&platform=ios">
              Show the iPhone Home Screen guide
            </a>
          ) : null}
        </div>

        <button type="button" className="sh-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
