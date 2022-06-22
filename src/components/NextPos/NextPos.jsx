import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {intersect} from "../../utils/intersect";

class NextPos extends PureComponent {
   static propTypes = {};

   isFinish(x, y) {
      const s = this.props;
      if (x === this.props.size_map.initial_x && y === this.props.size_map.initial_y) {
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
      this.props.walls.forEach((wall) => {
         if (x >= wall.x && x <= wall.x + wall.width && y >= wall.y && y <= wall.y + wall.height) {
            flag = true;
         }
      });
      if (!flag) {
         this.props.walls.forEach((wall) => {
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
      const widthFinish = this.props.finish[0].width;
      for(let i = 0; i < widthFinish; i++) {
         if (x === this.props.finish[0].x + i && y === this.props.finish[0].y + 1) {
            flag = true;
         }
      }
   }

   isValidNextPos(x, y) {
      const s = this.props;
      const isFinish = s.finish.some(finishPoint => intersect(finishPoint, [[s.x, s.y], [x, y]]));
      const isWall = this.intersectWall(s.x, s.y, x, y);
      const isExternal = x <= 0 || y <= 0 || x >= this.props.size_map.size_x || y >= this.props.size_map.size_y;
      const isUnderFinish = this.isFinishPoint(x, y) && (y <= this.props.finish[0].y + 1);
      const isWin = s.y > s.finish[0].y + 1 && y <= s.finish[0].y + 1;
      if (x === s.x && y === s.y) return 'unvalid';
      if (x > s.x + s.delta_x + 1 || x < s.x + s.delta_x - 1) return 'unvalid';
      if (y > s.y + s.delta_y + 1 || y < s.y + s.delta_y - 1) return 'unvalid';
      if (isWall || isFinish || isExternal || isUnderFinish) {
         return 'unvalid';
      }
      return 'valid';
   }

   render() {
      const { x, delta_x, y, delta_y} = this.props;
      const common = {
         r: 0.45
      };
      return (
         <g className="NextPos">
            <circle className={this.isValidNextPos(x + delta_x + 1, y + delta_y + 1)} cx={x + delta_x + 1} cy={y + delta_y + 1} {...common} />
            <circle className={this.isValidNextPos(x + delta_x + 0, y + delta_y + 1)} cx={x + delta_x + 0} cy={y + delta_y + 1} {...common} />
            <circle className={this.isValidNextPos(x + delta_x - 1, y + delta_y + 1)} cx={x + delta_x - 1} cy={y + delta_y + 1} {...common} />
            <circle className={this.isValidNextPos(x + delta_x + 1, y + delta_y + 0)} cx={x + delta_x + 1} cy={y + delta_y + 0} {...common} />
            <circle className={this.isValidNextPos(x + delta_x + 0, y + delta_y + 0)} cx={x + delta_x + 0} cy={y + delta_y + 0} {...common} />
            <circle className={this.isValidNextPos(x + delta_x - 1, y + delta_y + 0)} cx={x + delta_x - 1} cy={y + delta_y + 0} {...common} />
            <circle className={this.isValidNextPos(x + delta_x + 1, y + delta_y - 1)} cx={x + delta_x + 1} cy={y + delta_y - 1} {...common} />
            <circle className={this.isValidNextPos(x + delta_x + 0, y + delta_y - 1)} cx={x + delta_x + 0} cy={y + delta_y - 1} {...common} />
            <circle className={this.isValidNextPos(x + delta_x - 1, y + delta_y - 1)} cx={x + delta_x - 1} cy={y + delta_y - 1} {...common} />
         </g>
      );
   }
}

export default NextPos;
