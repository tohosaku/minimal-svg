import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'
import classNames from 'classnames'

interface State {
  objects: Array<SVGObject>
  tool: string
  rectMove: number | null
  rectObject: number | null
  circObject: number | null
  dragStart: { x: number, y: number } | null
}

interface SVGObject {
  xStart: number
  xEnd: number
  yStart: number
  yEnd: number
  locked: boolean
  id: number
  bg: string
  type: string
}

interface Coodinate { clientX: number, clientY: number }

const initialState: State = {
  tool: "circ",
  rectMove: null,
  rectObject: null,
  circObject: null,
  dragStart: null,
  objects: []
};

const SVGEditor: React.FC<{}> = () => {

  const [state, setState] = useState(initialState);

  const svgRef: any = useRef();

  useEffect(() => {
    try {
      const json = localStorage.getItem("canvas");
      if (json != null) {
        setState(JSON.parse(json));
      }
    } catch (err: any) {
      console.warn("Failed to restore state", err);
    }
  }, [])

  /*
   componentDidUpdate() {
      localStorage.setItem("canvas", JSON.stringify(this.state));
    }
  */

  const getCoords = ({ clientX, clientY }: Coodinate) => {
    const { top, left } = svgRef.current.getBoundingClientRect();
    return { x: clientX - left, y: clientY - top };
  }

  const handleSelectTool = (tool: string) => {
    setState({ ...state, ...{ tool } });
  }

  const handleMouseDownObj = (obj: SVGObject, e: Coodinate) => {
    const { tool } = state;
    if (tool === "drag") {
      setState({
        ...state, ...{
          rectMove: obj.id,
          dragStart: {
            x: e.clientX,
            y: e.clientY
          }
        }
      });
    }
  }

  const handleMouseUpObj = (obj: SVGObject) => {
    setState({ rectMove: null } as State);
  }

  const handleMouseDown = (e: Coodinate & { shiftKey: boolean }) => {
    const { shiftKey } = e;
    const { x: xStart, y: yStart } = getCoords(e);

    if (state.tool === "rect") {
      setState((s: State) => {
        const obj = {
          id: Date.now(),
          type: "rect",
          bg: "rgb(" + [
            Math.round(Math.random() * 255),
            Math.round(Math.random() * 255),
            Math.round(Math.random() * 255)
          ] + ")",
          xStart,
          yStart,
          xEnd: xStart,
          yEnd: yStart,
          locked: shiftKey
        };
        return {
          ...state, ...{
            objects: [...s.objects, obj],
            rectObject: obj.id
          }
        };
      });
    }

    if (state.tool === "circ") {
      setState((s: State) => {
        const obj = {
          id: Date.now(),
          type: "circ",
          bg: "rgb(" + [
            Math.round(Math.random() * 255),
            Math.round(Math.random() * 255),
            Math.round(Math.random() * 255)
          ] + ")",
          xStart,
          yStart,
          xEnd: xStart,
          yEnd: yStart,
          locked: shiftKey
        };
        return {
          ...state, ...{
            objects: [...s.objects, obj],
            circObject: obj.id
          }
        };
      });
    }
  }

  const handleMouseMove = (e: Coodinate & { shiftKey: boolean }) => {
    const { rectObject, circObject, rectMove, dragStart } = state;
    if (rectObject) {
      const index = state.objects.findIndex(o => o.id === rectObject);
      const { x: xEnd, y: yEnd } = getCoords(e);
      const obj = {
        ...state.objects[index],
        xEnd,
        yEnd,
        locked: e.shiftKey
      };

      setState({
        ...state, ...{
          objects: [
            ...state.objects.slice(0, index),
            obj,
            ...state.objects.slice(index + 1)
          ]
        }
      });
    }

    if (circObject) {
      const index = state.objects.findIndex(o => o.id === circObject);
      const { x: xEnd, y: yEnd } = getCoords(e);
      const obj = {
        ...state.objects[index],
        xEnd,
        yEnd,
        locked: e.shiftKey
      };

      setState({
        ...state, ...{
          objects: [
            ...state.objects.slice(0, index),
            obj,
            ...state.objects.slice(index + 1)
          ]
        }
      });
    }

    if (rectMove && dragStart) {
      const index = state.objects.findIndex(o => o.id === rectMove);
      const { x: xDragStart, y: yDragStart }: { x: number, y: number } = dragStart;
      const { clientX: xDragEnd, clientY: yDragEnd } = e;
      const xDelta = xDragEnd - xDragStart;
      const yDelta = yDragEnd - yDragStart;
      const obj = state.objects[index];
      const newstate = {
        dragStart: {
          x: xDragEnd,
          y: yDragEnd
        },
        objects: [
          ...state.objects.slice(0, index),
          {
            ...obj,
            xStart: obj.xStart + xDelta,
            xEnd: obj.xEnd + xDelta,
            yStart: obj.yStart + yDelta,
            yEnd: obj.yEnd + yDelta
          },
          ...state.objects.slice(index + 1)
        ]
      }
      setState({ ...state, ...newstate });
    }
  }

  const handleMouseUp = () => {
    setState({
      ...state, ...{
        rectMove: null,
        rectObject: null,
        circObject: null
      }
    });
  }

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
        onMouseDown={(e) => handleMouseDownObj(obj, e)}
        onMouseUp={(e) => handleMouseUpObj(obj)}
      />
    );
  }

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
        onMouseDown={(e) => handleMouseDownObj(obj, e)}
        onMouseUp={(e) => handleMouseUpObj(obj)}
      />
    );
  }

  return (
    <div className="canvas">
      <div className="toolbar">
        {[["rect", "Rectangle"], ["circ", "Circle"], ["drag", "Drag"]].map(t => (
          <button key={t[0]}
            onClick={(e) => handleSelectTool(t[0])}
            className={classNames({ active: state.tool === t[0] })}>
            {t[1]}
          </button>
        ))}
      </div>
      <svg onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`tool--${state.tool}`}
        ref={svgRef}>
        {state.objects.map(o => {
          if (o.type === "rect") {
            return renderRect(o);
          }

          if (o.type === "circ") {
            return renderCirc(o);
          }

          return null;
        })}
      </svg>
    </div>
  );
}

ReactDOM.render(<SVGEditor />, document.getElementById('app'));