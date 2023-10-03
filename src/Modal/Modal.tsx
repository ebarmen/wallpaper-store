import classNames from "classnames";
import { useEffect, useRef } from "react";
import styles from "./modal.module.css";

function ModalWindow({
  text,
  isVisible,
  onClose,
}: {
  text: string;
  isVisible: boolean;
  onClose: any;
}) {
  const ref = useRef<any>(null);

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
      {isVisible && (
        <div className={styles.modal}>
          <div ref={ref} className={styles.form}>
            <div className={styles.title}>{text}</div>

            <div className={classNames(styles.input_container, styles.ic1)}>
              <input
                id="firstname"
                className={styles.input}
                type="text"
                placeholder=" "
              />
              <div className={styles.cut}></div>
              <label htmlFor="firstname" className={styles.placeholder}>
                Имя
              </label>
            </div>
            <div className={classNames(styles.input_container, styles.ic2)}>
              <input
                id="lastname"
                className={styles.input}
                type="text"
                placeholder=" "
              />
              <div className={styles.cut}></div>
              <label htmlFor="lastname" className={styles.placeholder}>
                Телефон
              </label>
            </div>
            <div className={classNames(styles.input_container, styles.ic2)}>
              <input
                id="email"
                className={styles.input}
                type="text"
                placeholder=" "
              />
              <div className={classNames(styles.cut, styles.cut_short)}></div>
              <label htmlFor="email" className={styles.placeholder}>
                Email
              </label>
            </div>
            <button type="submit" className={styles.submit}>
              Написать
            </button>
            <button className={styles.closeButton} onClick={() => onClose()}>
              <svg
                width={"30px"}
                height={"30px"}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="1"
                  y1="11"
                  x2="11"
                  y2="1"
                  stroke="black"
                  stroke-width="2"
                />
                <line
                  x1="1"
                  y1="1"
                  x2="11"
                  y2="11"
                  stroke="black"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ModalWindow;
