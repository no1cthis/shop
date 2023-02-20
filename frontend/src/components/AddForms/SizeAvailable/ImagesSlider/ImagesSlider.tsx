import Image from "next/image";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import cl from "./imagesSlider.module.scss";

interface ImagesSliderProps {
  images: string[];
  setImages: Dispatch<SetStateAction<any[]>>;
}

const ImagesSlider: FC<ImagesSliderProps> = ({ images, setImages }) => {
  const [currentImageIndex, setCurrent] = useState<number>(-1);
  const [overImageIndex, setOver] = useState<number>(-1);
  return (
    <div className={cl.wrapper}>
      {images.map((image, i) => (
        <div className={cl.image__wrapper} key={image}>
          <span
            className={cl.close}
            onClick={() => {
              setImages([...images.slice(0, i), ...images.slice(i + 1)]);
            }}
          >
            <AiFillCloseCircle />
          </span>
          <Image
            className={`${cl.image} ${i === overImageIndex && cl.overDrag}`}
            width={230}
            height={230}
            src={image}
            alt={`image-${i + 1}`}
            draggable={true}
            onDragStart={(e) => {
              setCurrent(() => images.indexOf(image));
              // @ts-expect-error
              e.dataTransfer.setDragImage(e.target, 0, 0);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              console.log(i === overImageIndex);
              setOver(() => images.indexOf(image));
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setOver(() => -1);
            }}
            onDragEnd={(e) => {
              e.preventDefault();
              setImages(
                images.map((image, i) => {
                  if (i === currentImageIndex) return images[overImageIndex];
                  else if (i === overImageIndex)
                    return images[currentImageIndex];
                  else return image;
                })
              );
              setOver(-1);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default ImagesSlider;
