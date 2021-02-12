import React from "react";
import classNames from "classnames";

const tools = [
  ["rect", "Rectangle"],
  ["circ", "Circle"],
  ["drag", "Drag"],
];

export const ToolBar = (props: {
  tool: string;
  onToolSelected: (tool: string) => void;
}) => (
  <div className="toolbar">
    {tools.map((t) => (
      <button
        key={t[0]}
        onClick={(e) => props.onToolSelected(t[0])}
        className={classNames({ active: props.tool === t[0] })}
      >
        {t[1]}
      </button>
    ))}
  </div>
);
