import type { Metadata } from "next";
import NotFoundContent from "@/components/not-found-content";
import "./global.css";

export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return <html lang="en"><body><NotFoundContent /></body></html>;
}
