import Thumb from "./ThumbsItem";
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import styles from "./tumbslist.module.css";

function ThumbsList({
  images,
  onThumbClick,
  imageByIndex,
  selectedIndex,
}: {
  images: string[];
  onThumbClick: (index: number) => void;
  imageByIndex: (index: number) => string;
  selectedIndex: number;
}) {
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    axis: "y",
  });

  return (
    <>
      <div className={styles.embla_thumbs}>
        <div className={styles.embla_thumbs__viewport} ref={emblaThumbsRef}>
          <div className={styles.embla_thumbs__container}>
            {images.map((image, index) => (
              <Thumb
                onClick={() => onThumbClick(index)}
                selected={index === selectedIndex}
                index={index}
                imgSrc={imageByIndex(index)}
                key={index}
                keySelected={selectedIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ThumbsList;
