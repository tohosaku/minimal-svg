import { useState, useEffect, useRef, MutableRefObject } from "react";
import { SVGObject, EditorMouseEvent, Handler, State, Coodinate } from "./base";

const initialInternalState = {
  rectMove: null,
  rectObject: null,
  circObject: null,
  dragStart: null,
};

export const useEditor = (initialState: {
  tool: string;
  objects: SVGObject[];
}) => {
  const svgRef = useRef() as MutableRefObject<SVGSVGElement>;

  const [state, setState] = useState({
    ...initialInternalState,
    ...initialState,
  } as State);

  useEffect(() => {
    try {
      const json = localStorage.getItem("canvas");
      if (json != null) {
        setState(JSON.parse(json));
      }
    } catch (err: any) {
      console.warn("Failed to restore state", err);
    }
  }, []);

  /*
     componentDidUpdate() {
        localStorage.setItem("canvas", JSON.stringify(this.state));
      }
    */

  const getCoords = ({ clientX, clientY }: EditorMouseEvent): Coodinate => {
    const { top, left } = svgRef.current.getBoundingClientRect();
    return { x: clientX - left, y: clientY - top };
  };

  const selectTool = (tool: string) => setState({ ...state, ...{ tool } });

  const mouseDownObj = (obj: SVGObject, e: EditorMouseEvent) => {
    const { tool } = state;
    if (tool === "drag") {
      setState({
        ...state,
        ...{
          rectMove: obj.id,
          dragStart: {
            x: e.clientX,
            y: e.clientY,
          },
        },
      });
    }
  };

  const mouseUpObj = (obj: SVGObject) =>
    setState({ ...state, ...{ rectMove: null } });

  const mouseDown = (e: EditorMouseEvent) => {
    const { shiftKey } = e;
    const { x: xStart, y: yStart } = getCoords(e);

    if (state.tool === "rect") {
      setState((s) => {
        const obj = {
          id: Date.now(),
          type: "rect",
          bg:
            "rgb(" +
            [
              Math.round(Math.random() * 255),
              Math.round(Math.random() * 255),
              Math.round(Math.random() * 255),
            ] +
            ")",
          xStart,
          yStart,
          xEnd: xStart,
          yEnd: yStart,
          locked: shiftKey,
        };
        return {
          ...state,
          ...{
            objects: [...s.objects, obj],
            rectObject: obj.id,
          },
        };
      });
    }

    if (state.tool === "circ") {
      setState((s) => {
        const obj = {
          id: Date.now(),
          type: "circ",
          bg:
            "rgb(" +
            [
              Math.round(Math.random() * 255),
              Math.round(Math.random() * 255),
              Math.round(Math.random() * 255),
            ] +
            ")",
          xStart,
          yStart,
          xEnd: xStart,
          yEnd: yStart,
          locked: shiftKey,
        };
        return {
          ...state,
          ...{
            objects: [...s.objects, obj],
            circObject: obj.id,
          },
        };
      });
    }
  };

  const mouseMove = (e: EditorMouseEvent & { shiftKey: boolean }) => {
    const { rectObject, circObject, rectMove, dragStart } = state;
    if (rectObject) {
      const index = state.objects.findIndex((o) => o.id === rectObject);
      const { x: xEnd, y: yEnd } = getCoords(e);
      const obj = {
        ...state.objects[index],
        xEnd,
        yEnd,
        locked: e.shiftKey,
      };

      setState({
        ...state,
        ...{
          objects: [
            ...state.objects.slice(0, index),
            obj,
            ...state.objects.slice(index + 1),
          ],
        },
      });
    }

    if (circObject) {
      const index = state.objects.findIndex((o) => o.id === circObject);
      const { x: xEnd, y: yEnd } = getCoords(e);
      const obj = {
        ...state.objects[index],
        xEnd,
        yEnd,
        locked: e.shiftKey,
      };

      setState({
        ...state,
        ...{
          objects: [
            ...state.objects.slice(0, index),
            obj,
            ...state.objects.slice(index + 1),
          ],
        },
      });
    }

    if (rectMove && dragStart) {
      const index = state.objects.findIndex((o) => o.id === rectMove);
      const { x: xDragStart, y: yDragStart } = dragStart;
      const { clientX: xDragEnd, clientY: yDragEnd } = e;
      const xDelta = xDragEnd - xDragStart;
      const yDelta = yDragEnd - yDragStart;
      const obj = state.objects[index];
      const newstate = {
        dragStart: {
          x: xDragEnd,
          y: yDragEnd,
        },
        objects: [
          ...state.objects.slice(0, index),
          {
            ...obj,
            xStart: obj.xStart + xDelta,
            xEnd: obj.xEnd + xDelta,
            yStart: obj.yStart + yDelta,
            yEnd: obj.yEnd + yDelta,
          },
          ...state.objects.slice(index + 1),
        ],
      };
      setState({ ...state, ...newstate });
    }
  };

  const mouseUp = () =>
    setState({
      ...state,
      ...{
        rectMove: null,
        rectObject: null,
        circObject: null,
      },
    });

  return [
    state.tool,
    state.objects,
    {
      selectTool,
      mouseDown,
      mouseDownObj,
      mouseMove,
      mouseUp,
      mouseUpObj,
    } as Handler,
    svgRef,
  ] as const;
};
