import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { Product } from "@/types/product";
import { FETCH_PRODUCTS_BY_URL } from "@/graphQL/fetchList";
import cl from "./productPage.module.scss";
import { Sizes } from "@/types/sizes";
import Image from "next/image";
import ResizeDiv from "../ResizeDiv/ResizeDiv";
import ModalWindow from "../ModalWindow/ModalWindow";
import SizePick from "../SizePick/SizePick";
import { CartProductType } from "@/types/cartProductType";
import Loading from "../Loading/Loading";
import Link from "next/link";

const ProductPage: FC<{
  cart: CartProductType[];
  setCart: Dispatch<SetStateAction<CartProductType[]>>;
}> = ({ cart, setCart }) => {
  const timer = useRef(null);
  const detailsRef = useRef(null);
  const [data, setData] = useState<Product>();
  const [mainPhotos, setMainPhotos] = useState<string[]>([]);
  const [otherColorsPhotos, setOtgerColorsPhotos] = useState<
    { name: string; photo: string }[]
  >([]);
  const [availableSizes, setAvailableSizes] = useState<Sizes>({});
  const [isModalActive, setModalActive] = useState(false);
  const [imageForModal, setImageForModal] = useState("");
  const [modalImageSize, setModalImageSize] = useState(0);
  const [activeSize, setActiveSize] = useState<number>();
  const [changeHeight, setChangeHeight] = useState("");
  const router = useRouter();
  const [fetchByURL, { loading }] = useLazyQuery(FETCH_PRODUCTS_BY_URL, {
    onCompleted: ({ productByUrl }: { productByUrl: Product }) => {
      setData(productByUrl);

      let otherColors: { name: string; photo: string }[] = [];
      productByUrl.color.forEach((el) => {
        if (el.name === router.query.color) {
          setMainPhotos(el.photos);
          setAvailableSizes(el.sizesAvailable);
        } else {
          otherColors.push({ name: el.name, photo: el.photos[0] });
        }
      });
      setOtgerColorsPhotos(otherColors);
    },
  });

  const chooseInitSize = useCallback(() => {
    if (!data) return;
    const { allSizes } = data;
    for (
      let i = Math.floor((allSizes.length - 1) / 2), count = 1;
      i !== allSizes.length - 1;

    ) {
      const size = allSizes[i];
      // @ts-expect-error
      if (availableSizes[`_${size}`] !== 0) {
        setActiveSize(size);
        return;
      } else if (i % 2) {
        i = Math.floor((allSizes.length - 1) / 2) + Math.floor(count);
        count += 0.5;
      } else {
        i = Math.floor((allSizes.length - 1) / 2) - Math.floor(count);
        count += 0.5;
      }
    }
  }, [data]);

  useEffect(() => {
    if (!router.query.product) return;
    fetchByURL({
      variables: {
        url: `${router.query.productType}/${router.query.product}`,
      },
    });
  }, [router.query.product, router.query.color]);

  useEffect(() => {
    setModalImageSize(Math.min(window.innerHeight, window.innerWidth) - 20);
    const resize = () => {
      setModalImageSize(Math.min(window.innerHeight, window.innerWidth) - 20);
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (!detailsRef.current || loading) return;
    chooseInitSize();

    const onScroll = () => {
      if (
        window.scrollY + window.innerHeight >=
          document.body.scrollHeight - 100 &&
        // @ts-expect-error
        detailsRef.current.scrollTop > 50
      ) {
        setChangeHeight("big");
      } else setChangeHeight("small");
    };
    // @ts-expect-error
    detailsRef.current.addEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [loading]);

  const openModal = useCallback(
    (i: number) => {
      setImageForModal(mainPhotos[i]);
      setModalActive(true);
    },
    [mainPhotos]
  );

  const zoom = useCallback(
    (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
      // @ts-expect-error
      const x = e.clientX - e.target.offsetLeft;
      // @ts-expect-error
      const y = e.clientY - e.target.offsetTop;
      // @ts-expect-error
      e.target.style.transformOrigin = `${x}px ${y}px`;
      // @ts-expect-error
      e.target.style.transform = `scale(2)`;
    },
    []
  );

  const zoomOut = useCallback(
    (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
      // @ts-expect-error
      timer.current = setTimeout(() => {
        // @ts-expect-error
        e.target.style.transformOrigin = `center`;
        // @ts-expect-error
        e.target.style.transform = `scale(1)`;
      }, 300);
    },
    []
  );

  const photoArray = useMemo(
    () =>
      mainPhotos.map((photo, i) => (
        <ResizeDiv
          width={window.innerWidth > 990 && i === 0 ? "100%" : "50%"}
          key={photo}
        >
          <div
            key={photo}
            onClick={() => {
              openModal(i);
            }}
          >
            <Image src={photo} alt={`photo-${i + 1}`} fill />
          </div>
        </ResizeDiv>
      )),
    [mainPhotos]
  );

  const otherColorsElems = useMemo(
    () =>
      otherColorsPhotos.map((color) => (
        <Link
          href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${router.query.productType}/${router.query.product}/${color.name}`}
          key={color.photo}
          className={cl.colors__photo}
        >
          <Image
            width={200}
            height={200}
            alt={`This product in ${color.name} color`}
            src={color.photo}
          />
        </Link>
      )),
    [otherColorsPhotos]
  );

  const sizes = useMemo(
    () =>
      data?.allSizes.map((size) => {
        return (
          <SizePick
            size={size}
            active={size === activeSize}
            // @ts-expect-error
            setFilter={availableSizes[`_${size}`] ? setActiveSize : undefined}
            key={size}
            fontSize={22}
          />
        );
      }),
    [data, activeSize]
  );

  const addToCart = useCallback(() => {
    setCart((prev) => {
      const color = router.query.color;
      if (!data || !color) return prev;
      if (!activeSize) {
        alert("You must to pick size");
        return prev;
      }
      const { title, url, price } = data;

      const cart = [...prev];
      for (let i = 0; i < prev.length; i++) {
        if (
          cart[i].title === title &&
          cart[i].url === `${url}/${color}` &&
          cart[i].size === activeSize
        ) {
          cart[i].quantity++;
          localStorage.setItem("cart", JSON.stringify(cart));
          return cart;
        }
      }
      cart.push({
        title,
        price,
        url: `${url}/${color}`,
        color: color.toString(),
        photo: mainPhotos[0],
        size: activeSize,
        quantity: 1,
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      return cart;
    });
  }, [data, activeSize]);

  const upperCase = (text: string) => {
    return text
      .split(" ")
      .map(
        (word) => word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  };

  if (!data)
    return (
      <>
        <div className={cl.wrapper}>
          <Loading />
        </div>
      </>
    );

  return (
    <>
      <div className={cl.wrapper}>
        {!data && <Loading />}
        {window.innerWidth > 990 && (
          <div className={cl.photos}>{photoArray}</div>
        )}
        <div
          ref={detailsRef}
          className={`${cl.details} ${
            changeHeight === "big"
              ? cl.bigUp
              : changeHeight === "small"
              ? cl.smallUp
              : undefined
          }`}
        >
          <div className={cl.details__title}>{upperCase(data?.title)}</div>
          <div className={cl.details__color}>
            {
              // @ts-expect-error
              `${router.query.color?.toUpperCase()} ${data?.type.toUpperCase()}`
            }
          </div>
          <div className={cl.details__price}>${data?.price.toFixed(2)}</div>
          {window.innerWidth < 990 && (
            <div className={cl.photos}>{photoArray}</div>
          )}
          <div className={cl.details__description}>{`Sizes:`}</div>
          <div className={cl.details__sizes}>{sizes}</div>
          <div className={cl.details__description}>{data?.description}</div>
          <div
            className={cl.details__description}
          >{`Other colors of this ${data?.type}:`}</div>

          <div className={cl.details__otherColors}>{otherColorsElems}</div>
          <button className={cl.addToCart} onClick={addToCart}>
            Add to cart
          </button>
        </div>
      </div>

      {isModalActive && (
        <ModalWindow setModal={setModalActive} className={cl.modal}>
          <div>
            <Image
              width={modalImageSize}
              height={modalImageSize}
              src={imageForModal}
              alt="Big picture to consider"
              onMouseMove={zoom}
              onMouseLeave={zoomOut}
            />
          </div>
        </ModalWindow>
      )}
    </>
  );
};

export default ProductPage;
