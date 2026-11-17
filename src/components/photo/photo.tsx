// Licensed local images are sized and compressed before inclusion; no runtime image service.
import { component$ } from "@builder.io/qwik";
import { photos, type PhotoKey } from "~/data/photos";

export const Photo = component$<{
  image: PhotoKey;
  class?: string;
  eager?: boolean;
}>(({ image, class: className, eager = false }) => {
  const photo = photos[image];
  const small = "small" in photo ? photo.small : undefined;
  return (
    <img
      src={photo.src}
      srcset={small ? small + " 900w, " + photo.src + " 2200w" : undefined}
      sizes={small ? "100vw" : undefined}
      width={photo.width}
      height={photo.height}
      alt={photo.alt}
      class={className}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
    />
  );
});
