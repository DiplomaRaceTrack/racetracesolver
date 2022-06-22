import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Grid from "../Grid/Grid";
import CurrentPos from "../CurrentPos/CurrentPos";
import NextPos from "../NextPos/NextPos";

import "./Game.css";
import Trace from "../Trace/Trace";
import Walls from "../Walls/Walls";
import {intersect} from "../../utils/intersect";
import Finish from "../Finish/Finish";
import Corner from "../Corner/Corner";

import {Solver} from "../../logic/Game";
import {maps} from "../../TrackSource";

class Game extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         x: maps[0].size_map.initial_x,
         y: maps[0].size_map.initial_y,
         W: maps[0].size_map.W,
         delta_x: 0,
         delta_y: 0,
         trace: [[maps[0].size_map.initial_x, maps[0].size_map.initial_y]],
         walls: maps[0].walls,
         finish: maps[0].finish,
         corners: [],
         currentSolution: [],
         currentSolutionIndex: 0,
         size_map: maps[0].size_map,
         id_trace: 0
      };
      this.isFinish = this.isFinish.bind(this);
   }

   isFinish(x, y) {
      const s = this.state;
      if (x === this.state.size_map.initial_x && y === this.state.size_map.initial_y) {
         return false;
      }
      const isFinish = s.finish.some(finishPoint => intersect(finishPoint, [[s.x, s.y], [x, y]]));
      return isFinish;
   }

   // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
   intersectsWall(a, b, c, d, p, q, r, s) {
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

   intersectWall(x, y, nextX, nextY) {
      let flag = false;
      this.state.walls.forEach((wall) => {
         if (x >= wall.x && x <= wall.x + wall.width && y >= wall.y && y <= wall.y + wall.height) {
            flag = true;
         }
      });
      if (!flag) {
         this.state.walls.forEach((wall) => {
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

   isFinishPoint(x, y) {
      let flag = false;
      const widthFinish = this.state.finish[0].width;
      for(let i = 0; i < widthFinish; i++) {
         if (x === this.state.finish[0].x + i && y === this.state.finish[0].y + 1) {
            flag = true;
         }
      }
   }

   isValidNextPos(x, y) {
      const s = this.state;
      const isFinish = s.finish.some(finishPoint => intersect(finishPoint, [[s.x, s.y], [x, y]]));
      const isWall = this.intersectWall(s.x, s.y, x, y);
      const isExternal = x <= 0 || y <= 0 || x >= this.state.size_map.size_x || y >= this.state.size_map.size_y;
      const isUnderFinish = this.isFinishPoint(x, y) && (y <= this.finish[0].y + 1);
      const isWin = s.y > s.finish[0].y + 1 && y <= s.finish[0].y + 1;
      if (x === s.x && y === s.y) return false;
      if (x > s.x + s.delta_x + 1 || x < s.x + s.delta_x - 1) return false;
      if (y > s.y + s.delta_y + 1 || y < s.y + s.delta_y - 1) return false;
      if (isWall || isFinish || isExternal || isUnderFinish) {
         return false;
      }
      return true;
   }

   getRectanglesSize() {
      const rect1A = Math.floor(Math.sqrt(2 * this.state.size_map.W));
      const rect1B = Math.floor(Math.sqrt(2 * this.state.size_map.W)) + 1;
      const rect2A = Math.floor(Math.sqrt(2 * this.state.size_map.W));
      const rect2B = this.state.size_map.W;
      return {A: {width: rect1A, height: rect1B},
         B: {width: rect2A, height: rect2B}};
   }

   getPointsUnionOfRects(A, B, directionHor = 'l', directionVer = 'b') {
      const result = [];
      const direction = directionHor + directionVer;
      let startPoint = {x: 0, y: 0};
      switch (direction) {
         case 'lb':
            startPoint = {x: 0 + this.state.size_map.W, y: 0};
            // левый верхний прямоугольник
            for (let i = startPoint.x - A.width; i < startPoint.x; i++) {
               for (let j = startPoint.y; j < startPoint.y + A.height + B.height; j++) {
                  result.push({x: i, y: j});
               }
            }
            break;
         case 'rt':
            startPoint = {x: this.state.size_map.size_x - this.state.size_map.W, y: this.state.size_map.size_y - 1};
            // правый нижний прямоуольник
            for (let i = startPoint.x; i < startPoint.x + A.width; i++) {
               for (let j = startPoint.y; j > startPoint.y - A.height - B.height; j--) {
                  result.push({x: i, y: j});
               }
            }
            break;
         case 'll':
            startPoint = {x: this.state.size_map.size_x - 1, y: this.state.size_map.W - 1};
            // правый верхний
            for (let i = startPoint.x; i > startPoint.x - A.height - B.height; i--) {
               for (let j = startPoint.y; j > startPoint.y - A.width; j--) {
                  result.push({x: i, y: j});
               }
            }
            break;
         case 'rb':
            startPoint = {x: 0, y: this.state.size_map.size_y - this.state.size_map.W};
            // левый нижний
            for (let i = startPoint.x; i < startPoint.x + A.height + B.height; i++) {
               for (let j = startPoint.y; j < startPoint.y + A.width; j++) {
                  result.push({x: i, y: j});
               }
            }
            break;
      }

      return result;
   }

   solutionView(solution) {
      if (!solution) {
         return;
      }

      let res = [];
      res.push(solution);

      let parent = solution.parent;
      while (parent) {
         res.push(parent);
         parent = parent.parent;
      }

      res = res.reverse();

      for (let i = 0; i < res.length; i++) {
         this.setState(s => {
            return {
               trace: [...s.trace, [res[i].x, res[i].y]],
               x: res[i].x,
               y: res[i].y,
               delta_x: res[i].x - s.x,
               delta_y: res[i].y - s.y
            };
         });
      }
   }

   viewCorners = () => {
      // Получение размеров прямоугольников
      const rects = this.getRectanglesSize();
      const rectA = rects.A;
      const rectB = rects.B;

      const leftTopRegion = this.getPointsUnionOfRects(rectA, rectB, 'l', 'b');
      const rightTopRegion = this.getPointsUnionOfRects(rectA, rectB, 'l', 'l');
      const leftBottomRegion = this.getPointsUnionOfRects(rectA, rectB, 'r', 'b');
      const rightBottomRegion = this.getPointsUnionOfRects(rectA, rectB, 'r', 't');

      const cornerRegions = [
         ...leftTopRegion,
         ...rightTopRegion,
         ...leftBottomRegion,
         ...rightBottomRegion
      ];

      this.setState({corners: this.getCornersView(cornerRegions) || []});
      return cornerRegions;
   }

   getSolution = event => {
      this.reloadGame();
      const solver = new Solver(this.state.size_map.initial_x, this.state.size_map.initial_y, 0, 0,
         this.state.finish, this.state.size_map, this.state.walls, 2, this.state.finish[0].y + 1);
      let solution = solver.A_star();
      if (solution) {
         this.solutionView(solution);
      }
   }

   startSolve = event => {
      if (this.state.size_map.W) {
         this.viewCorners();
      }
      const solver = new Solver(this.state.size_map.initial_x, this.state.size_map.initial_y, 0, 0,
         this.state.finish, this.state.size_map, this.state.walls, 2, this.state.finish[0].y + 1);
      let solution = solver.graphState();

      if (solution.length) {
         this.setState({
            currentSolutionIndex: 0,
            currentSolution: solution,
            trace: [[this.state.size_map.initial_x, this.state.size_map.initial_y]]
         });

         this.solutionView(solution[0]);
      }
   }

   getMinSolutionPath(solution) {
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

   getCornersView(points) {
      return points.map(point => {
         return {
            type: "rect",
            x: point.x,
            y: point.y,
            height: 1,
            width: 1
         }
      })
   }

   // получаем возможные позиции
   getNeighbours(point) {
      const neighbours = [];
      neighbours.push({x: point.x + point.delta_x + 1, y: point.y + point.delta_y + 1});
      neighbours.push({x: point.x + point.delta_x + 0, y: point.y + point.delta_y + 1});
      neighbours.push({x: point.x + point.delta_x - 1, y: point.y + point.delta_y + 1});
      neighbours.push({x: point.x + point.delta_x + 1, y: point.y + point.delta_y + 0});
      neighbours.push({x: point.x + point.delta_x + 0, y: point.y + point.delta_y + 0});
      neighbours.push({x: point.x + point.delta_x - 1, y: point.y + point.delta_y + 0});
      neighbours.push({x: point.x + point.delta_x + 1, y: point.y + point.delta_y - 1});
      neighbours.push({x: point.x + point.delta_x + 0, y: point.y + point.delta_y - 1});
      neighbours.push({x: point.x + point.delta_x - 1, y: point.y + point.delta_y - 1});
      return neighbours;
   }

   updatePos = (x, y) => {
      let flag = false;
      if (x === this.state.x && y === this.state.y) {
         return {};
      }
      this.setState(s => {
         if (!this.isValidNextPos(x, y)) return {};
         return {
            trace: [...s.trace, [x, y]],
            x,
            y,
            delta_x: x - s.x,
            delta_y: y - s.y
         };
      });
      const s = this.state;

      if (this.isValidNextPos(x, y)) {
         const widthFinish = this.state.finish[0].width;
         let isWin = false;
         for(let i = 0; i < widthFinish; i++) {
            if (x === this.state.finish[0].x + i && y === this.state.finish[0].y + 1) {
               isWin = true;
            }
         }
         if (isWin && !flag) {
            alert('You win!');
            this.reloadGame();
            flag = true;
         }
      }
   };

   solutionChange = event => {
      this.reloadGame();
      const id = this.state.currentSolution.length - 1 >= this.state.currentSolutionIndex + 1 ? this.state.currentSolutionIndex + 1 : 0;
      this.solutionView(this.state.currentSolution[id]);

      this.setState(s => {
         return { currentSolutionIndex: id }
      });
   }

   optimalSolutionView = event => {
      this.reloadGame();
      const solution = this.getMinSolutionPath(this.state.currentSolution);

      if (solution) {
         this.solutionView(solution);
      }
   }

   reloadGame = event => {
      this.setState({
         x: this.state.size_map.initial_x,
         y: this.state.size_map.initial_y,
         delta_x: 0,
         delta_y: 0,
         trace: [[this.state.size_map.initial_x, this.state.size_map.initial_y]],
         corners: []
      });
   }

   handleClick = event => {
      const pt = this.svg.createSVGPoint();
      pt.x = event.clientX;
      pt.y = event.clientY;
      const cursopt = pt.matrixTransform(this.svg.getScreenCTM().inverse());

      const x = Math.round(cursopt.x);
      const y = Math.round(cursopt.y)
      this.updatePos(x, y);

      const neighbours = this.getNeighbours({x: x, y: y, delta_x: x - this.state.x, delta_y: y - this.state.y});
      let count = 0;
      for(let i = 0; i < neighbours.length; i++) {
         const isFinish = this.state.finish.some(finishPoint => intersect(finishPoint, [[x, y], [neighbours[i].x, neighbours[i].y]]));
         const isWall = this.intersectWall(x, y, neighbours[i].x, neighbours[i].y);
         const isExternal = neighbours[i].x <= 0 || neighbours[i].y <= 0 || neighbours[i].x >= this.state.size_map.size_x
            || neighbours[i].y >= this.state.size_map.size_y;
         const isUnderFinish = this.isFinishPoint(neighbours[i].x, neighbours[i].y) && (neighbours[i].y <= this.finish[0].y + 1);
         if (isWall || isFinish || isExternal || isUnderFinish || neighbours[i].x === x && neighbours[i].y === y) {
            count++;
         }
      }
      if (count === neighbours.length) {
         alert('You lose!');
      }
   };

   changeTrack = event => {
      const id = maps.length - 1 >= this.state.id_trace + 1 ? this.state.id_trace + 1 : 0;
      this.setState({
         size_map: maps[id].size_map,
         id_trace: id,
         W: maps[id].W,
         x: maps[id].size_map.initial_x,
         y: maps[id].size_map.initial_y,
         delta_x: 0,
         delta_y: 0,
         corners: [],
         currentSolution: [],
         currentSolutionIndex: 0,
         trace: [[maps[id].size_map.initial_x, maps[id].size_map.initial_y]],
         walls: maps[id].walls,
         finish: maps[id].finish
      });
   }

   goBack = event => {
      if (this.state.trace.length < 2) return;
      this.setState(s => {
         const newTrace = s.trace.slice(0, -1);
         const pos = newTrace[newTrace.length - 1];
         let delta = [0, 0];
         if (newTrace.length > 1) {
            const lastpos = newTrace[newTrace.length - 2];
            delta = [pos[0] - lastpos[0], pos[1] - lastpos[1]];
         }
         return {
            trace: newTrace,
            x: pos[0],
            y: pos[1],
            delta_x: delta[0],
            delta_y: delta[1]
         };
      });
   };

   render() {
      return (
         <div className="Game">
            <h1>RaceTrack</h1>
            <div>
               <button onClick={this.goBack}>Undo</button>
               <button className="reloadBtn" onClick={this.reloadGame}>New game</button>
               <button className="reloadBtn" onClick={this.changeTrack}>Change track</button>
            </div>
            <div>
               <button className="reloadBtn" onClick={this.startSolve}>Get with solution (graph state)</button>
               <button className="reloadBtn" onClick={this.solutionChange}>Next solution (graph state)</button>
               <button className="reloadBtn" onClick={this.optimalSolutionView}>View optimal solution (graph state)</button>
            </div>
            <div>
               <button className="reloadBtn" onClick={this.getSolution}>Get optimal solution A*</button>
            </div>
            <svg
               className="Game"
               viewBox={`-2 -2 ${this.state.size_map.size_x + 4} ${this.state.size_map.size_y + 4}`}
               onClick={this.handleClick}
               ref={ref => { this.svg = ref; }}>
               <Grid size_x={this.state.size_map.size_x} size_y={this.state.size_map.size_y} />
               <Walls walls={this.state.walls} />
               <Corner corners={this.state.corners} />
               <Finish finish={this.state.finish} />
               <Trace trace={this.state.trace} />
               <CurrentPos {...this.state} />
               {!this.isFinish(this.state.x, this.state.y) ? <NextPos {...this.state} /> : null}
            </svg>
         </div>
      );
   }
}

export default Game;
