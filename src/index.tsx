import React from 'react';
import ReactDOM from 'react-dom'
import classNames from 'classnames'

interface State {
  objects: Array<any>,
  tool?: any
  rectMove?: any
  rectObject?: any
  circObject?: any
  dragStart: any
  id?: any
  bg?: any
}

class Editor extends React.Component<{}, State> {

  svgRef: any = React.createRef();

  state: State = {
    tool: "circ",
    rectMove: null,
    rectObject: null,
    circObject: null,
    dragStart: null,
    objects: []
  };

  componentDidMount() {
    try {
      const json = localStorage.getItem("canvas");
      if (json != null) {
        this.setState(JSON.parse(json));
      }
    } catch (err: any) {
      console.warn("Failed to restore state", err);
    }
  }

  componentDidUpdate() {
    localStorage.setItem("canvas", JSON.stringify(this.state));
  }

  getCoords({ clientX, clientY }: { clientX: number, clientY: number }) {
    const { top, left } = this.svgRef.current.getBoundingClientRect();
    return { x: clientX - left, y: clientY - top };
  }

  handleSelectTool(tool: any) {
    this.setState({ tool });
  }

  handleMouseDownObj(obj: any, e: any) {
    const { tool } = this.state;
    if (tool === "drag") {
      this.setState({
        rectMove: obj.id,
        dragStart: {
          x: e.clientX,
          y: e.clientY
        }
      });
    }
  }

  handleMouseUpObj(obj: any, e: any) {
    this.setState({ rectMove: null });
  }

  handleMouseDown(e: any) {
    const { shiftKey } = e;
    const { x: xStart, y: yStart } = this.getCoords(e);

    if (this.state.tool === "rect") {
      this.setState((s: State) => {
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
          objects: [...s.objects, obj],
          rectObject: obj.id
        };
      });
    }

    if (this.state.tool === "circ") {
      this.setState((s: State) => {
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
          objects: [...s.objects, obj],
          circObject: obj.id
        };
      });
    }
  }

  handleMouseMove(e: any) {
    const { rectObject, circObject, rectMove, dragStart } = this.state;
    if (rectObject) {
      const index = this.state.objects.findIndex(o => o.id === rectObject);
      const { x: xEnd, y: yEnd } = this.getCoords(e);
      const obj = {
        ...this.state.objects[index],
        xEnd,
        yEnd,
        locked: e.shiftKey
      };

      this.setState({
        objects: [
          ...this.state.objects.slice(0, index),
          obj,
          ...this.state.objects.slice(index + 1)
        ]
      });
    }

    if (circObject) {
      const index = this.state.objects.findIndex(o => o.id === circObject);
      const { x: xEnd, y: yEnd } = this.getCoords(e);
      const obj = {
        ...this.state.objects[index],
        xEnd,
        yEnd,
        locked: e.shiftKey
      };

      this.setState({
        objects: [
          ...this.state.objects.slice(0, index),
          obj,
          ...this.state.objects.slice(index + 1)
        ]
      });
    }

    if (rectMove && dragStart) {
      const index = this.state.objects.findIndex(o => o.id === rectMove);
      const { x: xDragStart, y: yDragStart }: { x: number, y: number } = dragStart;
      const { clientX: xDragEnd, clientY: yDragEnd } = e;
      const xDelta = xDragEnd - xDragStart;
      const yDelta = yDragEnd - yDragStart;
      const obj = this.state.objects[index];
      this.setState({
        dragStart: {
          x: xDragEnd,
          y: yDragEnd
        },
        objects: [
          ...this.state.objects.slice(0, index),
          {
            ...obj,
            xStart: obj.xStart + xDelta,
            xEnd: obj.xEnd + xDelta,
            yStart: obj.yStart + yDelta,
            yEnd: obj.yEnd + yDelta
          },
          ...this.state.objects.slice(index + 1)
        ]
      });
    }
  }

  handleMouseUp(e: any) {
    this.setState({
      rectMove: null,
      rectObject: null,
      circObject: null
    });
  }

  renderCirc(obj: { xStart: number, xEnd: number, yStart: number, yEnd: number, locked: boolean, id: any, bg: any }) {
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
        onMouseDown={this.handleMouseDownObj.bind(this, obj)}
        onMouseUp={this.handleMouseUpObj.bind(this, obj)}
      />
    );
  }

  renderRect(obj: any) {
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
        onMouseDown={this.handleMouseDownObj.bind(this, obj)}
        onMouseUp={this.handleMouseUpObj.bind(this, obj)}
      />
    );
  }

  render() {
    const { objects, tool } = this.state;
    return (
      <div className="canvas">
        <div className="toolbar">
          {[["rect", "Rectangle"], ["circ", "Circle"], ["drag", "Drag"]].map(t => (
            <button key={t[0]}
              onClick={this.handleSelectTool.bind(this, t[0])}
              className={classNames({ active: tool === t[0] })}>
              {t[1]}
            </button>
          ))}
        </div>
        <svg onMouseDown={this.handleMouseDown.bind(this)}
          onMouseUp={this.handleMouseUp.bind(this)}
          onMouseMove={this.handleMouseMove.bind(this)}
          className={`tool--${tool}`}
          ref={this.svgRef}>
          {objects.map(o => {
            if (o.type === "rect") {
              return this.renderRect(o);
            }

            if (o.type === "circ") {
              return this.renderCirc(o);
            }

            return null;
          })}
        </svg>
      </div>
    );
  }
}

ReactDOM.render(<Editor />, document.getElementById('root'));