import React, { forwardRef, ForwardedRef } from "react";
import { Handler, SVGObject } from "./base";
import { SVGCanvas } from "./svg-canvas";
import { ToolBar } from "./toolbar";

interface SVGEditorProps {
  tool: string;
  objects: SVGObject[];
  handler: Handler;
}

export const SVGEditor = forwardRef(
  (
    { tool, objects, handler }: SVGEditorProps,
    ref: ForwardedRef<SVGSVGElement>
  ) => (
    <div className="canvas">
      <ToolBar tool={tool} onToolSelected={handler.selectTool} />
      <SVGCanvas
        objects={objects}
        tool={tool}
        onMouseDown={handler.mouseDown}
        onMouseDownObj={handler.mouseDownObj}
        onMouseMove={handler.mouseMove}
        onMouseUp={handler.mouseUp}
        onMouseUpObj={handler.mouseUpObj}
        ref={ref}
      />
    </div>
  )
);
