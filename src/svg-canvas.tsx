import React, { forwardRef, ForwardedRef } from "react";
import { EditorMouseEvent, SVGObject } from "./base";

interface SVGCanvasProps {
  objects: Map<number, SVGObject>;
  tool: string;
  onMouseDown: (e: EditorMouseEvent) => void;
  onMouseUp: () => void;
  onMouseMove: (e: EditorMouseEvent) => void;
  onMouseDownObj: (obj: SVGObject, e: EditorMouseEvent) => void;
  onMouseUpObj: (obj: SVGObject) => void;
}

const getBound = (obj: SVGObject) => {
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
  return { x, y, w, h };
};

export const SVGCanvas = forwardRef(
  (props: SVGCanvasProps, ref: ForwardedRef<SVGSVGElement>) => {
    const renderCirc = (obj: SVGObject) => {
      const { x, y, w, h } = getBound(obj);

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
      const { x, y, w, h } = getBound(obj);
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
        {Array.from(props.objects.values()).map((o) =>
          o.type === "rect"
            ? renderRect(o)
            : o.type === "circ"
            ? renderCirc(o)
            : null
        )}
      </svg>
    );
  }
);
