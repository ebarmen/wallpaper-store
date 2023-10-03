import { useState } from "react";
import styles from "./converter.module.css";

export function Converter() {
  const [link, setLink] = useState("");

  const handleChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const valueArr = e.currentTarget.value.split("; Веб ссылка: ");
    valueArr[0] = valueArr[0].split("Веб ссылка: ").join("");

    setLink(valueArr.join(""));
  };

  return (
    <div className={styles.container}>
      <textarea
        value={link}
        cols={30}
        rows={10}
        onChange={handleChange}
      ></textarea>
      <button onClick={() => setLink("")}>Очистить</button>
      <a href={link} target="_blank" rel="noopener noreferrer">
        Ваша ссылка
      </a>
    </div>
  );
}
