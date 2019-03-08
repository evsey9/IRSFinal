var __interpretation_started_timestamp__;
var pi = 3.1415926535897931;
// adj[i][j] содержит номер сектора, который находится по направлению 0 <= j <= 3 от i-ой сектора
// или -1 если такого нет
// Номер сектора pos с координатами x, y:
// pos = x + y*8
lab = [ [9,2],



    [3,1],



    [2,11,4],



    [3,5],



    [4,6],



    [5,14],



    [],



    [16],



    [1,17],



    [],



    [3,9],



    [20],



    [],



    [6,22,15],



    [14,16],



    [8,15],



    [9,18],



    [17,19],



    [11,18,27],



    [28,12,21],



    [20,22],



    [21,14,30],



    [],



    [32],



    [33],



    [],



    [35,19],



    [20],



    [],



    [38,31,22],



    [30,32],



    [24,40],



    [25,34,41],



    [35,35],



    [34,27,36,43],



    [35,37],



    [38,45,36],



    [37,46,30],



    [],



    [32],



    [33],



    [],



    [51,35],



    [],



    [37,46],



    [38,54,45,47],



    [46,48],



    [47,56],



    [57,50],



    [49,51],



    [50,43,52,59],



    [51,60],



    [],



    [46],



    [],



    [48,64],



    [49],



    [],



    [51,60],



    [59,61,52],



    [60,62],



    [61,63],



    [62,64],



    [63,56],



    ]
function block(cell)
{
	lab[cell - 1] = []
	for(int i = 0; i < 64; i += 1){
		if (lab[i].indexOf(cell) != -1){
			lab[i].splice(lab[i].indexOf(cell), 1)
			}
		}
}
function reverse(arr)







{







	z = arr







	jl = z.length;







	for (var j = 0; j < jl/2; j += 1)







	{















			j_rev = jl - (j) - 1;















			temp = z[j_rev];















			z[j_rev] = z[j];















			z[j] = temp;















	}		















  return z







}















function bfs(start,finish){







    var n = 64;







    var Prev = new Array((n + 1));







	for (i = 0; i < Prev.length; i += 1)



		{



			Prev[i] = -1;



		}







    var D = new Array(n+1);







	for (i = 0; i < D.length; i += 1)



		{



			D[i] = -1;



		}







    D[start] = 0;







    var Q = [start];







    var Qstart = 0;







    while (Qstart < Q.length)


	{


        var u = Q[Qstart];

        Qstart += 1 ;


        for (i = 0; i < lab[u-1].length; i += 1) //v in lab[u-1]


		{

			var v = lab[u-1][i];

            if (D[v] == -1){


                Prev[v] = u;

                D[v] = D[u] + 1 ;







                Q.push(v);}







		}







	}



	



	function dv_per(dir,targ,coord)



	{



		var d = coord - targ;



		var i_d = 0;



		switch (d)



		{



			case 8:



				i_d = 1;



				break



			case -1:



				i_d = 2;



				break;



			case -8:



				i_d = 3;



				break;



			case 1:



				i_d = 4;



				break;



			}	

		dela = (i_d - dir)*90;

		dela = min(Math.abs(dela), Math.abs(360 - dela));

		dela *= (i_d-dir)/Math.abs(i_d-dir);

		rotate(dela);

		eht(80);

	}







    Ans = [];







    curr = finish;







    while (curr != start){







        Ans.push(curr);







        curr = Prev[curr];







	}







    Ans = reverse(Ans);







    return Ans;	



}





function get_cell(x, y){
    return 8 * y + x + 1
}
function get_coord(cell){
    return [(cell - 1) % 8, Math.floor((cell - 1) / 8)]
}
function make_sequence(path, dir, start){
    var cdir = dir
    var spath = []
    var i = 0
    var coord = get_coord(start)
	//print(coord)
	
    var finalcoord = get_coord(path[path.length - 1])
	//print("FINAL: "+finalcoord)
    while (!(coord[0] == finalcoord[0] && coord[1] == finalcoord[1])){
		//print("COORD: "+coord)
		//print("DIR: "+cdir)
		//print(coord == finalcoord)
        var nextcoord = get_coord(path[i])
        if (nextcoord[0] - coord[0] == 1){ //go right
            if (cdir == 1){ //facing up
                spath += ["R"]
            }
            if (cdir == 2){ //facing right
                //do nothing
            }
            if (cdir == 3){ //facing down
                spath += ["L"]
            }
            if (cdir == 4){ //facing left
                spath += ["R"]
                spath += ["R"]
            }
            cdir = 2
        }
        else if (nextcoord[0] - coord[0] == -1){ //go left
            if (cdir == 1){
                spath += ["L"]
            }
            if (cdir == 2){
                spath += ["R"]
                spath += ["R"]
            }
            if (cdir == 3){
                spath += ["R"]
            }
            if (cdir == 4){
                //do nothing
                
            }
            cdir = 4
        }
       else if (nextcoord[1] - coord[1] == 1){ //go down
            if (cdir == 1){
                spath += ["R"]
                spath += ["R"]
            }
            if (cdir == 2){
                spath += ["R"]
            }
            if (cdir == 3){
                //do nothing
            }
            if (cdir == 4){
                spath += ["L"]
            }
            cdir = 3
        }
        else if (nextcoord[1] - coord[1] == -1){ //go up
            if (cdir == 1){
                //do nothing
            }
            if (cdir == 2){
                spath += ["L"]
            }
            if (cdir == 3){
                spath += ["R"]
                spath += ["R"]
            }
            if (cdir == 4){
                spath += ["R"]
                
            }
            cdir = 1
        }
        spath += ["F"]
        i += 1
		
        coord = nextcoord
		
    }
	//print(spath)
	return spath;
}


var adj = [[-1, 1, 8, -1], [-1, 2, -1, 0], [-1, 3, 10, 1], [-1, 4, -1, 2], [-1, 5, -1, 3], [-1, -1, 13, 4], [-1, -1, -1, -1], [-1, -1, 15, -1], [0, -1, 16, -1], [-1, -1, -1, -1], [2, -1, 18, -1], [-1, -1, 19, -1], [-1, -1, -1, -1], [5, 14, 21, -1], [-1, 15, -1, 13], [7, -1, -1, 14], [8, 17, -1, -1], [-1, 18, -1, 16], [10, -1, 26, 17], [11, 20, 27, -1], [-1, 21, -1, 19], [13, -1, 29, 20], [-1, -1, -1, -1], [-1, -1, 31, -1], [-1, -1, 32, -1], [-1, -1, -1, -1], [18, -1, 34, -1], [19, -1, -1, -1], [-1, -1, -1, -1], [21, 30, 37, -1], [-1, 31, -1, 29], [23, -1, 39, 30], [24, 33, 40, -1], [-1, 34, -1, 32], [26, 35, 42, 33], [-1, 36, -1, 34], [-1, 37, 44, 35], [29, -1, 45, 36], [-1, -1, -1, -1], [31, -1, -1, -1], [32, -1, -1, -1], [-1, -1, -1, -1], [34, -1, 50, -1], [-1, -1, -1, -1], [36, 45, -1, -1], [37, 46, 53, 44], [-1, 47, -1, 45], [-1, -1, 55, 46], [-1, 49, 56, -1], [-1, 50, -1, 48], [42, 51, 58, 49], [-1, -1, 59, 50], [-1, -1, -1, -1], [45, -1, -1, -1], [-1, -1, -1, -1], [47, -1, 63, -1], [48, -1, -1, -1], [-1, -1, -1, -1], [50, 59, -1, -1], [51, 60, -1, 58], [-1, 61, -1, 59], [-1, 62, -1, 60], [-1, 63, -1, 61], [55, -1, -1, 62]];

// Варианты позиций (массив элементов вида [pos, dir])
var states = [];

// Месторасположение роботов
var robot1_pos = 0;
var robot1_dir = 0;


// Инициализация массива со всеми вариантами позиций роботов
function init_states() {
	states = [];
	for (var robot_pos = 0; robot_pos < adj.length; robot_pos++)
		for (var robot_dir = 0; robot_dir < 4; robot_dir++)
			states.push([robot_pos, robot_dir]);
}

// Обновить месторасположения робота
// action - один из символов ["F" (forward), "L" (turn left), "R" (turn right)]
function update_positions(action) {
	for (var state = states.length - 1; state >= 0; state--) {
		var is_ok = true;
		
		var robot_pos = states[state][0];
		var robot_dir = states[state][1];
		
		if (action == "F")
			robot_pos = adj[robot_pos][robot_dir];
		else if (action == "L")
			robot_dir = (robot_dir + 3) % 4;
		else if (action == "R")
			robot_dir = (robot_dir + 1) % 4;
			
		if (robot_pos == -1) {
			states.splice(state, 1);
		} else {
			states[state][0] = robot_pos;
			states[state][1] = robot_dir;
		}
	}
}

// Отсеивание вариантов позиций роботов
function update_states() {
	// Показания с датчиков
	var on_front = is_free_on_front();
	var on_left = is_free_on_left();
	var on_right = is_free_on_right();
	for (var state = states.length - 1; state >= 0; state--) {
		var is_ok = true;
		
		robot_pos = states[state][0];
		robot_dir = states[state][1];
		
		// Проверка позиций справа/слева/спереди от робота
		
		var pos = adj[robot_pos][robot_dir];
		is_ok = is_ok && (on_front == (pos != -1));
		
		pos = adj[robot_pos][(robot_dir + 3) % 4];
		is_ok = is_ok && (on_left  == (pos != -1));
		
		pos = adj[robot_pos][(robot_dir + 1) % 4];
		is_ok = is_ok && (on_right == (pos != -1));
		
		if (!is_ok) 
			states.splice(state, 1);
	}
}

// Локализация роботов, 
// Возвращает true/false (удалось ли локализоваться)
function localization() {
	init_states();
	update_states();
	
	// Движение по правилу правой руки
	while (states.length > 1) {

		if (is_free_on_right()) {
			turn_right();
			update_positions("R");
			update_states();
			forward();
			update_positions("F");
		} else if (is_free_on_front()) {
			forward();
			update_positions("F");
		} else {
			turn_left();
			update_positions("L");
		}
		update_states();
	}
	
	if (states.length == 1) {
		robot1_pos = states[0][0];
		robot1_dir = states[0][1];
		return true;
	} else
		return false;
}

iRight = brick.sensor(A2) //иницилизация правого датчика
iLeft = brick.sensor(A1) //иницилизация левого датчика
iForward = brick.sensor(D1) //иницилизация переднего датчика
enc_l = brick.encoder("E1")//иницилизация энкодера левого мотора
enc_r = brick.encoder("E2")
motor_l = brick.motor("M1").setPower //иницилизация левого мотора
motor_r = brick.motor("M2").setPower //иницилизация правого мотора

rotCnt = 0; //переменная для отслеживания движения (это нужно потому что гироскоп возвращает -180 - 180)

function sign(x) { //функция возвращает знак числа 
	if (x > 0) {
		return 1;
	} else if (x < 0) {
		return -1;
	} else {
		return 0;
	}
}
// Свободно ли слева от робота
function is_free_on_left() {
	return (iLeft.read() > 40)
}

// Свободно ли справа от робота
function is_free_on_right() {
	return (iRight.read() > 40)
}

// Свободно ли спереди от робота
function is_free_on_front() {
	return (iForward.read() > 40)
}

fullRot = 0;
// Движение вперед на 1 клетку для робота с номером robot
function moveSmall(){ //небольшой проезд вперед, чтобы встать по центру ячейки
	enc_r.reset()
	enc_l.reset()
	deg = (88/(pi*56))*360

	while((enc_l.read()+enc_r.read())/2 < deg){

		err =  brick.gyroscope().read()[6]/1000 - fullRot;

		motor_l(50-err*0.5)

		motor_r(50+err*0.5)

		script.wait(1);

		}
	stop()
}


function forward(robot) { //проехать вперед на одну ячейку
	enc_r.reset()
	enc_l.reset()

	deg = (700/(pi*56))*360
	
	direction = (rotCnt + 2) % 4 - 2;
	while((enc_l.read()+enc_r.read())/2 < deg) {
		gyro = brick.gyroscope().read()[6]/1000;
		if (direction == -2) {
			err = gyro + sign(gyro) * direction * 90
		} else {
			err =  gyro - direction * 90;	
		}
		motor_l(50-err*0.5)
		motor_r(50+err*0.5)
		script.wait(1);
	}
	stop()
}

// Поворот направо для робота
function turn_right() {
	enc_r.reset()
	enc_l.reset()
	
	deg = (174/56)*90
	motor_l(50)
	motor_r(-50)
	while(enc_l.read() < deg) {
		script.wait(1)
	}
	
	stop()
	
	rotCnt += 1;
}

// Поворот налево для робота 
function turn_left() {
	enc_r.reset()
	enc_l.reset()

	deg = (174/56)*90
	deg = 280
	motor_l(-50)
	motor_r(50)
	while(enc_r.read() < deg)
		script.wait(1)
	stop()
	
	rotCnt -= 1;
}

function stop(){ //стоп моторов
	motor_r(0)
	motor_l(0)
	script.wait(50)
}
function maze_move(){
	var text = script.readAll("input.txt")
	var olab = lab
	var startcoord = get_cell(parseInt((text[0].split(" "))[0]),parseInt((text[0].split(" "))[1]))
	var finalcoord = get_cell(parseInt((text[1].split(" "))[0]),parseInt((text[1].split(" "))[1]))
	var startdir = parseInt((text[0].split(" "))[2]) + 1
	var seq = make_sequence(bfs(startcoord,finalcoord), startdir, startcoord)
	//print(finalcoord)
	if (startcoord != 52 && finalcoord != 52 && startcoord != 45 && finalcoord != 45 && false){
		lab = olab
		lab[44] = []
		lab[51] = []
		lab[36] = [36, 38]
		lab[45] = [38, 47, 54]
		lab[59] = [59, 61]
		lab[50] = [43, 50, 59]
		var seq2 = make_sequence(bfs(startcoord,finalcoord), startdir, startcoord)
		lab = olab
		if (seq2.length < seq.length) seq = seq2
		}
	if (startcoord != 52 && finalcoord != 52 ){
		lab = olab
		lab[51] = []
		lab[59] = [59, 61]
		lab[50] = [43, 50, 59]
		var seq3 = make_sequence(bfs(startcoord,finalcoord), startdir, startcoord)
		lab = olab
		if (seq3.length < seq.length) seq = seq3
		}
	if (startcoord != 45 && finalcoord != 45){
		lab = olab
		lab[44] = []
		lab[36] = [36, 38]
		lab[45] = [38, 47, 54]
		var seq4 = make_sequence(bfs(startcoord,finalcoord), startdir, startcoord)
		lab = olab
		if (seq4.length < seq.length) seq = seq4
		}
	for(var i = 0; i < seq.length; i += 1){
			switch(seq[i]){
				case "F":
					forward();
					break;
				case "L":
					turn_left();
					break;
				case "R":
					turn_right();
					break;
				}
		}
	brick.display().addLabel(seq,1,1)
	brick.display().redraw()
	script.wait(5000)

}
var main = function() {
	brick.gyroscope().calibrate(2000); //калибровка гироскопа
	script.wait(2050)

	moveSmall() // небольшой проезд, чтобы встать по центру
	maze_move()
	//localization() //локализация

	/*x = robot1_pos % 8 //координата x робота 
	y = parseInt(robot1_pos / 8,10) //координата у робота 
	brick.display().addLabel("("+x+","+y+")",1,1) //вывод ответа
	brick.display().redraw()
	script.wait(5000)*/
	// TODO: Вывести месторасположение robot1_pos, robot1_dir
}