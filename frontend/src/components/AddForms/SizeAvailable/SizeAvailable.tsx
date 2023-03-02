import Menu from "@/components/menu/Menu";
import { Product } from "@/types/product";
import { Sizes } from "@/types/sizes";
import { title } from "process";
import {
  ChangeEvent,
  FC,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useRef,
  useCallback,
} from "react";
import { AiOutlineDown } from "react-icons/ai";
import ImagesSlider from "./ImagesSlider/ImagesSlider";
import cl from "./sizeAvailable.module.scss";

interface SizeAvailableProps {
  color: string;
  stock: Map<string, { sizes: Sizes; photos: string[] }>;
  setStock?: Dispatch<
    SetStateAction<Map<string, { sizes: Sizes; photos: string[] }>>
  >;
  title?: string;
}

const SizeAvailable: FC<SizeAvailableProps> = ({
  color,
  stock,
  setStock,
  title,
}) => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [sizes, setSizes] = useState<Sizes>({
    _36: 0,
    _37: 0,
    _38: 0,
    _39: 0,
    _40: 0,
    _41: 0,
    _42: 0,
    _43: 0,
    _44: 0,
    _45: 0,
    _46: 0,
    _47: 0,
  });

  const onChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>, size: string) => {
      setSizes({
        ...sizes,
        [size]: Number(e.target.value) || 0,
      });
    },
    [sizes]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (setStock) setStock(new Map(stock).set(color, { sizes, photos }));
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [sizes, photos]);

  useEffect(() => {
    const temp = stock.get(color);
    if (!temp) return;
    setSizes(temp?.sizes);
    setPhotos(temp?.photos);
  }, [stock]);

  let inputs = Object.keys(sizes).map((size) => {
    return (
      <div className={cl.size} key={size}>
        {size.slice(1)}{" "}
        <input
          type="number"
          min={0}
          //@ts-expect-error
          value={sizes[size]}
          onChange={(e) => onChangeInput(e, size)}
        />
      </div>
    );
  });

  const uploadImages = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const convertToBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
          const fr = new FileReader();
          fr.onerror = reject;
          fr.onload = () => {
            resolve(fr.result);
          };
          fr.readAsDataURL(file);
        });
      };

      Promise.all(Array.prototype.map.call(files, convertToBase64)).then(
        (newPhotos) => {
          setPhotos([...photos, ...newPhotos]);
        }
      );
    },
    [photos]
  );

  return (
    <div className={cl.wrapper}>
      <Menu title={color}>
        <div className={cl.size}>
          <div>Size</div> <div>quantity</div>
        </div>
        {inputs}
        <label
          htmlFor={`uploadImages-${title ? `${title}-${color}` : color}`}
          className={cl.uploadImages}
        >
          Upload Photos
          <input
            type="file"
            id={`uploadImages-${title ? `${title}-${color}` : color}`}
            multiple
            onChange={(e) => uploadImages(e.target.files)}
          />
        </label>
        {<ImagesSlider images={photos} setImages={setPhotos} />}
      </Menu>
    </div>
  );
};

export default SizeAvailable;
