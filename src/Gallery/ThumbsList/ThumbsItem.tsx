import classNames from "classnames";
import styles from "./tumbslist.module.css";

type PropType = {
  selected: boolean;
  imgSrc: string;
  index: number;
  onClick: () => void;
  keySelected: number;
};

/*  export const Thumb: React.FC<PropType> */

export const Thumb: React.FC<PropType> = (props) => {
  const { selected, imgSrc, index, keySelected, onClick } = props;
  console.log(keySelected);
  return (
    <div
      className={classNames(
        styles.embla_thumbs__slide,
        keySelected === index && styles.embla_thumbs__slide__selected,
      )}
    >
      <button
        onClick={onClick}
        className={styles.embla_thumbs__slide__button}
        type="button"
      >
        <img
          className={styles.embla_thumbs__slide__img}
          src={imgSrc}
          alt="Your alt text"
        />
      </button>
    </div>
  );
};
export default Thumb;
