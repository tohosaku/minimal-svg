import React, { forwardRef } from "react";

export interface SVGObject {
  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
  locked: boolean;
  id: number;
  bg: string;
  type: string;
}

export interface Coodinate {
  clientX: number;
  clientY: number;
}

interface SVGCanvasProps {
  objects: Array<SVGObject>;
  tool: string;
  onMouseDown: (e: Coodinate & { shiftKey: boolean }) => void;
  onMouseUp: () => void;
  onMouseMove: (e: Coodinate & { shiftKey: boolean }) => void;
  onMouseDownObj: (obj: SVGObject, e: Coodinate) => void;
  onMouseUpObj: (obj: SVGObject) => void;
}

export const SVGCanvas = forwardRef((props: SVGCanvasProps, ref: any) => {
  const renderCirc = (obj: SVGObject) => {
    let x, y, w, h;

    if (obj.xStart < obj.xEnd) {
      x = obj.xStart;
      w = obj.xEnd - obj.xStart;
    } else {
      x = obj.xEnd;
      w = obj.xStart - obj.xEnd;
    }

    if (obj.yStart < obj.yEnd) {
      y = obj.yStart;
      h = obj.yEnd - obj.yStart;
    } else {
      y = obj.yEnd;
      h = obj.yStart - obj.yEnd;
    }

    const r = Math.min(h / 2, w / 2);
    const rx = obj.locked ? r : w / 2;
    const ry = obj.locked ? r : h / 2;

    return (
      <ellipse
        key={obj.id}
        cx={x + rx}
        cy={y + ry}
        rx={rx}
        ry={ry}
        fill={obj.bg}
        onMouseDown={(e) => props.onMouseDownObj(obj, e)}
        onMouseUp={(e) => props.onMouseUpObj(obj)}
      />
    );
  };

  const renderRect = (obj: SVGObject) => {
    let x, y, w, h;

    if (obj.xStart < obj.xEnd) {
      x = obj.xStart;
      w = obj.xEnd - obj.xStart;
    } else {
      x = obj.xEnd;
      w = obj.xStart - obj.xEnd;
    }

    if (obj.yStart < obj.yEnd) {
      y = obj.yStart;
      h = obj.yEnd - obj.yStart;
    } else {
      y = obj.yEnd;
      h = obj.yStart - obj.yEnd;
    }

    const size = Math.min(w, h);

    return (
      <rect
        key={obj.id}
        x={x}
        y={y}
        width={obj.locked ? size : w}
        height={obj.locked ? size : h}
        fill={obj.bg}
        onMouseDown={(e) => props.onMouseDownObj(obj, e)}
        onMouseUp={(e) => props.onMouseUpObj(obj)}
      />
    );
  };

  return (
    <svg
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onMouseMove={props.onMouseMove}
      className={`tool--${props.tool}`}
      ref={ref}
    >
      {props.objects.map((o) => {
        if (o.type === "rect") {
          return renderRect(o);
        }

        if (o.type === "circ") {
          return renderCirc(o);
        }

        return null;
      })}
    </svg>
  );
});
