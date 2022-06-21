import {PointState} from "./PointState";
import React from "react";
import {intersect} from "../utils/intersect";

export class Solver {
   constructor(start_x: number, start_y: number, speed_x: number, speed_y: number, finish: any[], size_map: any, walls: any[],
               goal_x?: number, goal_y?: number) {
      this.start_node = new PointState(start_x, start_y, speed_x, speed_y);
      this.goal_node = new PointState(goal_x || 0, goal_y || 0, 0, 0);

      this.finish = finish;
      this.size_map = size_map;
      this.walls = walls;

      this.bfs = this.bfs.bind(this);
      this.solveDFS = this.solveDFS.bind(this);
   }

   protected start_node: PointState;
   protected goal_node: PointState;

   protected finish: any[];
   protected size_map: any;
   protected walls: any[];

   protected queue: any = [];
   protected visited: any = [];

   protected stateGraph: Array<PointState> = [];


   public isEndGame(currentNode: PointState, goalNode: PointState): boolean {
      return currentNode.x === goalNode.x && currentNode.y === goalNode.y;
   }

   // получаем возможные позиции
   private getNeighbours(currentNode: PointState): Array<PointState> {
      const neighbours = [];
      neighbours.push(new PointState(currentNode.x + currentNode.delta_x + 1, currentNode.y + currentNode.delta_y + 1, currentNode.delta_x + 1, currentNode.delta_y + 1));
      neighbours.push(new PointState(currentNode.x + currentNode.delta_x + 0, currentNode.y + currentNode.delta_y + 1, currentNode.delta_x + 0, currentNode.delta_y + 1));
      neighbours.push(new PointState(currentNode.x + currentNode.delta_x - 1, currentNode.y + currentNode.delta_y + 1, currentNode.delta_x - 1, currentNode.delta_y + 1));
      neighbours.push(new PointState(currentNode.x + currentNode.delta_x + 1, currentNode.y + currentNode.delta_y + 0, currentNode.delta_x + 1, currentNode.delta_y + 0));
      neighbours.push(new PointState(currentNode.x + currentNode.delta_x + 0, currentNode.y + currentNode.delta_y + 0, currentNode.delta_x + 0, currentNode.delta_y + 0));
      neighbours.push(new PointState(currentNode.x + currentNode.delta_x - 1, currentNode.y + currentNode.delta_y + 0, currentNode.delta_x - 1, currentNode.delta_y + 0));
      neighbours.push(new PointState(currentNode.x + currentNode.delta_x + 1, currentNode.y + currentNode.delta_y - 1, currentNode.delta_x + 1, currentNode.delta_y - 1));
      neighbours.push(new PointState(currentNode.x + currentNode.delta_x + 0, currentNode.y + currentNode.delta_y - 1, currentNode.delta_x + 0, currentNode.delta_y - 1));
      neighbours.push(new PointState(currentNode.x + currentNode.delta_x - 1, currentNode.y + currentNode.delta_y - 1, currentNode.delta_x - 1, currentNode.delta_y - 1));

      neighbours.forEach((item: PointState) => {
         item.visited = this.isVisited(item);
      })
      return neighbours;
   }

   private isEqualNode(firstNode: PointState, secondNode: PointState): boolean {
      return firstNode.x === secondNode.x && firstNode.y === secondNode.y;
   }

   private isEqualGraphPoint(firstNode: PointState, secondNode: PointState): boolean {
      return firstNode.x === secondNode.x && firstNode.y === secondNode.y &&
         firstNode.delta_x === secondNode.delta_x && firstNode.delta_y === secondNode.delta_y;
   }

   private arrayHasPoint(array: any, node: PointState): boolean {
      return array.find((item: PointState) => this.isEqualGraphPoint(item, node));
   }

   // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
   private intersectsWall(a: number, b: number, c: number, d: number, p: number, q: number, r: number, s: number) {
      let det, gamma, lambda;
      det = (c - a) * (s - q) - (r - p) * (d - b);
      if (det === 0) {
         return false;
      } else {
         lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
         gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
         return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
      }
   };

   intersectWall(x: number, y: number, nextX: number, nextY: number) {
      let flag = false;
      this.walls.forEach((wall: any) => {
         if (x >= wall.x && x <= wall.x + wall.width && y >= wall.y && y <= wall.y + wall.height) {
            flag = true;
         }
      });
      if (!flag) {
         this.walls.forEach((wall: any) => {
            const intersect1 = this.intersectsWall(x, y, nextX, nextY, wall.x, wall.y, wall.x, wall.y + wall.height);
            const intersect2 = this.intersectsWall(x, y, nextX, nextY, wall.x, wall.y, wall.x + wall.width, wall.y);
            const intersect3 = this.intersectsWall(x, y, nextX, nextY, wall.x + wall.width, wall.y,
               wall.x + wall.width, wall.y + wall.height);
            const intersect4 = this.intersectsWall(x, y, nextX, nextY, wall.x, wall.y + wall.height, wall.x + wall.width, wall.y + wall.height);
            if (intersect1 || intersect2 || intersect3 || intersect4) {
               flag = true;
            }
         });
      }
      return flag;
   }

   private isVisited(node: PointState): boolean {
      return this.visited.find((item: PointState) => this.isEqualNode(item, node));
   }

   private isFinishPoint(x: number, y: number): boolean {
      let flag = false;
      const widthFinish = this.finish[0].width;
      for(let i = 0; i < widthFinish; i++) {
         if (x === this.finish[0].x + i && y === this.finish[0].y + 1) {
            flag = true;
         }
      }
      return flag;
   }

   private isValidMove(currentNode: PointState, nexNode: PointState): boolean {
      const isFinish = this.finish.some(finishPoint => intersect(finishPoint, [[currentNode.x, currentNode.y], [nexNode.x, nexNode.y]]));
      const isWall = this.intersectWall(currentNode.x, currentNode.y, nexNode.x, nexNode.y);
      const isExternal = nexNode.x <= 0 || nexNode.y <= 0
         || nexNode.x >= this.size_map.size_x || nexNode.y >= this.size_map.size_y;
      const isUnderFinish = this.isFinishPoint(nexNode.x, nexNode.y) && (currentNode.y <= this.finish[0].y + 1);
      if (nexNode.x === currentNode.x && nexNode.y === currentNode.y) return false;
      if (nexNode.x > currentNode.x + currentNode.delta_x + 1 || nexNode.x < currentNode.x + currentNode.delta_x - 1) return false;
      if (nexNode.y > currentNode.y + currentNode.delta_y + 1 || nexNode.y < currentNode.y + currentNode.delta_y - 1) return false;

      return !(isWall || isFinish || isExternal || isUnderFinish);
   }

   public solveDFS(): void {
      this.visited = [];
      let result = this.dfs(this.start_node);
   }

   private dfs(node: PointState): any {
      if (node.visited) {
         return;
      }
      this.visited.push(node);
      if (this.isEndGame(node, this.goal_node)) {
         alert('Found');
         return true;
      }
      const neighbours: PointState[] = this.getNeighbours(node);
      for (let i = 0; i < neighbours.length; i++) {
         neighbours[i].visited = true;
         const isValid = this.isValidMove(node, neighbours[i]);
         if (!isValid) {
            this.visited.push(neighbours[i]);
         } else {
            neighbours[i].parent = node;
            if (this.isEndGame(neighbours[i], this.goal_node)) {
               alert('Found');
               return neighbours[i];
            }
            this.dfs(neighbours[i]);
         }
      }

      return null;
   }

   public A_star(): any {
      const start_node = this.start_node;
      const goal_node = this.goal_node;
      this.queue = [];
      this.visited = [];
      const start = new Date().getTime();
      let end = new Date().getTime();
      start_node.g = 0;
      start_node.h = this._getH(start_node);

      this.queue.push(start_node);
      while(this.queue.length) {
         let lowInd = 0;
         for(let i = 0; i < this.queue.length; i++) {
            if(this.queue[i].g < this.queue[lowInd].g) { lowInd = i; }
         }
         let currentNode = this.queue[lowInd];
         end = new Date().getTime();
         if (this.isEndGame(currentNode, goal_node)
            || this.isEndGame(currentNode, new PointState(1, goal_node.y, 0, 0))) {
            alert(`Time: ${end - start}`);
            return currentNode;
         }

         this.queue.splice(lowInd, 1);
         this.visited.push(currentNode);

         const neighbours: PointState[] = this.getNeighbours(currentNode);
         for (let i = 0; i < neighbours.length; i++) {
            const neighbour = neighbours[i];
            const isValid = this.isValidMove(currentNode, neighbour);
            if (this.isVisited(neighbour) || !isValid) {
               continue;
            }
            neighbour.h = this._getH(neighbour);
            neighbour.parent = currentNode;
            let sameInClose = this.visited.find((item: PointState) => {
               if (this.isEqualNode(item, neighbour)) {
                  return item;
               }
            });

            let sameInOpen = this.queue.find((item: PointState) => {
               if (this.isEqualNode(item, neighbour)) {
                  return item;
               }
            });

            if (this.isEndGame(neighbour, goal_node)
               || this.isEndGame(neighbour, new PointState(1, goal_node.y, 0, 0))) {
               neighbour.parent = currentNode;
               alert(`Time: ${end - start}`);
               return neighbour;
            }

            let distance = currentNode.g + 1;
            if (sameInOpen && distance > sameInOpen.g) {
               continue;
            }
            if (!(sameInClose && distance > sameInClose.g)) {
               neighbour.g = distance;
               neighbour.parent = currentNode;
               this.queue.push(neighbour);
            }
         }
      }

      return null;
   }

   private _getH(s: PointState): any {
      return Math.abs(s.x - this.goal_node.x) + Math.abs(s.y - this.goal_node.y);
   }



   public graphState(): any {
      this.queue = [];
      this.visited = [];
      const start_node = this.start_node;
      const goal_node = this.goal_node;

      const start = new Date().getTime();
      let end = new Date().getTime();

      this.queue.push(start_node);
      const graph: PointState[] = [];

      while (this.queue.length !== 0) {
         end = new Date().getTime();
         let currentState: PointState = this.queue.shift() as PointState;
         this.visited.push(currentState);
         if (end - start > 150000) {
            alert(`Time: ${end - start}`);
            this.stateGraph = graph;
            return graph;
         }
         if (this.isEndGame(currentState, goal_node)
            || this.isEndGame(currentState, new PointState(1, goal_node.y, 0, 0))) {
            graph.push(currentState);
         }

         const neighbours: PointState[] = this.getNeighbours(currentState);
         for (let i = 0; i < neighbours.length; i++) {
            const isUnderFinish = this.isEndGame(neighbours[i], goal_node)
               && (currentState.y <= this.finish[0].y + 1);
            if (this.isValidMove(currentState, neighbours[i]) && !this.arrayHasPoint(this.queue, neighbours[i]) &&
            !this.arrayHasPoint(this.visited, neighbours[i]) && !isUnderFinish) {
               neighbours[i].parent = currentState;
               this.queue.push(neighbours[i]);
            }
         }
      }
      alert(`Time: ${end - start}`);
      return graph;
   }

   public getMinSolutionPath(solution: PointState[]): any {
      if (!solution.length) {
         return null;
      }
      let min = solution[0];
      for (let i = 0; i < solution.length; i++) {
         if (solution[i].deep < min.deep) {
            min = solution[i];
         }
      }
      return min;
   }

   public bfs(): void | any {
      this.visited = [];
      this.queue = [];
      const start_node = this.start_node;
      const goal_node = this.goal_node;
      let count = 0;

      const start = new Date().getTime();
      let end = new Date().getTime();

      this.queue.push(start_node);
      this.visited.push(start_node);

      start_node.visited = true;

      while (this.queue.length !== 0) {
         end = new Date().getTime();
         let currentState: PointState = this.queue.shift() as PointState;
         if (this.isEndGame(currentState, goal_node)
            || this.isEndGame(currentState, new PointState(1, goal_node.y, 0, 0))) {
            console.log("You win!");
            return currentState;
         }

         const neighbours: PointState[] = this.getNeighbours(currentState);
         for (let i = 0; i < neighbours.length; i++) {
            if (!neighbours[i].visited) {
               if (this.isValidMove(currentState, neighbours[i])) {
                  neighbours[i].parent = currentState;
                  this.queue.push(neighbours[i]);
               }
               neighbours[i].visited = true;
               this.visited.push(neighbours[i]);
            }
         }
      }

      return null;
   }
}
