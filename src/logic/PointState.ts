export class PointState{
   private _x: number = 0;
   private _y: number = 0;
   private _delta_x: number = 0;
   private _delta_y: number = 0;
   private _parent: PointState|null = null;
   private _deep: number = 0;
   private _visited: boolean = false;
   private _h?: any = -1;
   private _g?: any = -1;
   private readonly _state: Array<Array<string|number>> = [];

   constructor(x: number, y: number, delta_x?: number, delta_y?: number, visited?: boolean) {
      this._x = x;
      this._y = y;
      if (delta_x) {
         this._delta_x = delta_x;
      }
      if (delta_y) {
         this._delta_y = delta_y;
      }
   }

   get x(): number {
      return this._x;
   }

   set x(value: number) {
      this._x = value;
   }

   get h(): number {
      return this._h;
   }

   set h(value: number) {
      this._h = value;
   }

   get g(): number {
      return this._g;
   }

   set g(value: number) {
      this._g = value;
   }

   get y(): number {
      return this._y;
   }

   set y(value: number) {
      this._y = value;
   }

   get delta_x(): number {
      return this._delta_x;
   }

   set delta_x(value: number) {
      this._delta_x = value;
   }

   get delta_y(): number {
      return this._delta_y;
   }

   set delta_y(value: number) {
      this._delta_y = value;
   }

   get visited(): boolean {
      return this._visited;
   }

   set visited(value: boolean) {
      this._visited = value;
   }

   get parent(): PointState | null {
      return this._parent;
   }

   set parent(value: PointState | null) {
      this._parent = value;
      if (value) {
         this._deep = value.deep + 1;
      }
   }

   get deep(): number {
      return this._deep;
   }

   set deep(value: number) {
      this._deep = value;
   }
}