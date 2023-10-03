import styles from "./breadcrumbs.module.css";

function Breadcrumbs() {
  const path = window.location.pathname;
  const catalog = path.split("/")[2];
  let catalogName = "";
  if (catalog == "geo") {
    catalogName = "Обои ручной работы Гео";
  }
  if (catalog == "classic") {
    catalogName = "Обои ручной Работы Classic";
  }
  if (catalog == "pr") {
    catalogName = "Печатные обои PR";
  }
  const cartName = path.split("/")[3].replace("-", ".").toUpperCase();
  return (
    <div className={styles.breadcrums}>
      <span className={styles.fh}>
        <a
          href={`/catalog/`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Каталог
        </a>
      </span>
      <div>/</div>
      <div>
        <a
          href={`/catalog/${catalog}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          {catalogName}{" "}
        </a>
      </div>
      <div>/</div>
      <div>{cartName}</div>
    </div>
  );
}

export default Breadcrumbs;
