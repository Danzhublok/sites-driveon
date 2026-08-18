import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PLACEHOLDER_PHOTO } from "@/lib/driveon-format";

export function VehicleGallery({ photos, title }: { photos: string[]; title: string }) {
  const images = photos.length ? photos : [PLACEHOLDER_PHOTO];
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const go = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-none bg-muted sm:aspect-[16/10]">
        <img
          src={images[index]}
          alt={`${title} - foto ${index + 1}`}
          width={1200}
          height={750}
          className="size-full object-cover"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ampliar foto"
          className="absolute right-3 top-3 rounded-full bg-background/85 p-2 backdrop-blur transition-colors hover:bg-background"
        >
          <Expand className="size-4" />
        </button>
        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/85 p-2 backdrop-blur hover:bg-background"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/85 p-2 backdrop-blur hover:bg-background"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {images.map((photo, i) => (
            <button
              key={`${photo}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={`aspect-[4/3] overflow-hidden rounded-none border-2 transition-colors ${
                i === index ? "border-brand" : "border-transparent"
              }`}
            >
              <img src={photo} alt="" loading="lazy" className="size-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <img src={images[index]} alt={title} className="w-full rounded-none object-contain" />
        </DialogContent>
      </Dialog>
    </div>
  );
}