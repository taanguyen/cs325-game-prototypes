// positions of three bombs
// positions of home squares
// player position
var size = 160;

let levels = {
  1: {
        bombs: [[1,0], [1,2], [3,3]],
        goal: [2,0],
        trap: [3,1],
        player: [0,0]
  },

  2: {
        bombs: [[1,0], [1,1], [2,3]],
        goal: [3,0],
        trap: [3,1],
        player:[0,0]
  },

  3: {
        bombs: [[0,0], [0,2], [2,2]],
        goal: [3,1],
        trap: [1,1],
        player: [0,0]
  },

  4: {
        bombs: [[0,1], [1,2], [2,2]],
        goal: [1,0],
        trap: [2,0],
        player: [0,0]
  },

  5: {
        bombs: [[0,1], [2,2], [2,3]],
        goal: [3,0],
        trap: [2,1],
        player: [0,0]
  }

}
