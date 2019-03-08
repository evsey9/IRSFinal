var __interpretation_started_timestamp__;
var pi = 3.1415926535897931;
// adj[i][j] содержит номер сектора, который находится по направлению 0 <= j <= 3 от i-ой сектора
// или -1 если такого нет
// Номер сектора pos с координатами x, y:
// pos = x + y*8
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

var main = function() {
	brick.gyroscope().calibrate(2000); //калибровка гироскопа
	script.wait(2050)

	moveSmall() // небольшой проезд, чтобы встать по центру
	localization() //локализация

	x = robot1_pos % 8 //координата x робота 
	y = parseInt(robot1_pos / 8,10) //координата у робота 
	brick.display().addLabel("("+x+","+y+")",1,1) //вывод ответа
	brick.display().redraw()
	script.wait(5000)
	// TODO: Вывести месторасположение robot1_pos, robot1_dir
}