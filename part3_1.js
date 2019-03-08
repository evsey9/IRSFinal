pi = 3.141592653589793;
wait = script.wait;
sign = function(n) { return n > 0 ? 1 : n = 0 ? 0 : -1; }
sqr = function(n) { return n * n; }
sqrt = Math.sqrt;
min = function(a, b) { return a < b ? a : b; }
max = function(a, b) { return a > b ? a : b; }
abs = Math.abs;
sin = Math.sin;
cos = Math.cos;
round = Math.round;

// Параметры робота
d = 8 // Диаметр колеса, см
w = 20 // База, см
cpr = 360 // Показания энкодера за оборот
x = 0 // Начальные координаты робота
y = 0
a = 0 // Начальный угол робота
var n = 0;

////////////////////////////////
v = 65;//скорость движения
// Длина клетки 
var cellLength = 900;

//подходящий угол поворота чтобы в реальности было 90, важно влияет на гироскоп
degree_left = 0;
degree_right = 0;

//определяет величину поворота, не влияет на гироскоп, просто чтобы красиво было
target = 0

//Чтобы при остановке робот не скользил, подбираем мощность которая будет подаваться на моторы против направления вращения колеса
stop_turn = 0;
stop_forward = 0;

KOEF_FORWARD = 0

//if (mailbox.myHullNumber() == 1){ 
	var cellLength = 900;
	degree_left = 90;
	degree_right = -90;
	target = 200
	stop_turn = 1;
	stop_forward = 1;
	KOEF_FORWARD = 5;
/*}

if (mailbox.myHullNumber() == 2){ 
	var cellLength = 860;
	degree_left = 90;
	degree_right = -88.5;
	target = 190
	stop_turn = 1;
	stop_forward = 1;
	KOEF_FORWARD = 2;
}

if (mailbox.myHullNumber() == 3){ 
	var cellLength = 890;
	degree_left = 85;
	degree_right = -85.5;
	target = 200;
	stop_turn = 1;
	stop_forward = 1;
	KOEF_FORWARD = 5;
}
*/

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
    [3,19],
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
    [24,40,31],
    [25,34,41],
    [33,35],
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




iRight = brick.sensor(A2)
iLeft = brick.sensor(A1)
iForward = brick.sensor(D1)
enc_l = brick.encoder("E1")
enc_r = brick.encoder("E2")
motor_l = brick.motor("M1").setPower
motor_r = brick.motor("M2").setPower

rotCnt = 0;



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

function forward(robot) {
	moveForward();
}

// Поворот направо для робота с номером robot
function turn_right(robot) {
	turnRight();
	rotCnt += 1;
}

// Поворот налево для робота с номером robot
function turn_left(robot) {
	turnLeft();	
	rotCnt -= 1;
}

//.......................................................................................................................
// Энкодеры
eLeft = brick.encoder(E2);
eRight = brick.encoder(E1);

// Моторы
mLeft = brick.motor(M2).setPower;
mRight = brick.motor(M1).setPower;

var readGyro = brick.gyroscope().read
function readYaw() { return  -readGyro()[6]; }

var direction = 0; // absolute angle of direction movement
var directionOld = 0;
var azimut = 0; // we should go on azimut or turn to it
print("-------------------------------------------");

eLeft.reset();
eRight.reset();

var el = eLeft.readRawData();
var er = eRight.readRawData();
mLeft(0);
mRight(0);

//инициализация и калибровка гироскопа
//brick.gyroscope().calibrate(60000);
//script.wait(61000);
var calibvalues = [0, 0, 0, -101, 72, 3972]
brick.gyroscope().setCalibrationValues(calibvalues)
values = brick.gyroscope().getCalibrationValues();
print(values);


function angle()
{
	var sgn = 0;
	var _direction = readYaw(); // mgrad
	var dtDirection= _direction - directionOld;

	sgn = directionOld == 0 ? 0 : directionOld/Math.abs(directionOld);
	n += sgn*Math.floor(Math.abs(dtDirection/320000));
	direction = _direction + n * 360000;
	directionOld = _direction;
}


// делаем прерывание основной программы с частотой 200Гц, чтобы посчитать абсолютный угол с гироскопа
var mtimer = script.timer(50);
mtimer.timeout.connect(angle); 

//поворот на угол по гироскопу _angle - относительный угол на который необходимо повернуться
function turnDirection(_angle, _v){
	_angle = azimut + _angle;
	azimut = _angle;	
	_angle = _angle * 1000; //toMGrad
	
	eLeft.reset();
	eRight.reset();
	
	_speed =65;
	var angleOfRotate = - _angle + direction;
	var sgn =  angleOfRotate == 0 ? 0 : angleOfRotate/Math.abs(angleOfRotate);
	mLeft(-_speed * sgn);
	mRight(_speed * sgn);
	eLeftOld = eLeft.read();
	eRightOld = eRight.read();
	
	while (abs(eRight.read() - eLeft.read())/2 < target){
		eLeftCur = eLeft.read();
		eRightCur = eRight.read();
		if (eLeftCur == eLeftOld && eRightCur == eRightOld){
			_speed+=3;
			mLeft(-_speed * sgn);
			mRight(_speed * sgn);
		}
		eLeftOld = eLeftCur;
		eRightOld = eRightCur;
		script.wait(20);
	}
	
	
	mLeft(stop_turn * sgn)
	mRight(-stop_turn * sgn)
	script.wait(1);
	stop();
	script.wait(150);
}

// проезд в перед на количество ячеек _kceel со скоростью _v выравниваясь по гироскопу на угол azimut
function real_forward( _v, _kcell)
{
	_alpha = azimut;
	var _vel = _v == undefined ? 50 : _v;
	var u = 0;
	eLeft.reset();
	eRight.reset();
	var el = Math.abs(eLeft.readRawData());
	while(Math.abs(eLeft.readRawData()) < (el + (_kcell * cellLength))){
		e = _alpha-direction/1000;
		print(e);
		u = KOEF_FORWARD*e;
		mLeft(_vel + u);
		mRight(_vel - u);
		print(readGyro()[6])
		
		script.wait(50);
	}
	
	mLeft(-stop_forward);
	mRight(-stop_forward);
	script.wait(1);
	stop();
	script.wait(200);
}


// Поворот налево
function turnLeft(){
	turnDirection(degree_left, v);
}

// Поворот на
function turnRight(){
	turnDirection(degree_right,v);
}
// Движение вперед на одну клетку
function moveForward() {
	real_forward(v, 1);
}


function stop(){ //стоп моторов
	motor_r(0)
	motor_l(0)
	script.wait(50)
}
function maze_move(){
	var text = script.readAll("input.txt")
	print(text)
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
	
	//moveSmall() // небольшой проезд, чтобы встать по центру
	maze_move()
	/*localization()
	x = robot1_pos % 8
	y = parseInt(robot1_pos / 8,10)
	brick.display().addLabel("("+x+","+y+")",1,1) //вывод ответа
	brick.display().redraw()
	script.wait(5000)*/
	
}