import React from "react";
import classNames from "classnames";

export const ToolBar = (props:{
    tool: string;
    onToolSelected: (tool: string) => void;
  }) => {
    return (
      <div className="toolbar">
        {[
          ["rect", "Rectangle"],
          ["circ", "Circle"],
          ["drag", "Drag"],
        ].map((t) => (
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
  };
  