import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Canvas } from "./Canvas";
import { CanvasButtonsList } from "./CanvasButtonsList";
import { canvasTextureContext } from "../../context/canvasTextureContext";
import { canvasBackgroundContext } from "../../context/canvasBackgroundContext";
import { PlusIcon } from "../../Icons/PlusIcon";
import { MinusIcon } from "../../Icons/MinusIcon";
import { PanelIcon } from "../../Icons/PanelIcon";
import { ModeNames } from "../../types/namesList";
import styles from "./canvascontainer.module.css";

interface ICanvasContainerProps {
  mode: string;
  isSeamless: boolean;
  isSigned: boolean;
  isFlipped: boolean;
}

export function CanvasContainer(props: ICanvasContainerProps) {
  const { mode, isSeamless, isSigned, isFlipped } = props;
  const { imgData } = useContext(canvasTextureContext);
  const { backgroundData } = useContext(canvasBackgroundContext);
  const [canvasWidth, setCanvasWidth] = useState<number | undefined>(0);
  const [addGridSide, setAddGridSide]: [
    "right" | "left",
    Dispatch<SetStateAction<any>>,
  ] = useState("right");
  const url = new URL(window.location.href);
  const defaultDragX = url.searchParams.get("dragX")
    ? url.searchParams.get("dragX")
    : 0;
  const defaultGridCnt = url.searchParams.get("gridCnt")
    ? url.searchParams.get("gridCnt")
    : 0;
  const [gridCnt, setGridCnt] = useState(
    defaultGridCnt ? parseInt(defaultGridCnt) : 7,
  );

  const [dragX, setDragX] = useState<any>(defaultDragX);
  const minGridCnt = 7;
  const maxGridCnt = 12;

  const handlePlusClick = (side: string) => {
    const newGridCnt = gridCnt + 1 > maxGridCnt ? gridCnt : gridCnt + 1;
    setGridCnt(newGridCnt);
    setAddGridSide(side);
  };
  const handleMinusClick = (side: string) => {
    const newGridCnt = gridCnt - 1 < minGridCnt ? gridCnt : gridCnt - 1;
    setGridCnt(newGridCnt);
    setAddGridSide(side);
  };

  useEffect(() => {
    function handleResize() {
      setCanvasWidth(document.getElementById("canvas-container")?.clientWidth);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (canvasWidth && typeof defaultDragX === "string")
      setDragX(parseInt(defaultDragX) * (canvasWidth / gridCnt / 95));
  }, [canvasWidth]);

  return (
    <div id={"canvas-container"} className={styles.container}>
      {canvasWidth && (
        <Canvas
          img={imgData.img}
          backgroundImg={backgroundData.img}
          mode={mode}
          isSeamless={isSeamless}
          isSigned={isSigned}
          canvasWidth={canvasWidth}
          isFlipped={isFlipped}
          defaultGridCnt={7}
          gridCnt={gridCnt}
          addGridSide={addGridSide}
          dragX={dragX}
          onDragXChange={(newDragX) => {
            setDragX(newDragX);
          }}
        />
      )}
      {mode === ModeNames.Panels && (
        <div className={`${styles.plusMinusContainer} ${styles.left}`}>
          <div
            className={`${styles.iconContainer} ${
              gridCnt < 12 ? "" : styles.disabled
            }`}
            onClick={() => handlePlusClick("right")}
          >
            <PlusIcon />
          </div>
          <div className={styles.iconPanelContainer}>
            <PanelIcon />
          </div>
          <div
            className={`${styles.iconContainer} ${
              gridCnt > 7 ? "" : styles.disabled
            }`}
            onClick={() => handleMinusClick("right")}
          >
            <MinusIcon />
          </div>
        </div>
      )}

      {canvasWidth && (
        <CanvasButtonsList
          gridCnt={gridCnt}
          dragX={Math.round(dragX / (canvasWidth / gridCnt / 95))}
        />
      )}

      {mode === ModeNames.Panels && (
        <div className={`${styles.plusMinusContainer} ${styles.right}`}>
          <div
            className={`${styles.iconContainer} ${
              gridCnt > 7 ? "" : styles.disabled
            }`}
            onClick={() => handleMinusClick("right")}
          >
            <MinusIcon />
          </div>
          <div className={styles.iconPanelContainer}>
            <PanelIcon />
          </div>
          <div
            className={`${styles.iconContainer} ${
              gridCnt < 12 ? "" : styles.disabled
            }`}
            onClick={() => handlePlusClick("right")}
          >
            <PlusIcon />
          </div>
        </div>
      )}
    </div>
  );
}
