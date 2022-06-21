import React from "react";

export const walls = [
   [
      {
         type: "rect",
         x: 3,
         y: 3,
         height: 2,
         width: 5
      }
   ],
   [
      {
         type: "rect",
         x: 4,
         y: 4,
         height: 3,
         width: 6
      }
   ],
   [
      {
         type: "rect",
         x: 3,
         y: 3,
         height: 3,
         width: 4
      },
      {
         type: "rect",
         x: 6,
         y: 5,
         height: 3,
         width: 3
      },
      {
         type: "rect",
         x: 0,
         y: 0,
         height: 1,
         width: 1
      },
      {
         type: "rect",
         x: 8,
         y: 7,
         height: 3,
         width: 3
      },
      {
         type: "rect",
         x: 0,
         y: 9,
         height: 1,
         width: 2
      },
      {
         type: "rect",
         x: 0,
         y: 10,
         height: 3,
         width: 3
      },
      {
         type: "rect",
         x: 3,
         y: 11,
         height: 2,
         width: 1
      },
      {
         type: "rect",
         x: 9,
         y: 0,
         height: 1,
         width: 3
      },
      {
         type: "rect",
         x: 12,
         y: 0,
         height: 4,
         width: 3
      },
      {
         type: "rect",
         x: 13,
         y: 12,
         height: 1,
         width: 1
      },
      {
         type: "rect",
         x: 14,
         y: 11,
         height: 2,
         width: 1
      }
   ],
   [
      {
         type: "rect",
         x: 3,
         y: 3,
         height: 2,
         width: 3
      },
      {
         type: "rect",
         x: 5,
         y: 4,
         height: 2,
         width: 2
      },
      {
         type: "rect",
         x: 0,
         y: 0,
         height: 2,
         width: 1
      },
      {
         type: "rect",
         x: 9,
         y: 7,
         height: 1,
         width: 1
      },
      {
         type: "rect",
         x: 8,
         y: 0,
         height: 2,
         width: 2
      }
   ],
   [
      {
         type: "rect",
         x: 3,
         y: 4,
         height: 3,
         width: 3
      },
      {
         type: "rect",
         x: 5,
         y: 4,
         height: 4,
         width: 3
      },
      {
         type: "rect",
         x: 6,
         y: 6,
         height: 5,
         width: 6
      },
      {
         type: "rect",
         x: 10,
         y: 8,
         height: 4,
         width: 3
      }
   ],
   [
      {
         type: "rect",
         x: 4,
         y: 4,
         height: 2,
         width: 2
      },
         {
            type: "rect",
            x: 3,
            y: 4,
            height: 2,
            width: 2
         },
         {
            type: "rect",
            x: 5,
            y: 6,
            height: 1,
            width: 4
         },
         {
            type: "rect",
            x: 8,
            y: 7,
            height: 5,
            width: 2
         },
         {
            type: "rect",
            x: 5,
            y: 12,
            height: 2,
            width: 4
         }
      ],
   [
      {
         type: "rect",
         x: 3,
         y: 2,
         height: 2,
         width: 10
      }
   ],
];

export const finish = [
   [
      {
         type: "rect",
         x: 0,
         y: 4,
         height: 1,
         width: 3
      }
   ],
   [
      {
         type: "rect",
         x: 0,
         y: 4,
         height: 1,
         width: 4
      }
   ],
   [
      {
         type: "rect",
         x: 0,
         y: 4,
         height: 1,
         width: 3
      }
   ],
   [
      {
         type: "rect",
         x: 0,
         y: 4,
         height: 1,
         width: 3
      }
   ],
   [
      {
         type: "rect",
         x: 0,
         y: 4,
         height: 1,
         width: 3
      }
   ],
   [
      {
         type: "rect",
         x: 0,
         y: 4,
         height: 1,
         width: 3
      }
   ],
   [
      {
         type: "rect",
         x: 0,
         y: 2,
         height: 1,
         width: 3
      }
   ]
];

export const size_map = [
   {
      size_x: 11,
      size_y: 8,
      initial_x: 2,
      initial_y: 4,
      W: 3
   },
   {
      size_x: 14,
      size_y: 11,
      initial_x: 1,
      initial_y: 4,
      W: 4
   },
   {
      size_x: 15,
      size_y: 13,
      initial_x: 1,
      initial_y: 4
   },
   {
      size_x: 10,
      size_y: 8,
      initial_x: 2,
      initial_y: 4
   },
   {
      size_x: 19,
      size_y: 17,
      initial_x: 2,
      initial_y: 4
   },
   {
      size_x: 13,
      size_y: 18,
      initial_x: 2,
      initial_y: 4
   },
   {
      size_x: 16,
      size_y: 6,
      initial_x: 2,
      initial_y: 2
   }
];

export const maps = [
   {
      walls: walls[0],
      finish: finish[0],
      size_map: size_map[0]
   },
   {
      walls: walls[1],
      finish: finish[1],
      size_map: size_map[1]
   },
   {
      walls: walls[2],
      finish: finish[2],
      size_map: size_map[2]
   },
   {
      walls: walls[3],
      finish: finish[3],
      size_map: size_map[3]
   },
   {
      walls: walls[4],
      finish: finish[4],
      size_map: size_map[4]
   },
   {
      walls: walls[5],
      finish: finish[5],
      size_map: size_map[5]
   },
   {
      walls: walls[6],
      finish: finish[6],
      size_map: size_map[6]
   }
];