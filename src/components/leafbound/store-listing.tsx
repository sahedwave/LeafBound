import { useEffect, useState } from "react";
import { Leaf, Share2, Smartphone, Star } from "lucide-react";
import { ShareSheet } from "@/components/leafbound/share-sheet";
import { DEFAULT_LEAVES } from "@/lib/leafbound/images";
import { detectPhoneOs } from "@/lib/leafbound/share";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function StoreListing({ onOpen }: { onOpen: () => void }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [installed, setInstalled] = useState(false);
  const [sharing, setSharing] = useState(false);
  const os = detectPhoneOs();

  useEffect(() => {
    setInstalled(isStandalone());
    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
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

  return (
    <div className="ps-screen">
      <div className="ps-top">
        <Leaf className="size-4" strokeWidth={2} />
        Play Store
      </div>

      <div className="ps-hero">
        <div className="ps-icon" aria-hidden>
          <Leaf className="size-9 text-ink" strokeWidth={1.6} />
        </div>
        <div>
          <div className="ps-title">Leafbound</div>
          <div className="ps-dev">Analog notebook</div>
          <div className="ps-stars">
            <Star className="size-3 fill-current" />
            <Star className="size-3 fill-current" />
            <Star className="size-3 fill-current" />
            <Star className="size-3 fill-current" />
            <Star className="size-3 fill-current" />
            <span>Editor’s choice</span>
          </div>
        </div>
      </div>

      <div className="ps-meta">
        <div>
          <b>4.9</b>
          reviews
        </div>
        <div>
          <b>18</b>
          leaves
        </div>
        <div>
          <b>Everyone</b>
          rated
        </div>
      </div>

      <div className="ps-actions">
        <button type="button" className="ps-install" onClick={install}>
          {installed ? "Installed" : "Install"}
        </button>
        <button type="button" className="ps-open" onClick={onOpen}>
          Open
        </button>
      </div>
      <div className="ps-actions">
        <button type="button" className="ps-share" onClick={() => setSharing(true)}>
          <Share2 className="size-4" strokeWidth={2} />
          Send to a friend
        </button>
      </div>

      <div className="ps-shots" aria-label="Screenshots">
        {DEFAULT_LEAVES.slice(0, 6).map((src) => (
          <img key={src} src={src} alt="" />
        ))}
      </div>

      <div className="ps-about">
        <h2>About this app</h2>
        <p>
          Leafbound is a pocket analog notebook. Eighteen leaves, a polaroid frame, and a
          fountain-pen script — swipe to turn pages, hold a photo to expand it, and print any
          leaf.
        </p>
        <p>
          Install it to your home screen for a full-screen app: no browser chrome, just paper.
          Camera and gallery replace the photo on the current leaf; Remove Photo restores the
          original.
        </p>
      </div>

      <div className="ps-send">
        <div className="ps-send-kicker">
          <Smartphone className="size-4" strokeWidth={2} />
          Putting it on a phone
        </div>
        <h2>No .exe — send a link</h2>
        <p>
          A Windows installer won’t run on iPhone or Android. After you publish Leafbound,
          send your friend the link (or the QR code). They open it on their phone and tap
          Install / Add to Home Screen. The notebook icon lands next to their other apps.
        </p>
        <ol>
          <li>Publish Leafbound so it has a public address.</li>
          <li>Tap Send to a friend — copy, text, WhatsApp, or show the QR.</li>
          <li>
            {os === "ios"
              ? "They open it in Safari, tap Share, then Add to Home Screen."
              : os === "android"
                ? "They open it in Chrome and tap Install app."
                : "They open it on their phone and tap Install / Add to Home Screen."}
          </li>
        </ol>
        <button type="button" className="ps-share" onClick={() => setSharing(true)}>
          <Share2 className="size-4" strokeWidth={2} />
          Send to a friend
        </button>
      </div>

      {toast ? (
        <div className="ps-toast" role="status">
          {toast}
        </div>
      ) : null}

      {sharing ? <ShareSheet tone="play" onClose={() => setSharing(false)} /> : null}
    </div>
  );
}
