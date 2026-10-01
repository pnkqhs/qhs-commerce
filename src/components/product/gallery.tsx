'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const items = [...new Set(images.filter(Boolean))];
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const start = useRef<number | null>(null);
  const swiped = useRef(false);
  const next = (delta: number) => setActive((i) => (i + delta + items.length) % items.length);
  if (!items.length) return <div className="detail-image image-empty">{name}</div>;
  return (
    <div
      className="product-gallery"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          next(1);
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          next(-1);
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="gallery-main"
        aria-label={`Phóng to ảnh ${name}`}
        onClick={() => {
          if (!swiped.current) dialog.current?.showModal();
          swiped.current = false;
        }}
        onPointerDown={(e) => {
          start.current = e.clientX;
          swiped.current = false;
        }}
        onPointerUp={(e) => {
          if (start.current !== null && Math.abs(e.clientX - start.current) > 50) {
            swiped.current = true;
            next(e.clientX < start.current ? 1 : -1);
          }
          start.current = null;
        }}
      >
        <Image
          key={items[active]}
          src={items[active]}
          width={900}
          height={700}
          sizes="(max-width:760px) 100vw, 50vw"
          alt={`${name} — ảnh ${active + 1}`}
          loading="eager"
          fetchPriority="high"
        />
        <span>
          <ZoomIn size={17} /> Xem ảnh lớn
        </span>
      </button>
      {items.length > 1 && (
        <div className="gallery-thumbnails" aria-label="Chọn ảnh sản phẩm">
          {items.map((src, i) => (
            <button
              type="button"
              key={src}
              aria-label={`Xem ảnh ${i + 1}`}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            >
              <Image src={src} width={120} height={90} sizes="90px" alt="" />
            </button>
          ))}
        </div>
      )}
      <dialog
        ref={dialog}
        className="image-lightbox"
        aria-label={`Ảnh ${name}`}
        onClose={() => trigger.current?.focus()}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button
          type="button"
          className="lightbox-close"
          aria-label="Đóng ảnh"
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        <div className="lightbox-content">
          <Image
            src={items[active]}
            width={1400}
            height={1000}
            sizes="90vw"
            alt={`${name} — ảnh ${active + 1}`}
          />
          <p>
            {name} · {active + 1}/{items.length}
          </p>
          {items.length > 1 && (
            <div className="lightbox-controls">
              <button type="button" aria-label="Ảnh trước" onClick={() => next(-1)}>
                <ChevronLeft />
              </button>
              <button type="button" aria-label="Ảnh sau" onClick={() => next(1)}>
                <ChevronRight />
              </button>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
