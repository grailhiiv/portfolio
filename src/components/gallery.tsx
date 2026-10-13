"use client";

import Image from "next/image";
import { imageSizes } from "@/lib/image-sizes";
import Cursor from "@/components/cursor";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

type GalleryImage = { src: string; alt: string };

export default function Gallery({
  images,
  compact = false,
}: {
  images: GalleryImage[];
  compact?: boolean;
}) {
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const move = useCallback(
    (direction: number) =>
      setActive((index) =>
        index === null
          ? null
          : (index + direction + images.length) % images.length,
      ),
    [images.length],
  );
  const close = useCallback(() => setActive(null), []);
  const isOpen = active !== null;

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!isOpen) {
      if (element.open) element.close();
      opener.current?.focus({ preventScroll: true });
      return;
    }
    element.showModal();
    closeButton.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keydown);
    };
  }, [isOpen, move]);

  return (
    <>
      <div
        className={
          compact
            ? "aspect-[3/4] overflow-hidden rounded-lg mb-3 grid grid-cols-2 gap-1"
            : "mx-[-16px] md:mx-0 grid grid-cols-3 md:grid-cols-5 gap-0.5 md:gap-1"
        }
      >
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            aria-label={`View ${image.alt}${/\d$/.test(image.alt) ? "" : ` ${index + 1}`}`}
            onClick={(event) => {
              opener.current = event.currentTarget;
              setActive(index);
            }}
            className={`${compact ? "" : "aspect-[3/4] "}relative overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 cursor-pointer group`}
          >
            <Image
              {...image}
              fill
              sizes={compact ? imageSizes.compactGallery : imageSizes.gallery}
              quality={90}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="gallery-dialog"
        aria-label="Image viewer"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={close}
      >
        <button
          ref={closeButton}
          type="button"
          aria-label="Close"
          className="gallery-control gallery-close"
          onClick={close}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1 1l14 14M15 1L1 15"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Previous"
          className="gallery-control gallery-previous"
          onClick={(event) => {
            event.stopPropagation();
            move(-1);
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 2L4 8l6 6"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next"
          className="gallery-control gallery-next"
          onClick={(event) => {
            event.stopPropagation();
            move(1);
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 2l6 6-6 6"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <AnimatePresence mode="wait">
          {active !== null && (
            <motion.div
              key={images[active].src}
              className="gallery-stage"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                {...images[active]}
                fill
                sizes="100vw"
                quality={90}
                className="object-contain"
                preload
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="gallery-count text-xs" aria-live="polite">
          {active === null ? 0 : active + 1} / {images.length}
        </div>
        {isOpen && <Cursor primary={false} />}
      </dialog>
    </>
  );
}
