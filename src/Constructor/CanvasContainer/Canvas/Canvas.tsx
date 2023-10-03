import { useContext, useEffect, useState } from "react";
import { Stage, Layer, Image as KImage, Line, Path, Rect } from "react-konva";
import { HandFrame } from "./HandFrame";
import { CategoryNames, ModeNames } from "../../../types/namesList";
import { canvasHandFrameDataContext } from "../../../context/canvasHandFrameDataContext";
import { canvasTextureContext } from "../../../context/canvasTextureContext";

interface ICanvasProps {
  img: string;
  backgroundImg: string;
  mode: string;
  isSeamless: boolean;
  isSigned: boolean;
  canvasWidth: number;
  isFlipped: boolean;
  defaultGridCnt: number;
  gridCnt: number;
  addGridSide: "left" | "right";
  dragX: number;
  onDragXChange: (newDragX: number) => void;
}

export const Canvas = ({
  canvasWidth,
  img,
  backgroundImg,
  mode,
  isSeamless,
  isSigned,
  isFlipped,
  defaultGridCnt,
  gridCnt,
  addGridSide = "right",
  dragX,
  onDragXChange,
}: ICanvasProps) => {
  const [grid, setGrid] = useState(canvasWidth / gridCnt);

  const { handFrameData, setHandFrameData } = useContext(
    canvasHandFrameDataContext,
  );
  const { imgData } = useContext(canvasTextureContext);

  const [isFirstRender, setIsFirstRender] = useState(true);
  const [canvasImage, setCanvasImage] = useState<CanvasImageSource | null>(
    null,
  );
  const [canvasBackgroundImage, setCanvasBackgroundImage] =
    useState<CanvasImageSource | null>(null);
  // const [canvasSignature, setCanvasSignature] = useState<CanvasImageSource | null>(null);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const realGridWidth = 95;
  const realWidth = 665;
  const realHeight = 290;
  const commonScaleX = 0.98;
  const commonScaleY = 0.95;
  const indentX = 10;
  const indentY = 7;
  const scaleX = grid / realGridWidth;
  const panelLines: any = [];
  const images: any = [];
  const backgroundImages: any = [];
  const url = new URL(window.location.href);
  const getHandFrame = url.searchParams.get("handFrame");
  const initialHandFrame = {
    x: getHandFrame
      ? JSON.parse(getHandFrame).x * scaleX
      : (canvasWidth - handFrameData.width * scaleX) / 2,
    y: getHandFrame
      ? JSON.parse(getHandFrame).y * scaleX
      : // : (canvasHeight - handFrameData.height) / 2
        handFrameData.y * scaleX,
    width: getHandFrame
      ? JSON.parse(getHandFrame).width * scaleX
      : handFrameData.width * scaleX,
    height: getHandFrame
      ? JSON.parse(getHandFrame).height * scaleX
      : handFrameData.height * scaleX,
    id: "handFrame",
  };

  const [handFrame, setHandFrame] = useState<any>(initialHandFrame);

  useEffect(() => {
    if (!img) return;
    if (!backgroundImg) return;

    const newGrid = canvasWidth / gridCnt;
    const imageObj = new window.Image();
    const backgroundImgObj = new window.Image();
    const addWidth = (gridCnt - defaultGridCnt) * newGrid;
    const newCanvasHeight = (canvasWidth - addWidth) * (realHeight / realWidth);

    imageObj.src = `${img}`;
    backgroundImgObj.src = `${backgroundImg}`;

    setGrid(newGrid);
    setCanvasHeight(newCanvasHeight);

    imageObj.onload = function () {
      imageObj.width = imageObj.width * (newCanvasHeight / imageObj.height);
      imageObj.height = newCanvasHeight;
      backgroundImgObj.height = newCanvasHeight;
      setCanvasImage(imageObj);
      setCanvasBackgroundImage(backgroundImgObj);
    };

    if (canvasHeight && newCanvasHeight && mode === ModeNames.Panels) {
      const newDragX =
        addGridSide === "right"
          ? (dragX * newGrid) / grid
          : newGrid < grid
          ? (dragX * newGrid) / grid + newGrid
          : (dragX * newGrid) / grid - newGrid;
      const newHandFrameData = {
        x:
          addGridSide === "right"
            ? Math.floor(
                ((handFrame.width + handFrame.x) * newCanvasHeight) /
                  canvasHeight,
              ) <= canvasWidth
              ? handFrame.x * (newCanvasHeight / canvasHeight)
              : handFrame.x > 0
              ? handFrame.x * (newCanvasHeight / canvasHeight) - newGrid
              : handFrame.x * (newCanvasHeight / canvasHeight)
            : newGrid < grid
            ? handFrame.x * (newCanvasHeight / canvasHeight) + newGrid
            : handFrame.x * (newCanvasHeight / canvasHeight) - newGrid > 0
            ? handFrame.x * (newCanvasHeight / canvasHeight) - newGrid
            : 0,
        width:
          newCanvasHeight * (handFrame.width / handFrame.height) < canvasWidth
            ? newCanvasHeight * (handFrame.width / handFrame.height)
            : newCanvasHeight * (handFrame.width / handFrame.height) - newGrid >
              0
            ? // ? newCanvasHeight * (handFrame.width / handFrame.height) - newGrid
              newCanvasHeight * (handFrame.width / handFrame.height)
            : newGrid,
        y: handFrame.y,
        height: newCanvasHeight,
      };

      setHandFrame(newHandFrameData);
      onDragXChange(newDragX);
    }
    // }, [img, backgroundImg, gridCnt]);
  }, [img, backgroundImg, gridCnt, canvasHeight, handFrameData]);

  if (canvasWidth && !isSeamless && imgData.catalog !== CategoryNames.Pr) {
    const gridCount = Math.floor(canvasWidth / grid);
    for (let i = -gridCount; i < gridCount * 2; i++) {
      panelLines.push(
        <Line
          strokeWidth={2}
          stroke={"white"}
          points={[i * grid, 0, i * grid, canvasWidth]}
          key={Math.random() * Math.random()}
        />,
      );
    }
  }

  if (
    canvasImage &&
    canvasImage.width !== undefined &&
    canvasBackgroundImage &&
    canvasWidth
  ) {
    const imageCnt =
      Math.ceil((realGridWidth * gridCnt) / +canvasImage.width) === Infinity
        ? 3
        : Math.ceil((realGridWidth * gridCnt) / +canvasImage.width);

    for (let i = -imageCnt - 1; i <= (imageCnt + 1) * 2; i++) {
      //+1 to fullFill all background
      images.push(
        <KImage
          image={canvasImage}
          width={
            typeof canvasImage.width === "number" ? canvasImage.width + 1 : 0
          }
          height={canvasHeight}
          x={
            i * (typeof canvasImage.width === "number" ? canvasImage.width : 0)
          }
          key={Math.random() * Math.random()}
          scaleX={isFlipped ? -1 : 1}
        />,
      );
    }

    for (let i = -canvasWidth / grid; i < (canvasWidth / grid) * 2; i++) {
      backgroundImages.push(
        <KImage
          image={canvasBackgroundImage}
          width={grid + 1}
          height={canvasHeight}
          x={i * grid}
          key={Math.random() * Math.random()}
        />,
      );
    }
  }

  const handleChangeSize = (newAttrs: any) => {
    setHandFrame(newAttrs);

    setHandFrameData({
      width: newAttrs.width / scaleX,
      height: newAttrs.height / scaleX,
      x: newAttrs.x / scaleX,
      y: newAttrs.y / scaleX,
    });
  };

  // Ввод размеров с клавиатуры
  useEffect(() => {
    let width = handFrameData.width,
      height = handFrameData.height,
      x = handFrameData.x,
      y = handFrameData.y;

    if (
      canvasWidth &&
      handFrameData.x + handFrameData.width > canvasWidth / scaleX
    ) {
      width = canvasWidth / scaleX - handFrameData.x;

      setHandFrame({
        ...handFrame,
        width: width * scaleX,
      });

      setHandFrameData({
        ...handFrameData,
        width: width,
      });
    } else if (canvasWidth && handFrameData.width < grid / scaleX) {
      width = grid / scaleX;

      setHandFrame({
        ...handFrame,
        width: width * scaleX,
      });

      setHandFrameData({
        ...handFrameData,
        width: width,
      });
    } else if (
      canvasHeight &&
      handFrameData.y + handFrameData.height > canvasHeight / scaleX
    ) {
      height = canvasHeight / scaleX;

      setHandFrame({
        ...handFrame,
        height: height * scaleX,
      });

      setHandFrameData({
        ...handFrameData,
        height: height,
      });
    } else if (canvasHeight && handFrameData.height < 100) {
      height = 100;

      setHandFrame({
        ...handFrame,
        height: height * scaleX,
      });

      setHandFrameData({
        ...handFrameData,
        height: height,
      });
    } else if (!isFirstRender) {
      setHandFrame({
        ...handFrame,
        x: x * scaleX,
        y: y * scaleX,
        width: width * scaleX,
        height: height * scaleX,
      });
    } else {
      setIsFirstRender(false);
    }
  }, [handFrameData]);

  useEffect(() => {
    function handleResize() {
      const newGrid = canvasWidth / gridCnt;
      const addWidth = (gridCnt - defaultGridCnt) * newGrid;
      const newCanvasHeight =
        (canvasWidth - addWidth) * (realHeight / realWidth);
      setCanvasHeight(newCanvasHeight);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [canvasWidth]);

  return (
    <Stage
      width={canvasWidth}
      height={canvasHeight}
      className={"js-canvas-pdf"}
      scaleY={commonScaleY}
      offsetY={-indentY}
    >
      <Layer x={dragX} scaleX={commonScaleX} offsetX={-indentX}>
        {canvasBackgroundImage &&
          backgroundImages.map((image: string) => {
            return image;
          })}
        {canvasImage &&
          images.map((image: string) => {
            return image;
          })}
        {handFrame &&
          !isSeamless &&
          panelLines.map((panel: any) => {
            return panel;
          })}
      </Layer>

      <Layer x={0} y={-1}>
        <Rect
          x={0}
          y={0}
          width={indentX}
          height={canvasHeight + 2}
          fill={"#FFFFFF"}
        />
      </Layer>

      <Layer
        x={canvasWidth - (canvasWidth - canvasWidth * commonScaleX - indentX)}
        y={-1}
      >
        <Rect
          x={0}
          y={0}
          width={canvasWidth - canvasWidth * commonScaleX - indentX}
          height={canvasHeight + 2}
          fill={"#FFFFFF"}
        />
      </Layer>

      <Layer scaleX={commonScaleX} offsetX={-indentX}>
        {handFrame && canvasImage && canvasWidth && (
          <HandFrame
            mode={mode}
            shapeProps={handFrame}
            gridWidth={grid}
            maxWidth={canvasWidth}
            realWidth={realWidth}
            maxHeight={canvasHeight}
            realHeight={realHeight}
            dragX={dragX}
            scale={scaleX}
            commonScaleX={commonScaleX}
            commonScaleY={commonScaleY}
            indentX={indentX}
            indentY={indentY}
            onMoveBackground={function (newPos: number) {
              onDragXChange(newPos);
            }}
            onChangeSize={handleChangeSize}
            gridCount={Math.floor(canvasWidth / grid)}
          />
        )}
      </Layer>

      <Layer
        width={200}
        height={50}
        x={canvasWidth - 150}
        y={canvasHeight - 110}
        scaleX={0.7}
        scaleY={0.7}
      >
        {isSigned && (
          <>
            <Path
              data={
                "M45.2,78.9C45.2,78.9,45.2,78.9,45.2,78.9C45.2,78.9,45.2,78.9,45.2,78.9C45.2,78.9,45.2,78.9,45.2,78.9C45.3,78.8,45.3,78.8,45.2,78.9z"
              }
              fill={"#ff5100"}
            />
            <Path
              data={
                "M72.6,53.8c0.8-0.2,0.5-1.5-0.3-1.3c-2.9,0.9-5.8,2-8.4,3.5c-2.7,1.5-5.3,3.3-7.6,5.3c-2,1.7-3.8,3.6-5.5,5.5c-0.2-0.4-0.4-0.8-0.7-1.2c-0.7-0.7-1.8-0.8-2.6-0.2c-0.8,0.5-1.2,1.3-1.7,2.1c-0.5,0.9-1.1,1.7-1.6,2.6c-0.7,1-1.3,2.1-2,3.1c-0.2-0.8-0.3-1.7-0.1-2.6c0.1-0.5-0.5-1-0.9-1.1c-0.1,0-0.2,0-0.2,0c0-0.2-0.1-0.3-0.2-0.5c-0.6-1.3-2.1-1.7-3.3-1c-0.9,0.5-1.4,1.4-1.8,2.3c0-0.8-0.1-1.6-0.2-2.5c-0.1-1-0.2-2.2-0.7-3.1C34,63.9,32.9,63.5,32,64c-0.6,0.3-1.1,0.9-1.4,1.4c-0.4,0.7-0.5,1.4-0.7,2.2c-0.2,0.9-0.5,1.8-0.6,2.8c-0.4,2.1-0.8,4.3-1,6.5c-0.2,1.8-0.5,3.6-0.2,5.4c0.1,1.1,0.5,2.2,1.3,2.9c0.2,0.2,0.4,0.3,0.7,0.4c0,0.1-0.1,0.2-0.1,0.3c-0.1,0.2-0.2,0.5-0.2,0.6c0,0.1-0.2,0.4-0.3,0.6c-0.8,1.8-1.7,3.6-2.7,5.2c-0.5,0.8-1,1.6-1.5,2.3c-0.1,0.1-0.1,0.2-0.2,0.2c0,0-0.1,0.1-0.1,0.2c-0.1,0.2-0.2,0.3-0.4,0.5c-0.3,0.3-0.5,0.6-0.8,0.9c-0.2,0.3-0.5,0.5-0.7,0.8c1.4-3.9,2.6-7.8,3.5-11.8c0.9-4.1,1.3-8.2,1.6-12.4c0.2-2.3,0.3-4.6,0.4-6.9c0.1-2.4,0.2-4.9,0.3-7.3c0-1.8,0-3.8-0.7-5.6c-0.3-0.9-0.8-1.6-1.6-2.2c-0.9-0.6-2.2-0.7-3.2-0.4c-2.5,0.6-4.5,2.8-5.9,4.9c-1.4,2.1-2.4,4.4-3.2,6.8c-1.8,5.3-3,10.8-3.5,16.4c-0.3,2.8-0.3,5.6-0.3,8.4c0.1,2.7,0.2,5.5,1,8c0.8,2.4,2.3,4.6,4.6,5.8c0.9,0.5,2,0.7,3,0.7c-0.7,1.1-1.5,2.1-2.6,2.8c-0.8,0.6-1.8,1-2.8,1.1c-1,0.1-1.9-0.1-2.7-0.6c-1.6-1-2.7-2.9-3.4-4.6c-1.7-4.1-2.6-8.6-2.6-13c-0.1-4.5,0.7-8.9,2.2-13.1c0.7-2,1.6-4,2.7-5.8c0.4-0.6-0.6-1.2-1-0.6C6,71.9,4.3,76.5,3.6,81.3C2.8,86.1,2.9,91.2,4,95.9c0.6,2.3,1.3,4.7,2.4,6.8c1.1,2,2.7,3.9,5,4.5c2.5,0.6,5-0.5,6.8-2.1c1.2-1.1,2.2-2.5,2.9-4c0.6-0.2,1.2-0.6,1.7-0.9c1.8-1.3,3.2-3,4.5-4.8c1.2-1.7,2.2-3.5,3.1-5.3c0.7-1.4,1.3-2.9,1.9-4.4c0.2-0.1,0.5-0.2,0.7-0.4c1-0.7,1.9-1.7,2.7-2.6c0.8-0.9,1.5-1.9,2.1-3c0.1-0.1,0.1-0.2,0.2-0.3c0.5-0.3,0.8-0.7,1.1-1.1c0.5-0.8,1-1.7,1.3-2.7c0.1,0.2,0.2,0.3,0.3,0.5c0.4,0.7,1.4,0.7,1.9,0c1-1.6,2.1-3.2,3.1-4.9c0.5-0.8,1-1.6,1.5-2.4c0.2-0.4,0.5-0.7,0.7-1.1c0.1-0.2,0.1-0.1,0.2-0.3c0,0,0.1-0.1,0.1-0.1c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0.1c0,0,0,0.1,0.1,0.1c0,0.1,0.1,0.2,0.1,0.1c0,0.1,0.1,0.2,0.1,0.3c0.1,0.3,0.1,0.7,0.2,1c-1.6,2.1-3.1,4.4-4.3,6.7c-2.1,3.8-3.1,8-3.8,12.3c-0.7,4.6-0.9,9.2-0.6,13.8c0.1,2,0.4,4.1,0.9,6c0.4,1.6,0.9,3.2,1.7,4.5c0.7,1.1,1.6,2.1,2.9,2.4c1.2,0.3,2.6,0,3.6-0.9c1-0.9,1.5-2.2,1.9-3.4c0.6-1.8,0.8-3.6,1.1-5.4c0.6-4.8,0.6-9.7,0.6-14.5c-0.1-5.3-0.4-10.6-1-15.8c-0.1-1.2-0.3-2.4-0.4-3.6c-0.1-0.6-0.2-1.1-0.2-1.7c1.1-1.4,2.2-2.7,3.4-4c4-4.2,8.8-7.7,14.2-10.2C69.9,54.7,71.2,54.2,72.6,53.8z M25.3,52.7C25.3,52.7,25.3,52.6,25.3,52.7L25.3,52.7z M18.5,99.3c-0.1,0-0.1,0-0.2,0c0,0,0,0-0.1,0c0,0-0.1,0-0.1,0c-0.1,0-0.1,0-0.2,0c-0.3-0.1-0.5-0.1-0.7-0.2c0,0-0.1,0-0.1,0c0,0,0,0-0.1,0c-0.1-0.1-0.2-0.1-0.4-0.2c-0.2-0.1-0.5-0.3-0.7-0.4c0,0-0.1,0-0.1-0.1c0,0-0.1-0.1-0.1-0.1c-0.1-0.1-0.2-0.1-0.3-0.2c-0.2-0.2-0.4-0.4-0.6-0.6c-0.1-0.1-0.2-0.2-0.3-0.3c0,0,0,0,0,0c0-0.1-0.1-0.1-0.1-0.2c-0.2-0.2-0.3-0.4-0.4-0.7c-1.1-2-1.4-4.4-1.6-6.6c-0.2-2.6-0.3-5.2-0.2-7.8c0.2-5.1,1-10.3,2.3-15.2c1.2-4.4,2.6-9.2,6-12.4c0.8-0.8,1.7-1.5,2.8-1.7c0.4-0.1,0.9-0.1,1.3,0c0.1,0,0.1,0,0.2,0.1c0,0,0,0,0,0c0,0,0,0,0.1,0c0.1,0,0.1,0.1,0.2,0.1c0,0,0.1,0,0.1,0.1c0,0,0,0,0,0c0.1,0.1,0.2,0.2,0.3,0.3c0,0,0,0.1,0.1,0.1c0.1,0.1,0.1,0.2,0.1,0.2c0,0.1,0.1,0.2,0.1,0.2c0,0,0.1,0.1,0.1,0.1c0.1,0.2,0.1,0.4,0.2,0.5c0.1,0.4,0.2,0.8,0.3,1.2c0,0,0,0.1,0,0.1c0,0,0,0,0,0c0,0,0,0,0,0c0,0.1,0,0.2,0,0.3c0,0.2,0,0.4,0.1,0.7c0.1,2,0,4-0.1,5.9c-0.1,2.3-0.2,4.6-0.3,7c-0.1,2-0.2,4.1-0.4,6.1c-0.1,1-0.2,1.9-0.3,2.9c-0.1,1-0.2,1.7-0.3,2.6c-0.6,3.9-1.5,7.8-2.7,11.6c-0.7,2.1-1.4,4.3-2.3,6.4c-0.1,0-0.2,0.1-0.3,0.1c-0.1,0-0.3,0.1-0.4,0.1c0,0-0.2,0-0.2,0C19,99.3,18.7,99.3,18.5,99.3z M38.4,69.9C38.4,69.9,38.4,69.9,38.4,69.9C38.5,69.9,38.5,69.9,38.4,69.9z M36.9,73.3c0.1-0.6,0.2-1.2,0.4-1.8c0.1-0.4,0.3-0.8,0.6-1.2c0,0,0.1-0.2,0.2-0.2c0,0,0.1-0.1,0.1-0.1c0,0,0.1-0.1,0.1-0.1c0,0,0,0,0,0c0,0,0.1,0,0.1,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0.1,0c0,0,0,0,0,0c0,0,0,0,0,0.1c0,0,0,0,0,0c0,0,0,0.1,0.1,0.2c0,0,0,0.2,0,0.2c0,0.1,0,0.2,0,0.3c0,0.2,0,0.6,0,0.7c0,0.1-0.1,0.5-0.1,0.7c-0.1,0.3-0.1,0.6-0.2,0.8c-0.3,1.1-0.6,2.2-1,3.2c-0.1,0.2-0.2,0.5-0.3,0.8c0,0,0-0.1,0-0.1c-0.1-0.4-0.1-1-0.2-1.6C36.8,74.6,36.8,74,36.9,73.3z M33.1,65.9C33.1,65.9,33.1,65.9,33.1,65.9L33.1,65.9z M32.6,65.8C32.6,65.8,32.6,65.8,32.6,65.8C32.6,65.8,32.6,65.8,32.6,65.8C32.6,65.8,32.6,65.8,32.6,65.8z M30.1,80.8c0-0.8,0.1-1.6,0.1-2.3c0-0.5,0.1-0.9,0.1-1.4c0-0.2,0.1-0.4,0.1-0.7c0-0.1,0-0.2,0-0.4c0-0.1,0-0.1,0-0.2c0,0,0,0,0,0c0.1-1,0.3-2,0.5-3c0.3-1.8,0.7-3.6,1.2-5.3c0.1-0.3,0.2-0.7,0.3-1c0,0,0,0,0,0c0,0,0,0,0,0c0.1-0.1,0.1-0.2,0.2-0.3c0,0,0.1-0.1,0.1-0.1c0,0,0,0,0,0c0,0,0,0,0,0c0.1,0.4,0.2,0.9,0.3,1.3c0,0,0,0.1,0,0.1c0,0.1,0,0.2,0,0.3c0,0.2,0,0.4,0.1,0.7c0,0.4,0.1,0.9,0.1,1.3c0,0.9,0,1.9-0.1,2.8c0,0.5-0.1,1-0.1,1.4c0,0.1,0,0.3,0,0.4c0,0,0,0.1,0,0.1c0,0,0,0,0,0.1c0,0.3-0.1,0.5-0.1,0.8c-0.3,2-0.8,4-1.4,6c-0.2,0.7-0.4,1.4-0.7,2.1c0,0-0.1-0.1-0.1-0.1c0,0-0.1-0.2-0.1-0.2c0,0,0-0.1-0.1-0.1c0,0,0-0.1,0-0.1c0,0,0-0.1,0-0.1c0,0,0-0.1,0-0.1c0-0.1-0.1-0.2-0.1-0.3c0-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.1,0-0.2c0,0,0,0,0,0c0,0,0,0,0,0C30.1,81.5,30,81.2,30.1,80.8z M34,81.5c-0.1,0.1-0.2,0.3-0.3,0.4c0.4-1.5,0.8-3,1.1-4.6c0-0.1,0-0.1,0-0.2c0.1,0.8,0.4,1.5,1,2c0,0,0,0,0,0C35.2,80,34.6,80.7,34,81.5z M48.5,67.2C48.5,67.2,48.5,67.2,48.5,67.2C48.5,67.2,48.5,67.2,48.5,67.2C48.5,67.2,48.5,67.2,48.5,67.2z M44.9,111.7C44.9,111.7,45,111.8,44.9,111.7C45,111.8,44.9,111.7,44.9,111.7z M46.8,112.7C46.8,112.7,46.8,112.7,46.8,112.7C46.9,112.7,47,112.7,46.8,112.7z M47.6,112.4C47.6,112.4,47.6,112.4,47.6,112.4C47.6,112.4,47.6,112.4,47.6,112.4z M47.7,112.4C47.7,112.4,47.6,112.4,47.7,112.4C47.7,112.3,47.8,112.3,47.7,112.4z M49.4,72.6c0.6,5,1,10,1.2,15.1c0.2,4.9,0.2,9.8-0.2,14.6c-0.1,1-0.2,2-0.3,3c0,0,0,0.1,0,0.1c0,0.1,0,0.2-0.1,0.4c0,0.2-0.1,0.5-0.1,0.7c-0.1,0.4-0.2,0.9-0.2,1.3c-0.2,0.7-0.3,1.5-0.6,2.2c-0.1,0.2-0.1,0.3-0.2,0.5c0,0.1-0.1,0.2-0.1,0.2c0,0,0,0.1,0,0.1c-0.1,0.2,0,0,0-0.1c0,0.2-0.3,0.6-0.4,0.8c-0.1,0.1-0.1,0.2-0.2,0.3c0,0.1-0.1,0.1-0.1,0.2c-0.1,0.1-0.1,0.1-0.2,0.2c-0.1,0.1-0.2,0.1-0.2,0.2c0,0,0,0-0.1,0c0,0-0.1,0-0.1,0.1c-0.2,0.1-0.5,0.1-0.7,0.2c0,0-0.1,0-0.1,0c-0.1,0-0.2,0-0.3,0c-0.1,0-0.1,0-0.2,0c-0.1,0-0.1,0-0.2,0c0,0,0,0,0,0c0,0-0.2-0.1-0.2-0.1c-0.1-0.1-0.2-0.1-0.3-0.2c0,0,0,0,0,0c0,0-0.1-0.1-0.1-0.1c-0.1-0.1-0.2-0.2-0.3-0.3c0-0.1-0.1-0.1-0.1-0.2c0,0,0,0,0,0c-0.1-0.1-0.2-0.3-0.2-0.3c-0.2-0.3-0.3-0.5-0.5-0.8c-0.1-0.1-0.1-0.3-0.2-0.4c0,0,0-0.1,0-0.1c0,0,0,0,0-0.1c0-0.1,0-0.1-0.1-0.2c-0.1-0.4-0.3-0.7-0.4-1.1c-0.3-0.8-0.5-1.6-0.6-2.5c-0.1-0.4-0.2-0.9-0.2-1.3c0-0.2-0.1-0.4-0.1-0.7c0,0,0-0.1,0-0.1c0-0.1,0-0.3-0.1-0.4c-0.5-4.3-0.4-8.7,0-13c0.1-0.5,0.1-1.1,0.2-1.6c0,0,0-0.1,0-0.1c0,0,0-0.1,0-0.1c0-0.1,0-0.3,0.1-0.4c0-0.3,0.1-0.6,0.1-0.9c0.2-1,0.4-2.1,0.6-3.1c0.4-1.9,1-3.8,1.7-5.6c0,0,0,0,0,0c0,0,0,0,0-0.1c0,0,0,0,0-0.1c0,0,0,0,0,0c0-0.1,0.1-0.2,0.1-0.3c0.1-0.2,0.2-0.4,0.3-0.6c0.3-0.6,0.6-1.2,1-1.8c0.7-1.3,1.5-2.6,2.3-3.8c0.1-0.2,0.2-0.3,0.3-0.4C49.3,72.1,49.3,72.3,49.4,72.6z"
              }
              fill={"#ff5100"}
            />
            <Path
              data={
                "M58.4,90.4C58.4,90.4,58.4,90.4,58.4,90.4C58.4,90.4,58.4,90.4,58.4,90.4z"
              }
              fill={"#ff5100"}
            />
            <Path
              data={
                "M66.9,82.4c1.8-1.5,3.8-2.9,5.7-4.2c0.5-0.4,1.1-0.8,1.6-1.1c0.3-0.2,0.6-0.4,0.9-0.6c0.3-0.2,0.5-0.4,0.8-0.7c0.2-0.2,0-0.5-0.3-0.5c-0.4,0.1-0.7,0.2-1,0.3c-0.3,0.2-0.7,0.3-1,0.5c-0.7,0.3-1.4,0.6-2,1c-1.3,0.7-2.6,1.4-3.8,2.1c-1.3,0.7-2.5,1.5-3.7,2.3c-0.3,0.2-0.6,0.4-0.9,0.6c-0.1-0.8-0.2-1.5-0.3-2.3c0-0.2,0-0.5-0.1-0.7c0-0.2-0.2-0.4-0.2-0.6c1.9-1.4,3.8-2.8,5.7-4.2c1-0.8,2.1-1.5,3.1-2.3c1-0.8,1.9-1.6,3-2.3c0.3-0.2,0-0.8-0.3-0.6c-1.1,0.6-2.3,1-3.5,1.6c-1.1,0.5-2.3,1.1-3.3,1.8c-1.8,1-3.5,2.1-5.1,3.2c-0.1-0.2-0.1-0.5-0.2-0.7c-0.2-0.7-1.2-0.5-1.2,0.2c0,0.5-0.1,1.1,0,1.6c-0.4,0.4-0.6,1.1-0.2,1.6c0.1,0.1,0.2,0.2,0.3,0.3c0,0.1,0,0.1,0,0.2c-0.1,0.7,0,1.3,0.1,2c0.1,0.6,0.1,1.3,0.2,1.9c0,0.3,0.1,0.6,0.1,0.9c-0.3,0.2-0.5,0.5-0.6,0.8c-0.3,0.3-0.5,0.6-0.6,1c-0.2,0.7,0.5,1.5,1.3,1.3c0.1,0,0.2-0.1,0.3-0.1c0.2,1.3,0.3,2.5,0.5,3.8c0.2,1.4,0.4,2.8,1.1,4.1c0.5,0.8,1.6,0.3,1.4-0.6c-0.3-1.4-0.4-2.9-0.5-4.4c-0.1-1.5-0.3-2.9-0.4-4.4c0.2-0.2,0.4-0.4,0.7-0.6C65.1,83.8,66,83.2,66.9,82.4z"
              }
              fill={"#ff5100"}
            />
            <Path
              data={"M120.7,44.5C120.8,44.6,120.6,44.5,120.7,44.5L120.7,44.5z"}
              fill={"#ff5100"}
            />
            <Path
              data={
                "M112.6,54.7C112.5,54.7,112.5,54.7,112.6,54.7C112.5,54.7,112.6,54.7,112.6,54.7C112.6,54.7,112.6,54.7,112.6,54.7z"
              }
              fill={"#ff5100"}
            />
            <Path
              data={
                "M126.2,57c1.5,1.1,3.6,1.2,5.3,0.6c1.9-0.6,3.4-1.9,4.4-3.6c0.6-1,1.1-2.2,1.4-3.3c1,0.2,2.1,0.4,3.1,0.6c1.2,0.3,2.4,0.6,3.6,0.8c1.4,0.3,2.8,0.3,4.2,0c0.6-0.1,0.5-1.1-0.1-1.1c-1.6,0-3-0.6-4.5-1.1c-1.5-0.5-3-0.9-4.5-1.2c-0.4-0.1-0.8-0.2-1.3-0.3c0,0,0-0.1,0-0.1c0.3-2.2,0.6-4.5,0-6.6c-0.6-2.1-2-4-4.2-4.6c-1.3-0.3-2.6-0.1-3.7,0.4c-0.5,0.2-1.1,0.5-1.5,0.8c-0.5,0.4-0.9,0.8-1.3,1.3c-0.1,0.1-0.2,0.3-0.2,0.4c-0.3,0.2-0.5,0.5-0.7,0.7c-1.3,1.4-2.3,3.2-2.8,5c-0.6,2-0.6,4.2-0.1,6.2C123.6,54,124.5,55.9,126.2,57z M135.4,47.7C135.4,47.6,135.4,47.5,135.4,47.7L135.4,47.7z M124.9,47.2c0.2-1.8,0.9-3.6,2-5.1c0.4-0.6,0.8-1.1,1.3-1.5c0.2-0.1,0.4-0.2,0.7-0.3c0.5-0.2,0.9-0.4,1.3-0.6c0.4-0.2,0.8-0.3,1.3-0.4c0,0,0.1,0,0.1,0c0.1,0,0.2,0,0.4,0c0.1,0,0.2,0,0.3,0c0.1,0,0.1,0,0.2,0c0,0,0,0,0.1,0c0.2,0,0.4,0.1,0.5,0.1c0,0,0.2,0.1,0.2,0.1c0,0,0.1,0,0.1,0.1c0.2,0.1,0.3,0.2,0.5,0.3c0,0,0,0,0.1,0c0,0,0,0,0,0c0.1,0.1,0.2,0.1,0.2,0.2c0.1,0.1,0.2,0.3,0.4,0.4c0,0,0,0,0,0c0,0,0,0,0,0c0.1,0.1,0.1,0.2,0.2,0.2c0.1,0.2,0.2,0.3,0.3,0.5c0,0.1,0.1,0.1,0.1,0.2c0,0.1,0.1,0.1,0.1,0.2c0.7,1.7,0.6,3.5,0.4,5.4c0,0.2,0,0.4-0.1,0.6c0,0,0,0,0,0c0,0.1,0,0.2,0,0.3c0,0,0,0,0,0.1c-0.4-0.1-0.7-0.1-1.1-0.2c-0.8-0.1-1.7-0.3-2.5-0.1c-0.7,0.2-1.5,0-2.2,0.4c-0.4,0.2-0.3,0.7,0,0.9c0.5,0.3,1.2,0.4,1.7,0.5c0.3,0.1,0.6,0.3,0.9,0.3c0.3,0.1,0.7,0.1,1,0.1c0.6,0.1,1.1,0.1,1.6,0.2c0,0.1-0.1,0.2-0.1,0.3c-0.1,0.2-0.1,0.4-0.2,0.6c0,0.1-0.1,0.2-0.1,0.3c0,0,0,0.1,0,0.1c0,0,0,0,0,0.1c-0.2,0.4-0.4,0.7-0.6,1.1c-0.1,0.2-0.2,0.3-0.3,0.5c0,0.1-0.1,0.1-0.1,0.2c0,0-0.1,0.2-0.1,0.2c-0.2,0.3-0.5,0.5-0.8,0.8c0,0-0.2,0.2-0.2,0.1c0,0-0.1,0.1-0.1,0.1c-0.2,0.1-0.4,0.2-0.6,0.3c-0.2,0.1-0.3,0.2-0.5,0.2c-0.2,0.1-0.1,0,0,0c-0.1,0-0.2,0.1-0.3,0.1c-0.2,0.1-0.3,0.1-0.5,0.1c-0.1,0-0.1,0-0.2,0c-0.1,0-0.1,0-0.2,0c-0.3,0-0.7,0-1,0c-0.1,0-0.3,0,0,0c-0.1,0-0.1,0-0.2,0c-0.2,0-0.4-0.1-0.6-0.2c0,0,0,0,0,0c0,0,0,0,0,0c-0.1,0-0.2-0.1-0.2-0.1c-0.2-0.1-0.3-0.2-0.4-0.3c0,0-0.1-0.1-0.1-0.1c-0.1-0.1-0.1-0.1-0.2-0.2c-0.2-0.2-0.3-0.3-0.5-0.5c0,0,0.1,0.1,0,0c-0.1-0.1-0.1-0.2-0.2-0.3c-0.1-0.1-0.2-0.3-0.3-0.5c-0.2-0.4-0.3-0.6-0.4-1C124.9,50.7,124.7,49,124.9,47.2z"
              }
              fill={"#ff5100"}
            />
            <Path
              data={
                "M106.6,67c0.3-0.2,0.7-0.5,1.1-0.8c1.7,1.4,4.1,1.4,6.1,0.8c1.2-0.4,2.3-0.9,3.4-1.6c1-0.6,2-1.3,2.9-2.1c0.9-0.8,1.6-1.7,2.1-2.7c0.5-1.1,0.6-2.3,0.4-3.5c-0.3-1.9-1.6-3.6-3.6-3.9c-0.9-0.1-1.9,0.1-2.8,0.4c-0.9,0.3-1.8,0.6-2.8,0.9c-0.3,0.1-0.5,0.1-0.8,0.2c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0-0.1,0c-0.1,0-0.1,0-0.2,0c-0.2,0-0.3,0-0.5,0c-0.2,0-0.4,0-0.5,0c0,0-0.1,0-0.2,0c-0.1,0-0.2,0-0.2,0c-0.2,0-0.4-0.1-0.5-0.1c-0.1,0-0.1,0-0.2-0.1c0,0-0.1,0-0.1-0.1c-0.1,0-0.2-0.1-0.2-0.1c0,0-0.1-0.1-0.1-0.1c0,0-0.1-0.1-0.1-0.1c-0.1-0.1-0.1-0.1-0.1-0.2c0,0-0.1-0.1-0.1-0.2c0,0-0.1-0.2-0.1-0.2c0-0.1-0.1-0.4-0.2-0.6c0-0.1,0-0.2-0.1-0.3c0,0,0-0.1,0-0.1c0-0.1,0-0.2,0-0.3c0,0,0-0.1,0-0.1c0,0,0-0.1,0-0.1c0,0,0-0.1,0-0.2c0-0.1,0-0.2,0.1-0.2c0-0.1,0.1-0.2,0.1-0.2c0,0,0,0,0-0.1c0,0,0-0.1,0-0.1c0.1-0.1,0.2-0.3,0.3-0.4c0-0.1,0.1-0.1,0.1-0.2c0,0,0.1-0.1,0.1-0.2c0.3-0.3,0.5-0.6,0.8-0.8c0.1-0.1,0.1-0.1,0.2-0.2c0,0,0.1-0.1,0.1-0.1c0,0-0.1,0.1,0,0c0.2-0.1,0.3-0.2,0.5-0.4c0.3-0.2,0.7-0.4,1-0.7c0.6-0.4,1.2-0.8,1.8-1.1c0.1-0.1,0.3-0.1,0.4-0.2c0,0,0.1,0,0.1-0.1c0.1,0,0.2-0.1,0.3-0.1c0.4-0.1,0.8-0.3,1.2-0.4c0.8-0.2,1.6-0.4,2.3-0.6c0.2,0,0.3-0.1,0.5-0.1c0,0,0.1,0,0.1,0c0,0,0,0,0,0c0.1,0,0.2,0,0.4-0.1c0.1,0,0.1,0,0.2,0c0,0,0.1,0,0.1,0c0.1,0,0.3,0,0.4,0c-0.2,0,0,0,0.1,0c0.4,0.4,1-0.1,0.9-0.6c-0.1-0.3-0.2-0.4-0.4-0.6c0,0,0,0,0,0c0,0,0,0,0,0c-0.1-0.1-0.2-0.1-0.3-0.1c-0.1,0-0.2-0.1-0.4-0.1c-0.7-0.1-1.4-0.1-2.1,0c-1.6,0.2-3.3,0.6-4.7,1.4c-1.4,0.7-2.8,1.6-4,2.6c-1.3,1.1-2.3,2.6-2.1,4.3c0.1,1,0.4,1.9,1,2.7c0.5,0.6,1.4,1,2.2,1.2c0.7,0.2,1.5,0.2,2.3,0.2c0.7-0.1,1.4-0.3,2.1-0.5c0.9-0.3,1.9-0.6,2.9-0.8c0.2,0,0.4-0.1,0.7-0.1c0,0,0.1,0,0.1,0c0.1,0,0.3,0,0.4,0c0,0,0.2,0,0.2,0c0,0,0.2,0,0.2,0c0.1,0,0.2,0,0.2,0.1c0,0,0.1,0.1,0.2,0.1c0,0,0.1,0.1,0.1,0.1c0,0,0.1,0.1,0.2,0.1c0.1,0.1,0.1,0.1,0.2,0.2c0,0,0,0,0,0c0,0,0.1,0.1,0.1,0.1c0.1,0.2,0.2,0.3,0.3,0.5c0,0,0,0,0,0.1c0,0,0,0,0,0.1c0,0.1,0.1,0.2,0.1,0.3c0.3,0.9,0.3,1.8-0.1,2.7c-0.8,2-2.9,3.2-4.7,4.2c-1,0.5-2,1-3.1,1.3c-0.5,0.1-0.9,0.2-1.5,0.1c-0.1,0-0.2,0-0.4,0c-0.2,0,0,0-0.2,0c-0.3,0-0.6-0.1-0.8-0.2c-0.5-0.1-0.9-0.3-1.3-0.6c-0.5-0.3-1,0-1.2,0.4c-0.5,0.2-1.1,0.5-1.5,0.7c-0.7,0.4-1.3,0.7-2,1.1c-1.3,0.7-2.6,1.5-3.9,2.2c-1.3,0.7-2.5,1.4-3.8,2.2c-0.1-0.6-0.2-1.2-0.3-1.8c-0.1-0.8-0.2-1.6-0.3-2.4c1.8-1.2,3.6-2.5,5.3-3.8c1-0.8,2.1-1.6,3.1-2.4c0.5-0.4,1-0.8,1.5-1.2c0.5-0.4,0.8-0.9,1.2-1.4c0.2-0.2-0.1-0.6-0.4-0.5c-0.6,0.2-1.2,0.4-1.7,0.8c-0.5,0.3-1,0.7-1.6,1.1c-1,0.7-2,1.4-3.1,2.1c-1.5,1-3.1,1.9-4.6,2.9c-0.1-0.8-0.2-1.6-0.3-2.5c-0.1-0.6-0.1-1.1-0.2-1.7c0.1-0.1,0.2-0.2,0.3-0.3c0,0,0.1-0.1,0.1-0.1c0,0,0.1-0.1,0.2-0.1c0.5-0.3,0.9-0.6,1.4-0.9c0.5-0.3,0.9-0.6,1.4-0.9c0.5-0.3,0.9-0.7,1.4-1c0.9-0.6,1.9-1.2,2.8-1.8c0.9-0.7,1.8-1.5,2.7-2.1c0.3-0.2,0-0.6-0.3-0.5c-1.1,0.5-2.3,0.9-3.3,1.5c-1,0.6-2.1,1.2-3.1,1.7c-1.1,0.5-2.1,1.1-3.1,1.7c-0.2,0.1-0.5,0.3-0.7,0.4c-0.1-0.1-0.2-0.2-0.3-0.2c-0.2-0.1-0.6-0.1-0.7,0.2c-0.2,0.4-0.2,0.8-0.2,1.2c-0.1,0.3-0.2,0.6-0.1,1c0,0.1,0.1,0.2,0.1,0.2c0,0.4,0,0.9,0.1,1.3c0.1,1.3,0.2,2.6,0.3,3.8c0,0,0,0.1,0,0.1c-0.1,0.1-0.2,0.2-0.3,0.3c-0.7,0.7-0.2,1.8,0.6,2c0.1,0.5,0.1,0.9,0.2,1.4c0.1,1,0.3,2.1,0.5,3.1c-0.9,0.6-1.6,1.5-0.9,2.7c0.2,0.4,0.8,0.7,1.3,0.5c0.1,0,0.2-0.1,0.2-0.1c0.1,0.7,0.3,1.3,0.6,1.9c0.3,0.6,1.2,0.3,1.2-0.3c0.1-0.7-0.1-1.3-0.2-2c-0.1-0.3-0.1-0.7-0.2-1c0,0,0,0,0,0c0.5-0.4,1.1-0.7,1.6-1.1c1.2-0.8,2.3-1.5,3.5-2.3c1.1-0.8,2.3-1.5,3.4-2.2C105.5,67.8,106.1,67.4,106.6,67z M120.3,45.8C120.3,45.8,120.3,45.8,120.3,45.8C120.3,45.8,120.3,45.8,120.3,45.8C120.3,45.8,120.3,45.8,120.3,45.8z M120.3,45.8C120.3,45.8,120.3,45.8,120.3,45.8C120.3,45.8,120.3,45.8,120.3,45.8C120.3,45.8,120.3,45.8,120.3,45.8z M120.4,45.8C120.4,45.8,120.3,45.8,120.4,45.8c-0.1,0-0.1,0-0.1,0C120.4,45.8,120.4,45.8,120.4,45.8z"
              }
              fill={"#ff5100"}
            />
            <Path
              data={
                "M92.9,76.7c-0.8-0.9-1.9-1.6-3-2.1c-1.1-0.5-2.3-0.9-3.5-1.2c-1-0.2-2-0.4-3-0.4c0.9-0.7,1.8-1.4,2.6-2.1c1.7-1.4,3.2-3,4.4-4.8c0.6-0.9,1-1.9,1-3c-0.1-1.3-0.9-2.3-2.2-2.5C88,60.5,87,60.9,86,61.3c-1.1,0.4-2.1,0.9-3,1.5c-1.9,1.2-3.6,2.5-5.2,4c-0.1-0.3-0.2-0.5-0.3-0.8c-0.1-0.5-0.9-0.4-0.9,0.1c0,0.7,0,1.3,0.1,2c0,0.7,0.1,1.4,0.2,2.1c0.1,1.1,0.2,2.2,0.3,3.3c-0.4,0.3-0.6,0.7-0.5,1.2c0.1,0.5,0.3,0.8,0.7,1c0.2,2.2,0.5,4.4,0.7,6.6c0.1,0.7,0.2,1.5,0.3,2.2c0.1,0.9,0.1,1.8,0.6,2.6c0.5,0.7,1.4,0.5,1.7-0.2c0.3-0.7,0.1-1.4,0.1-2.1c-0.1-0.7-0.2-1.4-0.3-2.1c-0.2-1.3-0.4-2.7-0.5-4c-0.1-1-0.3-2-0.4-3c0.2,0,0.4-0.1,0.6-0.1c0.7-0.1,1.3-0.2,1.9-0.3c1.3-0.1,2.7-0.2,4-0.2c2.3,0,4.5,1,6.3,2.3C92.8,77.7,93.2,77.1,92.9,76.7z M88.8,63.1C88.8,63.1,88.8,63.1,88.8,63.1C88.8,63.1,88.8,63.1,88.8,63.1z M88.8,63.1C88.8,63.1,88.8,63.1,88.8,63.1C88.7,63.1,88.7,63.1,88.8,63.1C88.7,63.1,88.7,63,88.8,63.1z M82.7,65c0.8-0.4,1.7-0.9,2.6-1.2c0.4-0.2,0.9-0.3,1.3-0.5c0.2-0.1,0.5-0.1,0.8-0.2c0.1,0,0.2,0,0.3-0.1c0,0,0.4-0.1,0.3-0.1c0.1,0,0.1,0,0.2,0c0,0,0,0,0.1,0c0.1,0,0.2,0,0.2,0c0,0,0.2,0,0.2,0c0.1,0,0.1,0,0.2,0c0,0,0,0,0.1,0.1c0,0,0.1,0.1,0,0.1c0,0,0,0,0,0.1c0,0,0,0.2,0,0.2c0,0,0,0,0,0c0,0,0,0,0,0c0,0.1-0.1,0.3-0.1,0.4c0,0-0.1,0.2-0.1,0.2c0,0.1-0.1,0.1-0.1,0.2c-0.1,0.2-0.3,0.5-0.4,0.7c0,0.1-0.1,0.1-0.1,0.2c0,0-0.2,0.2-0.2,0.2c-0.1,0.2-0.3,0.3-0.4,0.5c-0.3,0.4-0.7,0.8-1,1.2c-0.7,0.7-1.4,1.3-2.1,2c-0.9,0.7-1.6,1.3-2.4,1.9c-0.9,0.7-1.9,1.3-2.5,2.2c-0.1,0-0.2,0-0.3,0c-0.1-0.9-0.3-1.8-0.5-2.7c-0.1-0.7-0.3-1.5-0.5-2.2c0-0.1-0.1-0.3-0.1-0.4C79.6,66.9,81.1,65.9,82.7,65z"
              }
              fill={"#ff5100"}
            />
            <Path
              data={
                "M77,96.9c-2.3-0.5-4.9,1.2-5.5,3.5c-0.1,0.3,0,0.6,0.2,0.8c-1.4,2.3-2.1,5-2.2,7.7c-0.1,1.7,0.1,3.4,0.6,5c0.4,1.7,1.2,3.4,2.7,4.4c1.4,0.9,3.4,0.9,4.6-0.2c0.7-0.7,1-1.6,1.4-2.5c0.3-0.9,0.6-1.8,0.8-2.7c0.5-2,0.8-4,0.9-6c0.1-1.9,0.1-3.8-0.2-5.7C80.1,99.3,79,97.3,77,96.9z M76.7,99.9C76.7,99.9,76.6,99.9,76.7,99.9C76.6,99.9,76.7,99.9,76.7,99.9z    M75.6,116.3C75.6,116.3,75.6,116.3,75.6,116.3L75.6,116.3z M77.7,106.1c0,0.8-0.1,1.7-0.2,2.5c0,0.2,0,0.4-0.1,0.6c0,0,0,0.1,0,0.1c0,0.1,0,0.1,0,0.2c-0.1,0.4-0.1,0.9-0.2,1.3c-0.3,1.7-0.7,3.3-1.3,4.9c0,0-0.1,0.1-0.1,0.2c0,0.1-0.1,0.1-0.1,0.2c0,0,0,0,0,0.1c0,0,0,0-0.1,0.1c0,0,0,0-0.1,0.1c0,0-0.1,0-0.1,0.1c-0.1,0-0.1,0.1-0.2,0.1c0,0,0,0,0,0c0,0,0,0,0,0c-0.1,0-0.2,0.1-0.3,0.1c0,0-0.2,0-0.3,0c-0.1,0-0.2,0-0.2,0c0,0,0,0,0,0c-0.2,0-0.3-0.1-0.5-0.1c0,0,0,0,0,0c0,0,0,0,0,0c-0.1,0-0.1-0.1-0.2-0.1c-0.1,0-0.1-0.1-0.2-0.1c0,0-0.1-0.1-0.1-0.1c-0.3-0.2-0.5-0.5-0.7-0.7c-0.4-0.6-0.7-1.2-0.9-1.9c-0.5-1.4-0.7-2.8-0.8-4.2c-0.1-2.9,0.5-5.7,1.7-8.2c0.6-0.3,1.1-0.6,1.6-1c0.2-0.1,0.3-0.2,0.5-0.3c0,0,0.2-0.1,0.2-0.1c0,0,0.1,0,0.1-0.1c0.1,0,0.2-0.1,0.4-0.1c0,0,0.1,0,0.2,0c0.1,0,0.1,0,0.2,0c0,0,0.1,0,0.2,0c0.1,0,0.1,0,0.2,0.1c0,0,0,0,0,0c0,0,0.1,0.1,0.2,0.1c0,0,0.1,0.1,0.1,0.1c0,0,0.1,0.1,0.1,0.2c0,0,0,0,0,0c0.1,0.1,0.2,0.3,0.2,0.4c0,0,0,0,0,0c0,0,0,0.1,0,0.1c0.1,0.3,0.2,0.6,0.3,0.9c0,0.2,0.1,0.4,0.1,0.5c0,0,0-0.3,0-0.1c0,0.1,0,0.1,0,0.2c0,0.4,0.1,0.8,0.1,1.3C77.7,104.4,77.7,105.2,77.7,106.1z"
              }
              fill={"#ff5100"}
            />
            <Path
              data={
                "M84.4,98.1c0-0.7,0-1.5,0-2.2c0-0.4,0-0.7-0.1-1.1c0-0.4-0.1-0.7-0.3-1c-0.1-0.2-0.3-0.1-0.4,0c-0.4,0.5-0.5,1.1-0.6,1.8c-0.1,0.7-0.2,1.3-0.3,2c-0.1,1.3-0.2,2.6-0.3,3.9c-0.1,2.6-0.2,5.2-0.1,7.8c0,1.5,0.1,3,0.2,4.4c0,0.6,0.5,1.3,1.2,1.2c0.6,0,1.3-0.5,1.2-1.2C84.6,108.5,84.4,103.3,84.4,98.1z"
              }
              fill={"#ff5100"}
            />
            <Path
              data={
                "M92,107.8c0-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.1,0,0c0,0,0-0.1,0-0.1c-0.2-0.8-1.4-0.8-1.6,0c0,0,0,0.1,0,0.1c0.1-0.1,0.1-0.1,0,0c0,0.1-0.1,0.2-0.1,0.3c0,0.1,0,0.1,0,0c-0.1,0.2-0.2,0.4-0.1,0.7c0,0.2,0.1,0.5,0.3,0.6c0,0,0,0,0,0c0.5,0.4,1,0.4,1.5,0c0,0,0,0,0,0c0.2-0.1,0.3-0.4,0.3-0.6C92.2,108.2,92.1,108,92,107.8C92.1,107.9,92.1,108,92,107.8z"
              }
              fill={"#ff5100"}
            />
            <Path
              data={
                "M94.9,89.1C94.9,89.1,94.9,89.1,94.9,89.1C94.9,89.1,94.9,89.1,94.9,89.1C94.9,89.1,94.9,89.1,94.9,89.1z"
              }
              fill={"#ff5100"}
            />
            <Path
              data={
                "M98.9,89.3c-1-1.7-2.7-3.1-4.8-3c-0.9,0-1.7,0.3-2.5,0.9c-0.4,0.3-0.8,0.6-1,1.1c-0.1,0.3-0.2,0.5-0.2,0.8c0-0.1,0-0.2,0,0.2c0,0.1,0,0.2,0,0.4c0,0.4,0.2,0.6,0.5,0.7c-1,2.3-1.4,4.8-1.3,7.3c0.1,1.8,0.4,3.6,1,5.3c0.3,0.8,0.6,1.7,1.2,2.4c0.5,0.8,1.2,1.5,2.1,1.9c1.1,0.4,2.1-0.2,2.8-1c0.6-0.6,1.1-1.3,1.6-2.1c0.9-1.4,1.5-3.1,1.9-4.7c0.4-1.7,0.5-3.4,0.2-5.1C100.3,92.6,99.9,90.8,98.9,89.3z M94.4,89c-0.1,0-0.1,0-0.1,0C94.3,88.9,94.3,89,94.4,89z M94.6,105.2C94.6,105.2,94.6,105.2,94.6,105.2C94.6,105.2,94.6,105.2,94.6,105.2C94.5,105.2,94.6,105.1,94.6,105.2z M97.9,97.2c0,0.2,0,0.4,0,0.6c0,0.1,0,0.2,0,0.2c0,0,0,0,0,0.1c0,0,0,0,0,0.1c-0.1,0.7-0.2,1.4-0.4,2.1c-0.1,0.3-0.2,0.7-0.3,1c-0.1,0.1-0.1,0.3-0.2,0.4c0,0,0,0,0,0c0,0,0,0,0,0c0,0.1-0.1,0.2-0.1,0.3c-0.3,0.7-0.7,1.3-1,1.9c-0.1,0.1-0.2,0.3-0.3,0.4c-0.1,0.1-0.1,0.2-0.2,0.2c0,0,0,0,0,0c0,0,0,0,0,0c-0.1,0.1-0.2,0.3-0.3,0.4c0,0-0.1,0.1-0.1,0.1c0,0,0,0,0,0c0,0-0.1,0-0.1,0c-0.1,0-0.2-0.1-0.2-0.1c0,0-0.1-0.1-0.1-0.1c-0.3-0.2-0.5-0.5-0.8-0.8c-0.4-0.5-0.8-1.1-1-1.7c-0.6-1.4-0.9-2.9-1.1-4.4c-0.3-2.9,0.1-5.9,1.1-8.7c0.1-0.1,0.2-0.2,0.4-0.2c0.1,0,0.1-0.1,0.2-0.1c0,0,0,0,0,0c0.1,0,0.2-0.1,0.3-0.1c0.1,0,0.2,0,0.2,0c0.2,0,0.3,0,0.5,0c0.1,0,0.1,0,0.2,0c0,0,0,0,0.1,0c0.1,0,0.3,0.1,0.3,0.1c0,0,0.1,0,0.1,0c0,0,0,0,0,0c0,0,0,0,0.1,0c0,0,0,0,0,0c0.1,0,0.1,0,0,0c0.1,0.1,0.4,0.2,0.4,0.2c0,0,0.1,0,0.1,0.1c0,0,0.1,0.1,0.1,0.1c0.1,0.1,0.2,0.2,0.4,0.3c0.1,0.1,0.2,0.2,0.3,0.4c0.1,0.1,0.1,0.2,0.2,0.3c0.2,0.3,0.3,0.6,0.5,0.8c0,0.1,0.1,0.2,0.1,0.3c0,0,0,0.1,0.1,0.1c0.1,0.1,0.1,0.3,0.2,0.4c0.2,0.7,0.4,1.4,0.5,2c0,0.1,0,0.2,0,0.3c0,0,0,0,0,0c0,0.2,0,0.3,0.1,0.5c0,0.4,0,0.7,0.1,1.1C97.9,96.5,97.9,96.8,97.9,97.2z"
              }
              fill={"#ff5100"}
            />
            <Path
              data={
                "M104.5,96.8c-0.2-1.5-0.4-3-0.6-4.4c-0.1-1.5-0.2-3-0.3-4.6c0-0.8-0.1-1.6-0.1-2.4c0-0.4,0-0.8-0.1-1.2c0-0.4,0-0.7-0.2-1c-0.1-0.2-0.4-0.2-0.5,0c-0.2,0.3-0.2,0.7-0.3,1.1c-0.1,0.4-0.1,0.8-0.1,1.2c-0.1,0.8-0.1,1.6-0.1,2.4c0,1.6,0,3.1,0.1,4.7c0.1,1.6,0.2,3.1,0.4,4.7c0.2,1.6,0.3,3.2,0.6,4.8c0.2,1,1.6,1.1,2.1,0.3c0.3-0.6,0.4-1.2-0.1-1.7C105,99.3,104.7,98.1,104.5,96.8z"
              }
              fill={"#ff5100"}
            />
            <Path
              data={
                "M106.7,96.9c-0.2,0.5-0.4,1.1-0.3,1.6c0.3,1,1.7,1,1.9,0c0.1-0.5,0-1.2-0.3-1.6C107.9,96.4,107,96.4,106.7,96.9z"
              }
              fill={"#ff5100"}
            />
            <Path
              data={
                "M120.9,87.9c-0.9,0.2-1.7,0.9-2.5,1.4c-0.8,0.5-1.5,1-2.2,1.5c-0.7,0.5-1.4,1-2.1,1.6c-0.1,0.1-0.2,0.1-0.3,0.2c0.1-0.2,0.1-0.4,0.2-0.6c0,0,0-0.1,0-0.1c0,0,0-0.1,0-0.1c0.1-0.1,0.1-0.2,0.2-0.3c0.1-0.2,0.2-0.5,0.4-0.7c0.3-0.5,0.5-1,0.8-1.4c1.1-1.9,2.4-3.7,3-5.8c0.6-2.1,0.6-4.6-0.8-6.4c-0.6-0.8-1.6-1.4-2.6-1.5c-1.1-0.1-2.1,0.4-2.8,1.1c-0.9,0.8-1.5,2-2,3.1c-0.5,1.1-0.8,2.4-0.6,3.6c0.1,0.5,0.8,0.4,0.9,0c0.3-0.9,0.5-1.9,0.9-2.8c0.4-0.8,0.8-1.7,1.5-2.3c0.5-0.5,1.2-1.1,1.9-1c0.7,0.1,1.2,0.7,1.6,1.3c0.8,1.6,0.4,3.3-0.3,5c-0.1,0.3-0.3,0.8-0.5,1.1c-0.2,0.4-0.5,0.9-0.8,1.3c-0.5,0.8-1.1,1.6-1.6,2.4c-1.2,1.9-2.2,4.1-2.2,6.4c0,0.6,0.5,1.2,1.2,1.2c1.1-0.1,1.9-0.7,2.7-1.4c0.6-0.5,1.4-1.1,2.2-1.6c0.8-0.5,1.5-1.1,2.3-1.6c0.8-0.5,1.8-1,2.5-1.7C122.7,88.9,122,87.6,120.9,87.9z"
              }
              fill={"#ff5100"}
            />
            <Path
              data={
                "M142,74.9c-0.9,0.2-1.7,0.9-2.5,1.4c-0.8,0.5-1.5,1-2.2,1.5c-0.7,0.5-1.4,1-2.1,1.6c-0.1,0.1-0.2,0.1-0.3,0.2c0.1-0.2,0.1-0.4,0.2-0.6c0,0,0-0.1,0-0.1c0,0,0-0.1,0-0.1c0.1-0.1,0.1-0.2,0.2-0.3c0.1-0.2,0.2-0.5,0.4-0.7c0.3-0.5,0.5-1,0.8-1.4c1.1-1.9,2.4-3.7,3-5.8c0.6-2.1,0.6-4.6-0.8-6.4c-0.6-0.8-1.6-1.4-2.6-1.5c-1.1-0.1-2.1,0.4-2.8,1.1c-0.9,0.8-1.5,2-2,3.1c-0.5,1.1-0.8,2.4-0.6,3.6c0.1,0.5,0.8,0.4,0.9,0c0.3-0.9,0.5-1.9,0.9-2.8c0.4-0.8,0.8-1.7,1.5-2.3c0.5-0.5,1.2-1.1,1.9-1c0.7,0.1,1.2,0.7,1.6,1.3c0.8,1.6,0.4,3.3-0.3,5c-0.1,0.3-0.3,0.8-0.5,1.1c-0.2,0.4-0.5,0.9-0.8,1.3c-0.5,0.8-1.1,1.6-1.6,2.4c-1.2,1.9-2.2,4.1-2.2,6.4c0,0.6,0.5,1.2,1.2,1.2c1.1-0.1,1.9-0.7,2.7-1.4c0.6-0.5,1.4-1.1,2.2-1.6c0.8-0.5,1.5-1.1,2.3-1.6c0.8-0.5,1.8-1,2.5-1.7C143.8,75.9,143.1,74.6,142,74.9z"
              }
              fill={"#ff5100"}
            />
            <Path
              data={"M126.9,71.2C127,71.2,126.9,71.2,126.9,71.2L126.9,71.2z"}
              fill={"#ff5100"}
            />
            <Path
              data={
                "M128.5,69.2c-1.5-1.1-3.6-0.8-5,0.3c-0.7,0.6-1.3,1.3-1.8,2.1c-0.5,0.8-0.7,1.6-0.9,2.6c-0.1,0.5,0.1,1.1,0.6,1.3c0,0,0,0,0,0c-0.1,0.8-0.1,1.6-0.1,2.3c0,1.7,0.3,3.3,0.7,4.9c0.4,1.5,1.1,3.2,2.5,4c1.5,0.9,3.2,0.5,4.3-0.8c1-1.2,1.7-2.7,2.1-4.2c0.5-1.5,0.7-3.1,0.7-4.6C131.6,74.3,131,70.9,128.5,69.2z M125.1,71.5C125.1,71.5,125.1,71.5,125.1,71.5L125.1,71.5z M129.1,78.3c0,0.2,0,0.3,0,0.5c0,0.1,0,0.2,0,0.3c0,0,0,0.1,0,0.1c0,0.3-0.1,0.6-0.2,0.9c-0.3,1.3-0.7,2.4-1.2,3.5c-0.1,0.2-0.3,0.5-0.4,0.7c0,0.1-0.1,0.1-0.1,0.2c0,0,0,0.1-0.1,0.1c-0.1,0.1-0.2,0.2-0.3,0.3c0,0,0,0-0.1,0.1c0,0-0.1,0.1-0.2,0.1c0,0-0.1,0.1-0.1,0.1c0,0,0,0,0,0c0,0,0,0,0,0c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0c-0.1,0-0.1,0-0.2,0c0,0-0.1,0-0.1,0c-0.4-0.1-0.8-0.4-1.1-0.9c-0.3-0.5-0.6-1.1-0.8-1.6c-0.5-1.5-0.8-3-1-4.5c-0.1-1.1-0.1-2.2,0-3.3c0.3-0.5,0.5-1,0.8-1.4c0.2-0.3,0.3-0.6,0.5-0.8c0.1-0.1,0.1-0.2,0.2-0.3c0,0,0.1-0.1,0.1-0.1c0.1-0.1,0.1-0.1,0.2-0.2c0.1-0.1,0.2-0.2,0.3-0.3c0,0,0,0,0.1,0c0,0,0.1-0.1,0.1-0.1c0.1-0.1,0.3-0.2,0.4-0.2c0,0,0,0,0,0c0.1,0,0.1-0.1,0.2-0.1c0.1,0,0.3-0.1,0.3-0.1c0.1,0,0.3,0,0.4,0c0,0,0,0,0,0c0,0,0.1,0,0.1,0c0.1,0,0.1,0,0.2,0.1c0,0,0.1,0,0.1,0c0,0,0,0-0.1,0c0.1,0.1,0.2,0.1,0.3,0.2c0.1,0,0.2,0.1,0.2,0.1c0.2,0.1,0.3,0.3,0.4,0.4c0,0,0.1,0.1,0.1,0.2c0.1,0.1,0.1,0.2,0.2,0.3c0.1,0.1,0.1,0.3,0.2,0.4c0,0.1,0.1,0.3,0.1,0.3c0.2,0.5,0.3,1,0.5,1.5c0,0.2,0.1,0.3,0.1,0.5c0,0.1,0,0.1,0,0.2c0,0,0,0.1,0,0.2c0,0,0,0.1,0,0.1c0,0.1,0,0.2,0,0.3c0,0.2,0,0.4,0,0.6C129.1,77,129.1,77.6,129.1,78.3z"
              }
              fill={"#ff5100"}
            />
            <Path
              data={
                "M150.9,64.9c-0.7-0.5-1.6-0.7-2.4-0.7c0.7-1.2,1.1-2.6,0.9-4.1c-0.2-1.1-1-2.7-2.2-2.9c-0.7-0.1-1.3,0.3-1.9,0.7c-0.5,0.4-1,0.8-1.4,1.2c-1,1-1.6,2.2-1.9,3.6c-0.1,0.4,0.5,0.6,0.7,0.2c0.3-0.9,0.9-1.7,1.5-2.4c0.6-0.7,1.5-1.5,2.4-1.8c0.4-0.1,0.6,0.3,0.7,0.6c0.2,0.4,0.3,0.8,0.4,1.2c0.1,1-0.2,1.8-0.7,2.6c-0.6,1-1.5,1.9-2.5,2.6c-0.4,0.3-0.4,1-0.1,1.4c0.3,0.4,0.9,0.5,1.3,0.3c0.6-0.3,1.2-0.6,1.9-0.8c0.6-0.2,1.1-0.2,1.7,0c-0.1,0,0.2,0.1,0.3,0.1c0.1,0,0.1,0.1,0.2,0.1c0,0,0,0,0,0c0.1,0.1,0.2,0.2,0.3,0.3c0,0,0,0,0,0c0,0,0,0,0,0c0,0.1,0.1,0.1,0.1,0.2c0.1,0.1,0.1,0.2,0.2,0.3c0,0,0.1,0.2,0.1,0.2c0,0.1,0.1,0.3,0.1,0.4c0,0.1,0,0.1,0,0.2c0,0,0,0,0,0c0,0,0,0,0,0.1c0,0.3,0,0.5,0,0.8c0,0,0,0.1,0,0.1c0,0,0,0.1,0,0.1c0,0.2-0.1,0.3-0.1,0.5c0,0.1-0.1,0.2-0.1,0.3c0,0-0.1,0.2-0.1,0.2c-0.1,0.1-0.1,0.3-0.2,0.4c0,0-0.1,0.1-0.1,0.1c0,0-0.1,0.2-0.1,0.2c-0.2,0.2-0.3,0.4-0.5,0.6c-0.1,0.1-0.1,0.1-0.2,0.1c0,0,0,0,0,0c0,0,0,0,0,0c-0.1,0.1-0.3,0.2-0.4,0.3c-0.1,0.1-0.2,0.1-0.3,0.2c0,0,0,0,0,0c0,0,0,0,0,0c-0.1,0-0.1,0.1-0.2,0.1c-0.3,0.1-0.6,0.2-0.9,0.2c0,0,0,0-0.1,0c-0.1,0-0.2,0-0.2,0c-0.2,0-0.4,0-0.6,0c-0.2,0-0.3,0-0.5,0c0,0,0,0-0.1,0c-0.1,0-0.1,0-0.2,0c-0.3-0.1-0.6-0.2-1-0.3c0,0,0,0,0,0c-0.1,0-0.2-0.1-0.2-0.1c0,0,0,0-0.1,0c-0.1-0.3-0.4-0.5-0.7-0.7c-0.4-0.2-0.8-0.2-1.1,0.1c-0.5,0.5-0.7,1.3-0.3,2c0.3,0.5,0.9,0.7,1.4,0.9c0.8,0.3,1.7,0.5,2.5,0.5c1.7,0,3.4-0.6,4.7-1.7C153.2,71.4,153.8,66.9,150.9,64.9z M149.7,66.7C149.7,66.7,149.7,66.7,149.7,66.7L149.7,66.7z"
              }
              fill={"#ff5100"}
            />
          </>
        )}
      </Layer>
    </Stage>
  );
};
