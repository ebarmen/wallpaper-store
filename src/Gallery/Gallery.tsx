import React, { useState, useEffect, useCallback, useMemo } from "react";
import useEmblaCarousel, { EmblaCarouselType, EmblaOptionsType } from "embla-carousel-react";
import { Thumb } from "./EmblaCarouselThumbsButton";
import axios from "axios";
import "./Gallery.css";
import { NextButton, PrevButton } from "./ArrowGallery";
import ModalWindow from "../Modal/Modal";
import { useCartData, useCartInfoData } from "../hooks/useCartData";
import FullScreenImage from "./FullScreenImage";
import ThumbsList from "./ThumbsList/ThumbsList";




const options: EmblaOptionsType = { loop: true }

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};


const EmblaCarousel: React.FC<PropType> = (props) => {
  
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [images, setImages]= useState<string[]>()
  const [isVisible, setIsVisible] = useState(false)
  const [cartImgData] = useCartData()
  const [isvisibFullscreenImage, setIsvisibFullscreenImage] = useState<boolean>(false);
  const [info, setInfo]= useState<any>()
  
const goToAnchor = ()=>{
  window.location.href = "#element_name";
}

const onClose =() => {
  setIsVisible(false)
}
const onCloseFullScreenImage = () => {
  setIsvisibFullscreenImage(false)
} 
  
  const imageByIndex = (index: number): string => {
    if (images) {
      return images[index % images.length];
    }
    return "";
  };
  
  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  )
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  )
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index) ,
    [emblaApi]
  )

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList())
  }, [])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])
  const [cartInfoData] = useCartInfoData();
  
  useEffect(() => {
    if (!emblaApi) return

    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on('reInit', onInit)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onInit, onSelect])
  useEffect(() => {
   setInfo(cartInfoData)
}, []);
useEffect(() => {
  const domContainer = document.querySelector('#constructor_app');
 const JSONCartData = domContainer?.getAttribute('data-cartimgdata');
 const CartData = JSONCartData ? JSON.parse(JSONCartData) : '';
 let srcData = CartData && CartData.map((i:any)=> 'https://dev.fresq.ru/' + i)

 setImages(srcData);
}, []);
  
  return (
    <>
    <div className="header_cart_container">
    {images && <ThumbsList images={images} selectedIndex={selectedIndex}  onThumbClick={scrollTo}  imageByIndex={imageByIndex}/>}
      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {images && images.map((item,index) => (
              <div className="embla__slide" key={index}>
                <img
                  className="embla__slide__img"
                  src={imageByIndex(index)}
                  alt="Your alt text"
                />
              </div>
            ))}
          </div>
          <button className='fullscreenButtonGallery' onClick={()=> setIsvisibFullscreenImage(true)}>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
//@ts-ignore
	 viewBox="0 0 156.5 156.5" /* style="enable-background:new 0 0 156.5 156.5;" */ /* xml:space="preserve" */>
   <g>
     <path d="M59.1,0.1H8.9C4,0.1,0.1,4,0.1,8.9v50.2c0,3.9,3.2,7.1,7.1,7.1s7.1-3.2,7.1-7.1V24.3L47,57.1c1.4,1.4,3.2,2.1,5,2.1
       s3.6-0.7,5-2.1c2.8-2.8,2.8-7.3,0-10L24.3,14.3h34.8c3.9,0,7.1-3.2,7.1-7.1S63,0.1,59.1,0.1z"/>
     <path d="M149.3,90.4c-3.9,0-7.1,3.2-7.1,7.1v34.8l-32.8-32.8c-2.8-2.8-7.3-2.8-10,0s-2.8,7.3,0,10l32.8,32.8H97.4
       c-3.9,0-7.1,3.2-7.1,7.1s3.2,7.1,7.1,7.1h50.2c4.8,0,8.8-3.9,8.8-8.8V97.4C156.4,93.5,153.2,90.4,149.3,90.4z"/>
   </g>
   </svg>
          </button>
        </div>

        <div className="embla__buttons">
          <PrevButton onClick={scrollPrev} disabled={prevBtnDisabled} />
          <NextButton onClick={scrollNext} disabled={nextBtnDisabled} />
        </div>
      
      </div>
      <div className="present_container">
        <div className="present_title">
          <div className="present_title-name">Обои ручной работы <br/> <span className="cart-name">{cartInfoData && cartInfoData.name} </span></div>
          <div className="begin_price">от {cartInfoData && cartInfoData.price} р./м2</div>
        </div>
        <div className="present_description">Графические линейные коллекции обоев выполнены метализированными чернилами.Графические линейные коллекции обоев выполнены метализированными чернилами.Графические линейные коллекции обоев выполнены метализированными чернилами</div>
        <div className="present_buttons">
          <button className="header_buttons hb1" onClick={()=> setIsVisible(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256">
<g fillOpacity="1"  fillRule="nonzero" stroke="none" strokeWidth="5" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="800" fontSize="none" textAnchor="none" ><g transform="scale(5.12,5.12)"><path strokeWidth="6" d="M42.875,8.625c-0.03125,0.00781 -0.0625,0.01953 -0.09375,0.03125c-0.26172,0.06641 -0.48828,0.23438 -0.625,0.46875l-20.4375,31.6875l-14.0625,-12.6875c-0.24609,-0.3125 -0.65625,-0.44922 -1.04297,-0.34766c-0.38672,0.10156 -0.67187,0.42578 -0.73047,0.82031c-0.05859,0.39453 0.12109,0.78516 0.46094,0.99609l14.90625,13.5c0.21875,0.19141 0.51172,0.27734 0.80078,0.23438c0.28906,-0.04297 0.54297,-0.20703 0.69922,-0.45312l21.09375,-32.6875c0.23047,-0.32812 0.24219,-0.76172 0.03125,-1.10156c-0.21094,-0.33984 -0.60547,-0.51953 -1,-0.46094z"></path></g></g>
</svg>
               Заказать образец 1000р.
          </button>
          <button className="header_buttons hb2" onClick={goToAnchor}>Рассчитать стоимость обоев</button>
          <button className="header_buttons hb3" onClick={()=> setIsVisible(true)}>Написать менеджеру в Whatsapp</button>
        </div>
      </div>
      </div>
      {isvisibFullscreenImage && <FullScreenImage img={imageByIndex(selectedIndex)} onClose={onCloseFullScreenImage}/>}
      <ModalWindow text={'Написать в WhatsApp'} isVisible={isVisible} onClose={onClose}/>
    </>
  )
}

export default EmblaCarousel

