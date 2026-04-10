"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type ListingImageGalleryProps = {
  images: string[];
  title: string;
};

export function ListingImageGallery({ images, title }: ListingImageGalleryProps) {
  const galleryImages = images.length > 0 ? images : [""];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const activeImage = galleryImages[activeIndex] ?? galleryImages[0] ?? "";

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isLightboxOpen) {
        return;
      }

      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) => (current + 1) % galleryImages.length);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => (current - 1 + galleryImages.length) % galleryImages.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryImages.length, isLightboxOpen]);

  return (
    <>
      <div className="grid gap-4">
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="group relative min-h-[340px] overflow-hidden rounded-[32px] bg-white shadow-card"
        >
          <Image
            src={activeImage}
            alt={title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            unoptimized={activeImage.startsWith("data:")}
          />
          <span className="absolute bottom-4 right-4 rounded-full bg-black/65 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            Open image
          </span>
        </button>

        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-4">
          {galleryImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-24 overflow-hidden rounded-[20px] bg-white shadow-card transition ${
                index === activeIndex ? "ring-4 ring-moss/30" : "opacity-85 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                unoptimized={image.startsWith("data:")}
              />
            </button>
          ))}
        </div>
      </div>

      {isLightboxOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setIsLightboxOpen(false)}>
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-[28px] bg-[#111]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-[70vh] min-h-[360px]">
              <Image
                src={activeImage}
                alt={title}
                fill
                className="object-contain"
                unoptimized={activeImage.startsWith("data:")}
              />
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25"
            >
              Close
            </button>

            {galleryImages.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => setActiveIndex((current) => (current - 1 + galleryImages.length) % galleryImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/25"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex((current) => (current + 1) % galleryImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/25"
                >
                  Next
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
