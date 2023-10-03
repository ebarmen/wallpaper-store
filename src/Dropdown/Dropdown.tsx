import React, { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import styles from "./dropdown.module.css";

interface IDropdownProps {
  button: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const NOOP = () => {};

const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [ref]);

  return ref;
};

export function Dropdown({
  button,
  children,
  isOpen,
  onClose = NOOP,
  onOpen = NOOP,
}: IDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(isOpen);

  const handleOpen = () => {
    document
      .getElementById("#background_selector_button")
      ?.classList.add("test");

    if (isOpen === undefined) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleClickOutside = () => {
    setIsDropdownOpen(false);
  };

  const ref = useOutsideClick(handleClickOutside);

  useEffect(() => setIsDropdownOpen(isOpen), [isOpen]);
  useEffect(() => (isDropdownOpen ? onOpen() : onClose()), [isDropdownOpen]);

  return (
    <div ref={ref} className={styles.container}>
      <div onClick={handleOpen} className={`${isDropdownOpen ? "open" : ""}`}>
        {button}
      </div>
      <div
        className={classNames(
          styles.listContainer,
          isDropdownOpen && styles.open,
        )}
      >
        <div className={styles.list}>{children}</div>
      </div>
      {/* {isDropdownOpen && (
                <div className={styles.listContainer}>
                    <div className={styles.list}>
                        {children}
                    </div>
                </div>
            )} */}
    </div>
  );
}
