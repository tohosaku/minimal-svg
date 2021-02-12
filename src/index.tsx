import React from "react";
import ReactDOM from "react-dom";
import { useEditor } from "./useEditor";
import { SVGEditor } from "./svg-editor";

const SVGEditorContainer = () => {
  const initialState = {
    tool: "circ",
    objects: []
  };

  const [tool, objects, handler, svgRef] = useEditor(initialState);

  return <SVGEditor tool={tool} objects={objects} handler={handler} ref={svgRef}/>;
};

ReactDOM.render(<SVGEditorContainer />, document.getElementById("app"));
