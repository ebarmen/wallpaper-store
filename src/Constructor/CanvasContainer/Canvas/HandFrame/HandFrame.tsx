import React, { useState, useEffect } from "react";
import { Group, Rect, Transformer } from "react-konva";
import { ModeNames } from "../../../../types/namesList";

interface IRectProps {
  mode: string;
  shapeProps: any;
  onChangeSize: (newAttrs: any) => void;
  onMoveBackground: any;
  gridWidth: number;
  maxWidth: number;
  maxHeight: number;
  gridCount: number;
  realWidth: number;
  realHeight: number;
  dragX: number;
  scale: number;
  commonScaleX: number;
  commonScaleY: number;
  indentX: number;
  indentY: number;
}

export const HandFrame = ({
  mode,
  shapeProps,
  onChangeSize,
  onMoveBackground,
  gridWidth,
  maxWidth,
  maxHeight,
  dragX,
  commonScaleX,
  commonScaleY,
  indentX,
  indentY,
}: IRectProps) => {
  const shapeRef = React.useRef<any>();
  const trRef = React.useRef<any>();
  const [prevX, setPrevX] = useState<number>(dragX);
  const [startX, setStartX] = useState<number>(0);
  const [isMove, setIsMove] = useState<boolean>(false);

  const handleResize = (
    x: number,
    y: number,
    width: number,
    height: number,
  ) => {
    if (x + width > Math.ceil(maxWidth) && y + height > Math.ceil(maxHeight)) {
      onChangeSize({
        ...shapeProps,
        x: x,
        y: y,
        width: maxWidth - x,
        height: maxHeight - y,
      });
    } else if (x + width > Math.ceil(maxWidth)) {
      onChangeSize({
        ...shapeProps,
        x: x,
        y: y,
        width: maxWidth - x,
        height: height,
      });
    } else if (y + height > Math.ceil(maxHeight)) {
      onChangeSize({
        ...shapeProps,
        x: x,
        y: y,
        width: width,
        height: maxHeight - y,
      });
    }
  };

  useEffect(() => {
    trRef.current.nodes([shapeRef.current]);
    trRef.current?.getLayer().batchDraw();
  }, []);

  useEffect(() => {
    const x = Math.round(shapeProps.x);
    const y = Math.round(shapeProps.y);
    const width = Math.round(shapeProps.width);
    const height = Math.round(shapeProps.height);

    if (mode === ModeNames.Panels) {
      onChangeSize({
        ...shapeProps,
        x: Math.round(x / gridWidth) * gridWidth,
        y: 0,
        width: Math.round(width / gridWidth) * gridWidth,
        height: maxHeight,
      });

      setPrevX(Math.round(dragX));
    } else if (mode === ModeNames.Handmode) {
      onChangeSize({
        ...shapeProps,
        x: x,
        y: y,
        width: width,
        height: height,
      });

      setPrevX(Math.round(dragX));
    }

    handleResize(x, y, width, height);
  }, [mode, gridWidth]);

  const handleDrag = (e: any) => {
    if (!maxWidth) return;
    if (e.target.attrs.x < 0) {
      e.target.setAttrs({ x: 0 });
    } else if (e.target.attrs.x > maxWidth - e.target.attrs.width) {
      e.target.setAttrs({ x: maxWidth - e.target.attrs.width });
    }

    if (e.target.attrs.y < 0) {
      e.target.setAttrs({ y: 0 });
    } else if (e.target.attrs.y > maxHeight - e.target.attrs.height) {
      e.target.setAttrs({ y: maxHeight - e.target.attrs.height });
    }
  };

  const handleMoveBackgroundStart = (e: any) => {
    const stage = e.target.getStage();
    setStartX(stage.getPointerPosition().x);
    setIsMove(true);
  };

  const handleMoveBackground = (e: any) => {
    const stage = e.target.getStage();
    const newPrevX =
      mode === ModeNames.Handmode
        ? prevX + (stage.getPointerPosition().x - startX)
        : Math.round(
            (prevX + (stage.getPointerPosition().x - startX)) /
              (gridWidth * commonScaleX),
          ) *
          (gridWidth * commonScaleX);
    if (!isMove) return;

    if (newPrevX > maxWidth * commonScaleX) {
      setPrevX(maxWidth * commonScaleX);
      return onMoveBackground(maxWidth * commonScaleX);
    }

    if (newPrevX < -maxWidth * commonScaleX) {
      setPrevX(-maxWidth * commonScaleX);
      return onMoveBackground(-maxWidth * commonScaleX);
    }

    onMoveBackground(newPrevX);
  };

  const handleMoveBackgroundEnd = (e: any) => {
    const stage = e.target.getStage();

    const newPrevX =
      prevX + (stage.getPointerPosition().x - startX) < maxWidth * commonScaleX
        ? prevX + (stage.getPointerPosition().x - startX) >
          -maxWidth * commonScaleX
          ? prevX + (stage.getPointerPosition().x - startX)
          : -maxWidth * commonScaleX
        : maxWidth * commonScaleX;

    setPrevX(newPrevX);
    setIsMove(false);
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);
    onChangeSize({
      ...shapeProps,
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(node.height() * scaleY),
    });
  };

  return (
    <React.Fragment>
      <Group>
        <Rect
          fill={"rgba(247, 247, 247, .9)"}
          width={maxWidth}
          height={maxHeight}
          opacity={0.9}
          globalCompositeOperation={"xor"}
          onMouseDown={handleMoveBackgroundStart}
          onTouchStart={handleMoveBackgroundStart}
          onTouchMove={handleMoveBackground}
          onMouseMove={handleMoveBackground}
          onMouseUp={handleMoveBackgroundEnd}
          onTouchEnd={handleMoveBackgroundEnd}
          onMouseOut={handleMoveBackgroundEnd}
        />

        <Rect
          fill={"red"}
          ref={shapeRef}
          {...shapeProps}
          draggable={mode !== ModeNames.Panels}
          globalCompositeOperation={"destination-out"}
          onDragMove={handleDrag}
          onDragEnd={handleTransformEnd}
          onTransformEnd={handleTransformEnd}
          onMouseDown={
            mode === ModeNames.Panels ? handleMoveBackgroundStart : () => {}
          }
          onTouchStart={
            mode === ModeNames.Panels ? handleMoveBackgroundStart : () => {}
          }
          onTouchMove={handleMoveBackground}
          onMouseMove={handleMoveBackground}
          onMouseUp={handleMoveBackgroundEnd}
          onTouchEnd={handleMoveBackgroundEnd}
          onMouseOut={handleMoveBackgroundEnd}
        />
      </Group>

      <Transformer
        style={{
          transition: 0.5,
        }}
        enabledAnchors={
          mode === ModeNames.Panels
            ? ["middle-right", "middle-left"]
            : [
                "top-left",
                "top-center",
                "top-right",
                "middle-right",
                "middle-left",
                "bottom-left",
                "bottom-center",
                "bottom-right",
              ]
        }
        borderStroke={mode === ModeNames.Panels ? "#FF5100" : "#0000F7"}
        borderStrokeWidth={2}
        anchorFill={mode === ModeNames.Panels ? "#FF5100" : "#0000F7"}
        anchorStroke={mode === ModeNames.Panels ? "#FF5100" : "#0000F7"}
        anchorSize={12}
        keepRatio={false}
        ref={trRef}
        rotateEnabled={false}
        boundBoxFunc={(oldBox, newBox) => {
          if (
            Math.ceil(newBox.width) < Math.floor(gridWidth * commonScaleX) ||
            newBox.height < 100
          )
            return oldBox;

          if (mode === ModeNames.Panels) {
            newBox.y = indentY;
            newBox.height = maxHeight * commonScaleY;

            // дикий костыль чтобы рамка трансформера была видна по краям
            if (
              (
                Math.round(newBox.x / (gridWidth * commonScaleX)) *
                  (gridWidth * commonScaleX) +
                indentX
              ).toFixed(2) === oldBox.x.toFixed(2) &&
              newBox.x < oldBox.x
            )
              newBox.width = oldBox.width;
            else if (
              (
                Math.round(newBox.x / (gridWidth * commonScaleX)) *
                  (gridWidth * commonScaleX) +
                indentX
              ).toFixed(2) > oldBox.x.toFixed(2)
            )
              newBox.width =
                Math.round(
                  (newBox.width - indentX) / (gridWidth * commonScaleX),
                ) *
                (gridWidth * commonScaleX);
            else
              newBox.width =
                Math.round(
                  (newBox.width - indentX) / (gridWidth * commonScaleX),
                ) *
                (gridWidth * commonScaleX);

            newBox.x =
              Math.round(newBox.x / (gridWidth * commonScaleX)) *
                (gridWidth * commonScaleX) +
              indentX;
          }

          if (Math.round(newBox.x) < Math.round(indentX)) {
            newBox.width = oldBox.width + oldBox.x - indentX;
            newBox.x = indentX;
          }
          if (Math.round(newBox.y) < Math.round(indentY)) {
            newBox.height = oldBox.height + oldBox.y - indentY;
            newBox.y = indentY;
          }
          if (newBox.width + newBox.x >= maxWidth * commonScaleX + indentX) {
            newBox.width = maxWidth * commonScaleX + indentX - newBox.x;
          }
          if (newBox.height + newBox.y >= maxHeight * commonScaleY + indentY) {
            newBox.height = maxHeight * commonScaleY + indentY - newBox.y;
          }

          return newBox;
        }}
      />
    </React.Fragment>
  );
};
