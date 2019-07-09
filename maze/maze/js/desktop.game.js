BasicGame.Game = function(game) {};
BasicGame.Game.prototype = {

  create: function() {
    game.stage.backgroundColor = "#ffffff";
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    // this.game.add.sprite(0, 0, 'debug');
    // let data = [
    //   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    //   [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    //   [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    //   [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    //   [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    //   [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    // ]

    //ЗАДАЕМ ДЛИНУ И ШИРИНУ
    let w = 19
    let h = 15

    var data = []
    var winPath = []
    for (var i = 0; i < h; i++) {
      data[i] = []
	 winPath[i] = []
      for (var j = 0; j < w; j++) {
	  winPath[i][j]=0;
        if ((i%2 == 1) && (j%2 == 1)){
          data[i][j] = 1
        }
        else {
          data[i][j] = 20
        }
      }
    }

    var eff_h = Math.floor((h-1)/2)
    var eff_w = Math.floor((w-1)/2)
    var visited_cells = []
    for (var i = 0; i < eff_h; i++) {
      visited_cells[i] = []
      for (var j = 0; j < eff_w; j++) {
        visited_cells[i][j] = 0
      }
    }
	
    function is_cell_visited(cell) {
        return visited_cells[cell[0]][cell[1]] == 1
    }
	
	
    function unvisited_neighbors(cell) {
      var result = []
      var candidates = [ [cell[0]-1,cell[1]],[cell[0]+1,cell[1]],[cell[0],cell[1]-1],[cell[0],cell[1]+1] ]
      for (var i = 0; i < candidates.length; i++){
        if ((candidates[i][0]>=0)&&(candidates[i][0]<eff_h)&&(candidates[i][1]>=0)&&(candidates[i][1]<eff_w)&&(!is_cell_visited(candidates[i]))){
          result.push(candidates[i])
        }
      }
      return result
    }

    function cell_to_data(cell){
      return [cell[0]*2+1,cell[1]*2+1]
    }

    function remove_wall_between_cells(cell_1,cell_2){
      data[  Math.floor(( cell_to_data(cell_1)[0]+cell_to_data(cell_2)[0])/2)][ Math.floor((cell_to_data(cell_1)[1]+cell_to_data(cell_2)[1])/2)] = 1
    }

    function make_cell_visited(cell){
      visited_cells[cell[0]][cell[1]] = 1
    }

    function there_are_unvisited_cells_present(){
      for (var i = 0; i < eff_h; i++) {
        for (var j = 0; j < eff_w; j++) {
          if (visited_cells[i][j] == 0)
            return true
        }
      }
      return false
    }
    function all_unvisited_cells(){
      var result = []
      for (var i = 0; i < eff_h; i++) {
        for (var j = 0; j < eff_w; j++) {
          if (visited_cells[i][j] == 0)
            result.push([i,j])
        }
      }
      return result
    }

    var is_finish_set = false;
    var current_cell = [0,0]
    make_cell_visited(current_cell)
    var stack = [];
    while (there_are_unvisited_cells_present())
    {
      current_unvisited_neighbors = unvisited_neighbors(current_cell)
      if ( current_unvisited_neighbors.length > 0 ){
        stack.push(current_cell)
        random_unvisited_neighbor = current_unvisited_neighbors[Math.floor(Math.random()*current_unvisited_neighbors.length)]
        remove_wall_between_cells(current_cell,random_unvisited_neighbor)
        current_cell = random_unvisited_neighbor
        make_cell_visited(current_cell)
      }
      else if (stack.length > 0) {
		if (is_finish_set==false){

			data[cell_to_data(current_cell)[0]][cell_to_data(current_cell)[1]] = 100;
			for (i=1;i<stack.length;i++){
				winPath[cell_to_data(stack[i])[0]][cell_to_data(stack[i])[1]]=1;

winPath[  Math.floor(( cell_to_data(stack[i])[0]+cell_to_data(stack[i-1])[0])/2)][ Math.floor((cell_to_data(stack[i])[1]+cell_to_data(stack[i-1])[1])/2)] = 1;
}
winPath[  Math.floor(( cell_to_data(stack[stack.length-1])[0]+cell_to_data(current_cell)[0])/2)][ Math.floor((cell_to_data(stack[stack.length-1])[1]+cell_to_data(current_cell)[1])/2)] = 1;
			is_finish_set=true;
		}
		current_cell = stack.pop()
      }
      else if (there_are_unvisited_cells_present()) {
          current_unvisited_cells = all_unvisited_cells()
          random_unvisited_cell = current_unvisited_cells[Math.floor(Math.random()*current_unvisited_cells.length)]
          make_cell_visited(random_unvisited_cell)
          current_cell = random_unvisited_cell
      }
      
    }
//при четной длине/ширине убираем некрасивые края
if (w%2==0){
for (var i=0; i < h; i++){
	data[i][w-1] = 20;	
	}
}
if (h%2==0){
for (var i=0; i < w; i++){
	data[h-1][i] = 20;	
	}
}
//задание финишной ячейки без учета изолированных областей
data[1][1]=30;
for (var i = w-1; i > 0; i--) {
	for (var j = h-1;  j > 0; j--) {
		if ((data[j][i]==1&&data[j-1][i]==20&&data[j][i-1]==20&&data[j][i+1]==20)||(data[j][i]==1&&data[j+1][i]==20&&data[j-1][i]==20&&data[j][i+1]==20)||(data[j][i]==1&&data[j+1][i]==20&&data[j-1][i]==20&&data[j][i-1]==20)){
			//data[j][i]=100;
			i=0;
			j=0;
		}
     }

}







    /*let data = [
      [34, 34, 34, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
      [34, 30, 34, 1, 1, 1, 1, 1, 1, 20, 1, 1, 1, 1, 1, 1, 1, 1, 1, 20],
      [34, 29, 34, 1, 20, 20, 20, 20, 20, 20, 1, 20, 20, 20, 20, 20, 20, 20, 1, 20],
      [20, 1, 20, 1, 20, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 20, 1, 20, 1, 20],
      [20, 1, 20, 1, 20, 1, 20, 20, 20, 20, 20, 1, 20, 20, 1, 20, 1, 20, 1, 20],
      [20, 1, 1, 1, 20, 1, 20, 1, 1, 1, 20, 1, 1, 20, 1, 20, 1, 1, 1, 20],
      [20, 1, 20, 1, 1, 1, 20, 1, 20, 1, 20, 1, 20, 20, 20, 20, 20, 20, 1, 20],
      [20, 1, 20, 1, 20, 1, 20, 1, 20, 1, 20, 1, 1, 1, 1, 1, 1, 20, 1, 20],
      [20, 1, 20, 20, 20, 1, 20, 1, 20, 1, 20, 1, 20, 20, 20, 20, 1, 20, 1, 20],
      [20, 1, 1, 1, 1, 1, 20, 1, 20, 1, 20, 1, 1, 1, 1, 20, 1, 20, 1, 20],
      [20, 1, 20, 20, 20, 20, 20, 1, 20, 20, 20, 1, 20, 104, 104, 104, 1, 20, 1, 20],
      [20, 1, 20, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 104, 100, 99, 1, 20, 1, 20],
      [20, 1, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 1, 104, 104, 104, 20, 20, 1, 20],
      [20, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 20],
      [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
    ]

    let winPath = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
*/
    this.gameStatus = true;
    this.groupWall = game.add.physicsGroup(Phaser.Physics.ARCADE);
    this.groupPath = game.add.physicsGroup(Phaser.Physics.ARCADE);
    this.groupWinPath = game.add.physicsGroup(Phaser.Physics.ARCADE);
    this.finishCell = this.add.sprite(40, 40, 'pathFinish');
    this.game.physics.enable(this.finishCell, Phaser.Physics.ARCADE);
    this.drawMaze(data);
    this.men = this.add.sprite(38, 38, 'men');
    this.men.move = true;
    this.game.physics.enable(this.men, Phaser.Physics.ARCADE);
    this.cursors = this.game.input.keyboard.createCursorKeys();
    console.log(this.groupWall)
    this.time = game.time.create(false);
    this.timeStatus = false;
    this.timeText = game.add.text(0, 500, 'Time: 0s', {
      font: '30px Arial',
      fill: '#000000'
    });
    this.btn = this.add.sprite(300, 500, 'btn');
    this.btn.inputEnabled = true;
    this.btn.input.useHandCursor = true;
    this.btn.events.onInputDown.add(function() {
      this.gameStatus = false;
      this.men.move = false;
      this.time.stop();
    }, this);
    this.btn.events.onInputUp.add(function() {
      this.drawWinPath(winPath);
    }, this);
  },

  update: function() {

    this.game.physics.arcade.collide(this.men, this.groupWall);
    this.game.physics.arcade.overlap(this.men, this.finishCell, this.endRound, null, this);

    // this.men.body.velocity.x = 0;
    // this.men.body.velocity.y = 0;
    this.men.body.velocity.setTo(0, 0);
    if (this.cursors.left.isDown & this.men.move) {
      this.initTime();
      this.men.body.velocity.x = -200;
    } else if (this.cursors.right.isDown & this.men.move) {
      this.initTime();
      this.men.body.velocity.x = 200;
    }

    if (this.cursors.up.isDown & this.men.move) {
      this.initTime();
      this.men.body.velocity.y = -200;
    } else if (this.cursors.down.isDown & this.men.move) {
      this.initTime();
      this.men.body.velocity.y = 200;
    }

    if (this.game.input.mousePointer.isDown & this.men.move) {
      this.initTime();
      this.game.physics.arcade.moveToPointer(this.men, 200);
      if (Phaser.Rectangle.contains(this.men.body, this.game.input.x, this.game.input.y)) {
        this.men.body.velocity.setTo(0, 0);
      }
    }

  },

  endRound: function() {
    if (this.gameStatus) {
      let curentTime = new Date();
      let finishTimeSecond = Math.floor((curentTime - this.timeStart) / 1000);
      let finishTimeMS = (curentTime - this.timeStart) % 1000;
      if (finishTimeMS < 100) {
        finishTimeMS = '0' + finishTimeMS;
      } else if (finishTimeMS < 10) {
        finishTimeMS = '00' + finishTimeMS;
      }
      let this_ = this;
      setTimeout(function() {
        this_.men.move = false;
      }, 500);
      this.gameStatus = false;

      this.time.stop();
      game.add.text(0, 600, `Result: ${finishTimeSecond}.${finishTimeMS}s`, {
        font: '35px Arial',
        fill: '#000000'
      });
    }
  },

  initTime: function() {
    if (!this.timeStatus) {
      this.timeStatus = true;
      this.timeStart = new Date();
      this.time.repeat(1 * Phaser.Timer.SECOND, 7200, this.updateTime, this);
      this.time.start();
    }
  },

  updateTime: function() {
    let time = new Date();
    let seconds = Math.round((time - this.timeStart) / 1000);
    let timeString = `Time: ${seconds}s`;

    this.timeText.text = timeString;
  },

  drawMaze: function(data) {
    let groupWall = this.groupWall;
    let groupPath = this.groupPath;
    let finishCell = this.finishCell;
    data.forEach(function(item, i, arr) {
      item.forEach(function(cell, indexWall, arrWall) {
        switch (cell) {
          case 1:
            let pathSprite = groupPath.create(indexWall * 32, i * 32, 'path');
            pathSprite.body.immovable = true;
            break;
          case 20:
            let wallSprite = groupWall.create(indexWall * 32, i * 32, 'wall');
            wallSprite.body.immovable = true;
            break;
          case 29:
            let pathStartSprite = groupPath.create(indexWall * 32, i * 32, 'pathStart');
            pathStartSprite.body.immovable = true;
            break;
          case 30:
            let pathPreStartSprite = groupPath.create(indexWall * 32, i * 32, 'pathPreStart');
            pathPreStartSprite.body.immovable = true;
            break;
          case 34:
            let wallStartSprite = groupWall.create(indexWall * 32, i * 32, 'wallStart');
            wallStartSprite.body.immovable = true;
            break;
          case 99:
            let pathPreFinishSprite = groupPath.create(indexWall * 32, i * 32, 'pathPreFinish');
            pathPreFinishSprite.body.immovable = true;
            break;
          case 100:
            let pathFinishSprite = groupPath.create(indexWall * 32, i * 32, 'pathFinish');
            pathFinishSprite.body.immovable = true;
            finishCell.position.x = indexWall * 32;
            finishCell.position.y = i * 32;
            break;
          case 104:
            let wallFinishSprite = groupWall.create(indexWall * 32, i * 32, 'wallFinish');
            wallFinishSprite.body.immovable = true;
            break;
        }
      });
    });
  },

  drawWinPath: function(data) {
	//alert(document.getElementsByTagName('input')[0].value);
    let groupWinPath = this.groupWinPath;
    data.forEach(function(item, i, arr) {
      item.forEach(function(cell, indexWall, arrWall) {
        if (cell === 1) {
          let winPathSprite = groupWinPath.create(indexWall * 32, i * 32, 'pathWin');
          winPathSprite.body.immovable = true;
        }
      });
    });

  }

};