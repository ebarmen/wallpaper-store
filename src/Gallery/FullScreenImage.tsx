import { useEffect, useRef } from "react";
import "./Gallery.css";

function FullScreenImage({ img, onClose }: { img: any; onClose: any }) {
  const ref = useRef<any>();
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose && onClose();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClose]);
  return (
    <>
      <div className="galleryModal">
        <div className="modal_image">
          <img ref={ref} src={img} />
          <button className="buttonFullSCreenClose" onClick={() => onClose()}>
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 156.5 156.5"
              width={"25px"}
              height={"25px"}
            >
              <g>
                <path
                  d="M78.3,156.2c-43,0-78-35-78-78s35-78,78-78s78,35,78,78S121.2,156.2,78.3,156.2z M78.3,14.4c-35.2,0-63.8,28.6-63.8,63.8
		s28.6,63.8,63.8,63.8s63.8-28.6,63.8-63.8S113.4,14.4,78.3,14.4z"
                />
              </g>
              <path
                d="M88.3,78.2l23.9-23.9c2.8-2.8,2.8-7.3,0-10c-2.8-2.8-7.3-2.8-10,0L78.3,68.2L54.3,44.3c-2.8-2.8-7.3-2.8-10,0
	c-2.8,2.8-2.8,7.3,0,10l23.9,23.9l-23.9,23.9c-2.8,2.8-2.8,7.3,0,10c1.4,1.4,3.2,2.1,5,2.1s3.6-0.7,5-2.1l23.9-23.9l23.9,23.9
	c1.4,1.4,3.2,2.1,5,2.1s3.6-0.7,5-2.1c2.8-2.8,2.8-7.3,0-10L88.3,78.2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default FullScreenImage;
