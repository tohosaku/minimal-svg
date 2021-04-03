import React from "react";
import ReactDOM from "react-dom";
import { useEditor } from "./useEditor";
import { SVGEditor } from "./svg-editor";
import { SVGObject } from "./base";

const SVGEditorContainer = () => {
  const [tool, objects, handler, svgRef] = useEditor({
    tool: "circ",
    objects: new Map<number, SVGObject>(),
  });

  return (
    <SVGEditor tool={tool} objects={objects} handler={handler} ref={svgRef} />
  );
};

ReactDOM.render(<SVGEditorContainer />, document.getElementById("app"));
