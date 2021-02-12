import React from "react";
import ReactDOM from "react-dom";
import { SVGCanvas } from "./svg-canvas";
import { ToolBar } from "./toolbar";
import { useEditor } from "./useEditor";

const SVGEditor = () => {
  const initialState = {
    tool: "circ",
    rectMove: null,
    rectObject: null,
    circObject: null,
    dragStart: null,
    objects: [],
  };

  const [state, svgRef, handler] = useEditor(initialState);

  return (
    <div className="canvas">
      <ToolBar tool={state.tool} onToolSelected={handler.selectTool} />
      <SVGCanvas
        objects={state.objects}
        tool={state.tool}
        onMouseDown={handler.mouseDown}
        onMouseDownObj={handler.mouseDownObj}
        onMouseMove={handler.mouseMove}
        onMouseUp={handler.mouseUp}
        onMouseUpObj={handler.mouseUpObj}
        ref={svgRef}
      />
    </div>
  );
};

ReactDOM.render(<SVGEditor />, document.getElementById("app"));
