export interface Handler {
  selectTool: (tool: string) => void;
  mouseDown: (e: EditorMouseEvent) => void;
  mouseDownObj: (obj: SVGObject, e: EditorMouseEvent) => void;
  mouseMove: (e: EditorMouseEvent) => void;
  mouseUp: () => void;
  mouseUpObj: (obj: SVGObject) => void;
}

export interface EditorMouseEvent {
  clientX: number;
  clientY: number;
  shiftKey?: boolean;
}

export interface SVGObject {
  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
  locked?: boolean;
  id: number;
  bg: string;
  type: string;
}
