import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Notebook } from "@/components/leafbound/notebook";
import { StoreListing } from "@/components/leafbound/store-listing";
import { OPENED_KEY } from "@/lib/leafbound/storage";

export const Route = createFileRoute("/")({ component: Home });

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function Home() {
  const [mode, setMode] = useState<"boot" | "store" | "app">("boot");

  useEffect(() => {
    if (isStandalone() || localStorage.getItem(OPENED_KEY) === "1") {
      setMode("app");
    } else {
      setMode("store");
    }
  }, []);

  function openApp() {
    localStorage.setItem(OPENED_KEY, "1");
    setMode("app");
  }

  if (mode === "boot") {
    return <div className="lb-app" />;
  }
  if (mode === "store") {
    return <StoreListing onOpen={openApp} />;
  }
  return <Notebook />;
}
