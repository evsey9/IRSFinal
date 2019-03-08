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

mailbox.connect("192.168.77.1");

// Месторасположение роботов
var robot1_pos = 0;
var robot1_dir = 0;
var robot2_pos = 3;
var robot2_dir = 0;
var robot3_pos = 0;
var robot3_dir = 0;

// Параметры робота
d = 5.6 // Диаметр колеса, см
w = 17.5 // База, см
cpr = 360 // Показания энкодера за оборот
x = 0 // Начальные координаты робота
y = 0
a = 0 // Начальный угол робота
var n = 0;

////////////////////////////////
v = 65;//скорость движения
// Длина клетки 
var cellLength = 0;

//подходящий угол поворота чтобы в реальности было 90, важно влияет на гироскоп
degree_left = 0;
degree_right = 0;

//определяет величину поворота, не влияет на гироскоп, просто чтобы красиво было
target = 0

//Чтобы при остановке робот не скользил, подбираем мощность которая будет подаваться на моторы против направления вращения колеса
stop_turn = 0;
stop_forward = 0;

KOEF_FORWARD = 0

if (mailbox.myHullNumber() == 1){ 
	var cellLength = 900;
	degree_left = 90;
	degree_right = 90;
	target = 200
	stop_turn = 1;
	stop_forward = 1;
	KOEF_FORWARD = 5;
}

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

// adj[i][j] содержит номер сектора, который находится по направлению 0 <= j <= 3 от i-ой сектора
// или -1 если такого нет
// Номер сектора pos с координатами x, y:
// pos = x + y*8
var adj = [[-1, 1, 8, -1], [-1, 2, -1, 0], [-1, 3, 10, 1], [-1, 4, -1, 2], [-1, 5, -1, 3], [-1, -1, 13, 4], [-1, -1, -1, -1], [-1, -1, 15, -1], [0, -1, 16, -1], [-1, -1, -1, -1], [2, -1, 18, -1], [-1, -1, 19, -1], [-1, -1, -1, -1], [5, 14, 21, -1], [-1, 15, -1, 13], [7, -1, -1, 14], [8, 17, -1, -1], [-1, 18, -1, 16], [10, -1, 26, 17], [11, 20, 27, -1], [-1, 21, -1, 19], [13, -1, 29, 20], [-1, -1, -1, -1], [-1, -1, 31, -1], [-1, -1, 32, -1], [-1, -1, -1, -1], [18, -1, 34, -1], [19, -1, -1, -1], [-1, -1, -1, -1], [21, 30, 37, -1], [-1, 31, -1, 29], [23, -1, 39, 30], [24, 33, 40, -1], [-1, 34, -1, 32], [26, 35, 42, 33], [-1, 36, -1, 34], [-1, 37, 44, 35], [29, -1, 45, 36], [-1, -1, -1, -1], [31, -1, -1, -1], [32, -1, -1, -1], [-1, -1, -1, -1], [34, -1, 50, -1], [-1, -1, -1, -1], [36, 45, -1, -1], [37, 46, 53, 44], [-1, 47, -1, 45], [-1, -1, 55, 46], [-1, 49, 56, -1], [-1, 50, -1, 48], [42, 51, 58, 49], [-1, -1, 59, 50], [-1, -1, -1, -1], [45, -1, -1, -1], [-1, -1, -1, -1], [47, -1, 63, -1], [48, -1, -1, -1], [-1, -1, -1, -1], [50, 59, -1, -1], [51, 60, -1, 58], [-1, 61, -1, 59], [-1, 62, -1, 60], [-1, 63, -1, 61], [55, -1, -1, 62]];

// Варианты позиций (массив элементов вида [pos, dir])
var states = [];



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
	print("*")
	print(states)
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
		is_ok = is_ok && (on_front == (pos != -1 && pos != robot2_pos && pos != robot3_pos));
		
		pos = adj[robot_pos][(robot_dir + 3) % 4];
		is_ok = is_ok && (on_left  == (pos != -1 && pos != robot2_pos && pos != robot3_pos));
		
		pos = adj[robot_pos][(robot_dir + 1) % 4];
		is_ok = is_ok && (on_right == (pos != -1 && pos != robot2_pos && pos != robot3_pos));
		
		if (!is_ok) 
			states.splice(state, 1);
	}
	print("**")
	print(states)
}

rotCnt = 0;

// Локализация роботов, 
// Возвращает true/false (удалось ли локализоваться)
function localization() {
	// TODO: Добавить задержки если нужно
	init_states();
	update_states();
	
	// Движение по правилу правой руки
	while (states.length > 1 ) {
		if (mailbox.hasMessages()){
			msg = mailbox.receive()
			print(msg)
			robot1_pos = parseInt(msg, 10)
			return true;
		}
		
		
		if (is_free_on_right()) {
			turn_right();
			update_positions("R");
			script.wait(1000);
			update_states();
			forward();
			update_positions("F");
		} else if (is_free_on_front()) {
			forward();
			script.wait(1000);
			update_positions("F");
		} else {
			turn_left();
			script.wait(1000);
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


iRight = brick.sensor(A2)
iLeft = brick.sensor(A1)
iForward = brick.sensor(D1)
iBack = brick.sensor(D2)
enc_l = brick.encoder("E1")
enc_r = brick.encoder("E2")
motor_l = brick.motor("M1").setPower
motor_r = brick.motor("M2").setPower


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

// Свободно ли спереди от робота
function is_free_on_back() {
	return (iBack.read() > 40)
}

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
brick.gyroscope().calibrate(15000);
script.wait(16000);
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
		u = KOEF_FORWARD*e;
		mLeft(_vel + u);
		mRight(_vel - u);
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


var main = function() {
	
	
	
	if (mailbox.myHullNumber() == 1){
		localization()
		x = robot1_pos % 8
		y = (robot1_pos-robot1_pos % 8) / 8;
		brick.display().addLabel("("+x+","+y+")",1,1) //вывод ответа
		brick.display().redraw()
		script.wait(10000)
	}
	
	if (mailbox.myHullNumber() == 2){
		four_states = []
		four_states.push(is_free_on_left())
		four_states.push(is_free_on_front())
		four_states.push(is_free_on_right())
		four_states.push(is_free_on_back())
		print (four_states)
		while(true){
			if ( is_free_on_left() != four_states[0]){
				msg = adj[robot2_pos][(robot2_dir+3)%4]
				mailbox.send(1, msg)
				print("found3")
				print(msg)
			}
			if (is_free_on_front() != four_states[1]){
				msg = adj[robot2_pos][(robot2_dir)%4]
				mailbox.send(1, msg)
				print("found0")
				print(msg)
			}
			if (is_free_on_right() != four_states[2]){
				msg = adj[robot2_pos][(robot2_dir+1)%4]
				mailbox.send(1, msg)
				print("found1")
				print(msg)
			}
			if (is_free_on_back() != four_states[3]){
				msg = adj[robot2_pos][(robot2_dir+2)%4]
				mailbox.send(1, msg)
				print(msg)
				print("found2")
			}
			script.wait(100)
		}
	}
	if (mailbox.myHullNumber() == 3){
		four_states = []
		four_states.push(is_free_on_left())
		four_states.push(is_free_on_front())
		four_states.push(is_free_on_right())
		four_states.push(is_free_on_back())
		while(true){
			if ( is_free_on_left() != four_states[0]){
				msg = adj[robot3_pos][(robot3_dir+3)%4]
				mailbox.send(1, msg)
			}
			if (is_free_on_front() != four_states[1]){
				msg = adj[robot3_pos][(robot3_dir)%4]
				mailbox.send(1, msg)
			}
			if (is_free_on_right() != four_states[2]){
				msg = adj[robot3_pos][(robot3_dir+1)%4]
				mailbox.send(1, msg)
			}
			if (is_free_on_back() != four_states[3]){
				msg = adj[robot3_pos][(robot3_dir+2)%4]
				mailbox.send(1, msg)
			}
			script.wait(100)
		}
	}

}