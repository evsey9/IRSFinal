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
var xsize = 160
var ysize = 120
var arcells = 6
function listToMatrix(list, elementsPerSubArray) {
	var matrix = [], i, k;

	for (i = 0, k = -1; i < list.length; i++) {
		if (i % elementsPerSubArray === 0) {
			k++;
			matrix[k] = [];
		}

		matrix[k].push(list[i]);
	}
	return matrix;
}
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {

	// Check if none of the lines are of length 0
	if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
		return false
	}

	denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

	// Lines are parallel
	if (denominator === 0) {
		return false
	}

	var ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
	var ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

	// is the intersection along the segments
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
		return false
	}

	// Return a object with the x and y coordinates of the intersection
	var x = x1 + ua * (x2 - x1)
	var y = y1 + ua * (y2 - y1)

	return [x, y];
}
var recartag = function()
{
	//brick.motor(M3).setPower(100);
	//script.wait(1000);
	__interpretation_started_timestamp__ = Date.now();
	b = getPhoto();
	var c = listToMatrix(b,xsize)

	var rgbarray = new Array(ysize)
	for (var i = 0; i < rgbarray.length; i++) {
		rgbarray[i] = new Array(xsize);
	}

	for (var i = 0; i < ysize; i++){
		for (var j = 0; j < xsize; j++){
			rgbarray[i][j] = [0, 0, 0]
			rgbarray[i][j][0] = (parseInt(c[i][j]) & 16711680) >>> 16
			rgbarray[i][j][1] = (parseInt(c[i][j]) & 65280) >>> 8
			rgbarray[i][j][2] = (parseInt(c[i][j]) & 255)
		}
	}
	var garray = new Array(ysize);
	for (var i = 0; i < garray.length; i++) {
		garray[i] = new Array(xsize);
	}
	for (var i = 0; i < ysize; i++){
		for (var j = 0; j < xsize; j++){
			garray[i][j] = (rgbarray[i][j][0]+rgbarray[i][j][1]+rgbarray[i][j][2]) / 3

		}
	}
	var thresholdGrey = 255 / 6;
	for (var i = 0; i < ysize; i++){
		for (var j = 0; j < xsize; j++){
			garray[i][j] = garray[i][j] > thresholdGrey ? 0 : 1;

		}
	}
	for (var i = 0; i < ysize; i++){
		print(garray[i])
	}
	for (var i = 0; i < ysize; i++){
		for (var j = 0; j < 5; j++){
			garray[i][j] = 0
		}
	}
	var x = 0;
	var y = 0;
	var l = 0;
	var ULcorner = [0, 0];
	var URcorner = [0, 0];
	var DLcorner = [0, 0];
	var DRcorner = [0, 0];
	////print("ULCORNER");
	////print(garray.length);



	while (garray[y][x] != 1){
		////print(x, y);
		if (y >= ysize - 1){
			l += 1;
			y = 0;
			x = l;
		}
		if (x <= 0){
			l += 1;
			y = 0;
			x = l;
		}
		else{
			y += 1;
			x -= 1;
		}
	}
	ULcorner = [x, y]
	////print("URCORNER");
	var x = xsize-1;
	var y = 0;
	var l = 0;
	while (garray[y][x] != 1){
		////print(x, " ", y);
		//x//print(y);
		if (y >= ysize - 1){
			l += 1;
			y = 0;
			x = xsize - 1 - l;
			continue;
		}
		if (x >= xsize-1){
			l += 1;
			y = 0;
			x = xsize - 1 - l;
		}
		else{
			y += 1;
			x += 1;
		}
	}
	URcorner = [x, y]

	////print("dLCORNER");
	var x = 0;
	var y = ysize - 1;
	var l = 0;
	while (garray[y][x] != 1){
		////print(x, y);
		if (y <= 1){
			l += 1;
			y = ysize - 1;
			x = l;
			continue;
		}
		if (x <= 0){
			l += 1;
			y = ysize - 1;
			x = l;
		}
		else{
			y -= 1;
			x -= 1;
		}
	}
	DLcorner = [x, y]

	////print("DRCORNER");
	var x = xsize - 1;
	var y = ysize - 1;
	var l = 0;
	while (garray[y][x] != 1){
		////print(x, y);
		if (y <= 1){
			l += 1;
			y = ysize - 1;
			x = xsize - 1 - l;
			continue;
		}
		if (x >= xsize - 1){
			l += 1;
			y = ysize - 1;
			x = xsize - 1 - l;
		}
		else{
			y -= 1;
			x += 1;
		}
	}
	DRcorner = [x, y]
	//print("RESULTS");
	//print(ULcorner);
	//print(URcorner);
	//print(DLcorner);
	//print(DRcorner);
	var centre = [(ULcorner[0] + URcorner[0] + DLcorner[0] + DRcorner[0]) / 4, (ULcorner[1] + URcorner[1] + DLcorner[1] + DRcorner[1]) / 4];

	var dirvecUP = [URcorner[0]-ULcorner[0],URcorner[1]-ULcorner[1]];
	var lenUP = Math.sqrt(dirvecUP[0]*dirvecUP[0]+dirvecUP[1]*dirvecUP[1]);
	var normvecUP = [dirvecUP[0] / lenUP, dirvecUP[1] / lenUP];
	var angleUP = Math.atan2(dirvecUP[1],dirvecUP[0]);
	var onelenUP = lenUP / arcells;
	var onevecUP = [normvecUP[0] * onelenUP, normvecUP[1] * onelenUP];

	var dirvecLEFT = [DLcorner[0]-ULcorner[0],DLcorner[1]-ULcorner[1]];
	var lenLEFT = Math.sqrt(dirvecLEFT[0]*dirvecLEFT[0]+dirvecLEFT[1]*dirvecLEFT[1]);
	var normvecLEFT = [dirvecLEFT[0] / lenLEFT, dirvecLEFT[1] / lenLEFT];
	var angleLEFT = Math.atan2(dirvecLEFT[1],dirvecLEFT[0]);
	var onelenLEFT = lenLEFT / arcells;
	var onevecLEFT = [normvecLEFT[0] * onelenLEFT, normvecLEFT[1] * onelenLEFT];

	var dirvecDOWN = [DRcorner[0]-DLcorner[0],DRcorner[1]-DLcorner[1]];
	var lenDOWN = Math.sqrt(dirvecDOWN[0]*dirvecDOWN[0]+dirvecDOWN[1]*dirvecDOWN[1]);
	var normvecDOWN = [dirvecDOWN[0] / lenDOWN, dirvecDOWN[1] / lenDOWN];
	var angleDOWN = Math.atan2(dirvecDOWN[1],dirvecDOWN[0]);
	var onelenDOWN = lenDOWN / arcells;
	var onevecDOWN = [normvecDOWN[0] * onelenDOWN, normvecDOWN[1] * onelenDOWN];

	var dirvecRIGHT = [DRcorner[0]-URcorner[0],DRcorner[1]-URcorner[1]];
	var lenRIGHT = Math.sqrt(dirvecRIGHT[0]*dirvecRIGHT[0]+dirvecRIGHT[1]*dirvecRIGHT[1]);
	var normvecRIGHT = [dirvecRIGHT[0] / lenRIGHT, dirvecRIGHT[1] / lenRIGHT];
	var angleRIGHT = Math.atan2(dirvecRIGHT[1],dirvecRIGHT[0]);
	var onelenRIGHT = lenRIGHT / arcells;
	var onevecRIGHT = [normvecRIGHT[0] * onelenRIGHT, normvecRIGHT[1] * onelenRIGHT];


	var artag = new Array(arcells - 2)
	for (var i = 0; i < artag.length; i++) {
		artag[i] = new Array(arcells - 2);
	}
	////print("CENTRE");
	////print(centre);
	////print("DIRVEC UP BASE");
	////print(dirvec);
	////print("DIRVEC UP NORM");
	////print(normvecUP);
	//var degrees = 180*angle/Math.PI;
	////print(angleUP);
	////print("LEN UP");
	////print(lenUP);

	//print("ONE VEC UP");
	//print(onevecUP);
	//print("ONE VEC DOWN");
	//print(onevecDOWN);
	//print("ONE VEC LEFT");
	//print(onevecLEFT);
	//print("ONE VEC RIGHT");
	//print(onevecRIGHT);

	for (var i = 1; i < arcells - 1; i++){
		for (var j = 1; j < arcells - 1; j++){
			//(13.5, 0.333)   (13.5, 0.333)
			var cxU = onevecUP[0] * j + onevecUP[0] / 2;
			var cyU = onevecUP[1] * i;
			var cxD = onevecDOWN[0] * j + onevecDOWN[0] / 2 + dirvecLEFT[0];
			var cyD = onevecDOWN[1] * i + dirvecLEFT[1];
			var cxL = onevecLEFT[0] * j;
			var cyL = onevecLEFT[1] * i + onevecLEFT[1] / 2;
			var cxR = onevecRIGHT[0] * j + dirvecUP[0];
			var cyR = onevecRIGHT[1] * i + onevecRIGHT[1] / 2 + dirvecUP[1];
			var vec = intersect(cxU, cyU, cxD, cyD, cxL, cyL, cxR, cyR);
			////print(vec);
			//print("CUR VALS: ", parseInt(cxU), " ", parseInt(cyU), " ", parseInt(cxD), " ", parseInt(cyD), " ", parseInt(cxL), " ", parseInt(cyL), " ", parseInt(cxR), " ", parseInt(cyR));
			//print("VEC: ", vec)
			artag[i - 1][j - 1] = garray[ULcorner[1] + Math.round(vec[1])][ULcorner[0] + Math.round(vec[0])];
		}
		//print("NEW ROW");
	}



	for (var i = 0; i < artag.length; i++){
		print(artag[i]);
	}
	print(artag)
	if (artag[0][0] == 0){
		for (var i = 0; i < artag.length; i++){
			artag[i].reverse();
			////print(artag[i]);
		}
		artag.reverse();
	}
	else if (artag[3][0] == 0){
		var newArray = artag.reverse();

		for (var i = 0; i < newArray.length; i++) {
			for (var j = 0; j < i; j++) {
				var temp = newArray[i][j];
				newArray[i][j] = newArray[j][i];
				newArray[j][i] = temp;
			}
		}
		for (var i = 0; i < newArray.length; i++){
			newArray[i].reverse();
			////print(artag[i]);
		}
		newArray.reverse();

		artag = newArray;
	}
	else if (artag[0][3] == 0){ //clockwise
		var newArray = artag.reverse();

		for (var i = 0; i < newArray.length; i++) {
			for (var j = 0; j < i; j++) {
				var temp = newArray[i][j];
				newArray[i][j] = newArray[j][i];
				newArray[j][i] = temp;
			}
		}
		artag = newArray;

	}
	//print("NEW");
	for (var i = 0; i < artag.length; i++){
		print(artag[i]);
	}
	var xar;
	var yar;
	var nar;
	xar = [artag[1][3]] + [artag[2][0]] + [artag[2][2]];
	yar = [artag[2][3]] + [artag[3][1]] + [artag[3][2]];
	nar = [artag[1][0]] + [artag[1][2]];
	var xnum;
	var ynum;
	var nnum;
	xnum = parseInt( xar, 2 );
	ynum = parseInt( yar, 2 );
	nnum = parseInt( nar, 2 );
	////print("FINAL");
	////print(xnum);
	////print(ynum);
	////print(nnum);
	//print(xnum + " " + ynum + " " + nnum);
	brick.playTone(1000, 50);
	brick.display().addLabel(nnum + " ("+xnum + ";" + ynum + ")", 1, 1);
	brick.display().redraw()
	//while(b != '1'){ script.wait(10);};
	return [xnum, ynum, nnum];
}
//ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END
//ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END
//ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END
//ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END
//ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END
//ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END
//ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END ARTAG END
mailbox.connect("192.168.77.1");

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
var cellLength = 0;

//подходящий угол поворота чтобы в реальности было 90, важно влияет на гироскоп
degree_left = 0;
degree_right = 0;

//определяет величину поворота, не влияет на гироскоп, влияет на энкодеры (больше target больше поворот)
target = 0

//Чтобы при остановке робот не скользил, подбираем мощность которая будет подаваться на моторы против направления вращения колеса
stop_turn = 0;
stop_forward = 0;

KOEF_FORWARD = 0

if (mailbox.myHullNumber() == 1){
	var cellLength = 900;
	degree_left = 90;
	degree_right = -90;
	target = 200
	stop_turn = 1;
	stop_forward = 1;
	KOEF_FORWARD = 5;
}

if (mailbox.myHullNumber() == 2){
	var cellLength = 860;
	degree_left = 90;
	degree_right = -90;
	target = 190
	stop_turn = 1;
	stop_forward = 1;
	KOEF_FORWARD = 2;
}

if (mailbox.myHullNumber() == 3){
	var cellLength = 890;
	degree_left = 90;
	degree_right = -90;
	target = 200;
	stop_turn = 1;
	stop_forward = 1;
	KOEF_FORWARD = 5;
}



iRight = brick.sensor(A2)
iLeft = brick.sensor(A1)
iForward = brick.sensor(D1)
enc_l = brick.encoder("E1")
enc_r = brick.encoder("E2")
motor_l = brick.motor("M1").setPower
motor_r = brick.motor("M2").setPower


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

calibvalues = [-212, -77, -81, -112, 50, 3978]
//brick.gyroscope().calibrate(60000);
//script.wait(61000);
//values = brick.gyroscope().getCalibrationValues();
//print(values);
brick.gyroscope().setCalibrationValues([-212, -77, -81, -112, 50, 3978])

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

rotCnt = 0;







// Свободно ли слева от робота

function is_free_on_left() {

	return (iLeft.read() > 20)

}



// Свободно ли справа от робота

function is_free_on_right() {

	return (iRight.read() > 20)

}



// Свободно ли спереди от робота

function is_free_on_front() {

	return (iForward.read() > 20)

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

	print("**")

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

		is_ok = is_ok && (on_front == (pos != -1));



		pos = adj[robot_pos][(robot_dir + 3) % 4];

		is_ok = is_ok && (on_left  == (pos != -1));



		pos = adj[robot_pos][(robot_dir + 1) % 4];

		is_ok = is_ok && (on_right == (pos != -1));



		if (!is_ok)

			states.splice(state, 1);

	}

	print("*")

	print(states)

}



// Локализация роботов,

// Возвращает true/false (удалось ли локализоваться)

function localization() {

	// TODO: Добавить задержки если нужно

	init_states();

	print(states)

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

// Начальные позиции роботов
var robot_pos = [0, 0, 0];
var robot_dir = [0, 0, 0];

var finish_dir = 0;

function includes(array, element) {
	for (var i = 0; i < array.length; i++)
		if (array[i] == element)
			return true;
	return false;
}

// Возвращает маршрут позиции (start_pos; start_dir) в сектор finish_pos для робота с номером robot
// или null если маршрута не существует
// Маршрут представляет из себя строку из символов ["F" (forward), "L" (turn left), "R" (turn right)]
// Алгоритм поиска ширины по позициям [pos, dir] гарантирует оптимальность по длине строки (количество действий)
var adj = [[-1, 1, 8, -1], [-1, 2, -1, 0], [-1, 3, 10, 1], [-1, 4, -1, 2], [-1, 5, -1, 3], [-1, -1, 13, 4], [-1, -1, -1, -1], [-1, -1, 15, -1], [0, -1, 16, -1], [-1, -1, -1, -1], [2, -1, 18, -1], [-1, -1, 19, -1], [-1, -1, -1, -1], [5, 14, 21, -1], [-1, 15, -1, 13], [7, -1, -1, 14], [8, 17, -1, -1], [-1, 18, -1, 16], [10, -1, 26, 17], [11, 20, 27, -1], [-1, 21, -1, 19], [13, -1, 29, 20], [-1, -1, -1, -1], [-1, -1, 31, -1], [-1, -1, 32, -1], [-1, -1, -1, -1], [18, -1, 34, -1], [19, -1, -1, -1], [-1, -1, -1, -1], [21, 30, 37, -1], [-1, 31, -1, 29], [23, -1, 39, 30], [24, 33, 40, -1], [-1, 34, -1, 32], [26, 35, 42, 33], [-1, 36, -1, 34], [-1, 37, 44, 35], [29, -1, 45, 36], [-1, -1, -1, -1], [31, -1, -1, -1], [32, -1, -1, -1], [-1, -1, -1, -1], [34, -1, 50, -1], [-1, -1, -1, -1], [36, 45, -1, -1], [37, 46, 53, 44], [-1, 47, -1, 45], [-1, -1, 55, 46], [-1, 49, 56, -1], [-1, 50, -1, 48], [42, 51, 58, 49], [-1, -1, 59, 50], [-1, -1, -1, -1], [45, -1, -1, -1], [-1, -1, -1, -1], [47, -1, 63, -1], [48, -1, -1, -1], [-1, -1, -1, -1], [50, 59, -1, -1], [51, 60, -1, 58], [-1, 61, -1, 59], [-1, 62, -1, 60], [-1, 63, -1, 61], [55, -1, -1, 62]];

function get_path(robot, start_pos, start_dir, finish_pos) {
	// from[node][dir] - как попали в данную позицию
	// "F" если проездом вперед
	// "R" если поворотом направо
	// "L" если поворотом налево
	// "N" иначе (никак)
	from = [];
	for (var node = 0; node < 64; ++node) {
		from[node] = [];
		for (var dir = 0; dir < 4; ++dir)
			from[node][dir] = "N";
	}
	// Очередь для алгоритма поиска в ширину
	queue = [];
	queue.push([start_pos, start_dir]);
	while (queue.length > 0) { // Пока не перебрали все секции
		var tmp = queue.shift();
		var cur_pos = tmp[0];
		var cur_dir = tmp[1];
		if (cur_pos == finish_pos) { // Если нашли нужную секцию
			finish_dir = cur_dir;
			break;
		}
		// Проезд вперед
		if (adj[cur_pos][cur_dir] != -1) {
			var adj_pos = adj[cur_pos][cur_dir];
			var adj_dir = cur_dir;
			if (from[adj_pos][adj_dir] == "N" && !(includes(robot_pos, adj_pos) && adj_pos != robot_pos[robot])) {
				from[adj_pos][adj_dir] = "F";
				queue.push([adj_pos, adj_dir]);
			}
		}
		// Поворот направо
		if (from[cur_pos][(cur_dir + 1) % 4] == "N") { // Направо
			var adj_pos = cur_pos;
			var adj_dir = (cur_dir + 1) % 4;
			from[adj_pos][adj_dir] = "R";
			queue.push([adj_pos, adj_dir]);
		}
		// Поворот налево
		if (from[cur_pos][(cur_dir + 3) % 4] == "N") { // Налево
			var adj_pos = cur_pos;
			var adj_dir = (cur_dir + 3) % 4;
			from[adj_pos][adj_dir] = "L";
			queue.push([adj_pos, adj_dir]);
		}
	}
	// Восстановление пути
	var path = "";
	if (from[finish_pos][finish_dir] == "N")
		return null;
	else {
		var cur_pos = finish_pos;
		var cur_dir = finish_dir;
		while (cur_pos != start_pos|| cur_dir != start_dir) {
			var action = from[cur_pos][cur_dir];
			if (action == "F") {
				path = "F" + path;
				cur_pos = adj[cur_pos][(cur_dir + 2) % 4];
			} else if (action == "R") {
				path = "R" + path;
				cur_dir = (cur_dir + 3) % 4;
			} else if (action == "L") {
				path = "L" + path;
				cur_dir = (cur_dir + 1) % 4;
			}
		}
	}
	return path;
}

// Возвращает массив путей для каждого робота
// Возвращает ["", "", ""] если не удалось найти
// finish_pos - массив секторов куда должен добраться робот
function get_paths(finish_pos) {

	var result = ["", "", ""];
	var founded = [false, false, false];
	var ok = false;

	// Перебираем все возможные комбинация путей (сначала едет 1ый робот, потом 2ой и 3ий; 1-3-2; и т.д)
	function brute_force(paths) {
		if (founded[0] && founded[1] && founded[2]) {
			result = paths;
			ok = true;
			return;
		}
		for (var i = 0; i < 3; i++)
			if (!founded[i]) {
				var tmp = get_path(i, robot_pos[i], robot_dir[i], finish_pos[i]);
				if (tmp === null)
					continue;
				founded[i] = true;
				var new_paths = paths.slice();
				var old_pos = robot_pos[i];
				robot_pos[i] = finish_pos[i];
				new_paths[i] = new_paths[i] + tmp;
				for (var j = 0; j < 3; j++)
					while (new_paths[j].length < new_paths[i].length)
						new_paths[j] = new_paths[j] + "S";
				brute_force(new_paths);
				robot_pos[i] = old_pos;
				founded[i] = false;
			}
	}

	brute_force(["", "", ""]);

	// Если удалось найти путь
	if (ok)
		return result;

	var positions = [0, 1, 8, 44, 51];

	// Для каждого робота попробовать проехать в позиции, заданные в массиве positions
	for (var robot = 0; robot < 3; robot++) {
		for (var i = 0; i < positions.length; i++) {
			// Попробовать поехать в position[i]
			//console.log("robot=" + robot + " pos=" + positions[i] + " path=" + path);
			var path = get_path(robot, robot_pos[robot], robot_dir[robot], positions[i]);
			if (path) {
				var old_pos = robot_pos[robot];
				var old_dir = robot_dir[robot];
				robot_pos[robot] = positions[i];
				robot_dir[robot] = finish_dir;
				var paths = ["", "", ""];
				paths[robot] = path;
				for (var j = 0; j < 3; j++)
					while (paths[j].length < paths[robot].length)
						paths[j] = paths[j] + "S";
				brute_force(paths);

				robot_pos[robot] = old_pos;
				robot_dir[robot] = old_dir;

				if (ok)
					return result;
			}
		}
	}

	return null;
}

function mazemove(finish_pos){
	if (mailbox.myHullNumber() == 1){
		var paths = get_paths(finish_pos);
		s = "1" + paths[0] + "2" + paths[1] + "3" + paths[2]
		print(s)
		print ("ok")
		for (i = 0; i < paths[0].length; i++){
			if (paths[0][i] == "F"){
				update_positions("F");
				moveForward();
			}
			if (paths[0][i] == "L"){
				update_positions("L");
				turnLeft();
			}
			if (paths[0][i] == "R"){
				update_positions("R");
				turnRight();
			}
			if (paths[0][i] == "S"){

			}

			mailbox.send(2, paths[1][i]);
			while (!mailbox.hasMessages()){
				script.wait(100);
			}
			msg = mailbox.receive();
			if (msg == "ok"){;}
			if (msg != "ok"){break}

			mailbox.send(3, paths[2][i]);
			while (!mailbox.hasMessages()){
				script.wait(100);
			}
			msg = mailbox.receive();
			if (msg == "ok"){;}
			if (msg != "ok"){break}
		}
		mailbox.send(2, "STOP");
		mailbox.send(3, "STOP");
		script.wait(3000);
	}

	if (mailbox.myHullNumber() == 2){
		while (true) {
			while (!mailbox.hasMessages()){
				script.wait(100);
			}
			msg = mailbox.receive()
			if (msg == "S") {
				mailbox.send(1, "ok")
			}
			if (msg == "F") {
				moveForward();
				update_positions("F");
				mailbox.send(1, "ok")
			}
			if (msg == "L") {
				turnLeft();
				update_positions("L");
				mailbox.send(1, "ok")
			}
			if (msg == "R") {
				turnRight();
				update_positions("R");
				mailbox.send(1, "ok")
			};
			if (msg == "STOP"){
				mailbox.send(1, "ok")
				break;
			}

		}

	}


	if (mailbox.myHullNumber() == 3){
		while (true) {
			while (!mailbox.hasMessages()){
				script.wait(100);
			}
			msg = mailbox.receive()
			if (msg == "S") {
				mailbox.send(1, "ok")
			}
			if (msg == "F") {
				moveForward();
				update_positions("F");
				mailbox.send(1, "ok")
			}
			if (msg == "L") {
				turnLeft();
				update_positions("L");
				mailbox.send(1, "ok")
			}
			if (msg == "R") {
				turnRight();
				update_positions("R");
				mailbox.send(1, "ok")
			};
			if (msg == "STOP"){
				mailbox.send(1, "ok")
				break;
			}

		}

	}
}
var servicecenter1 = [2, 1, 3]
var servicecenter2 = [2, 5, 3]
var servicecenter3 = [5, 2, 1]
function get_cell(x, y){
    return 8 * y + x
}
function get_coord(cell){
    return [cell % 8, Math.floor(cell / 8)]
}
var main = function() {
	//script.wait(5000);
	robot_pos = [0, 0, 0];
	robor_dir = [0, 0, 0];
	var finish_pos = [0, 0, 0];
	finish_pos[0] = get_cell(servicecenter1[0],servicecenter1[1])
	finish_pos[1] = get_cell(servicecenter2[0],servicecenter2[1])
	finish_pos[2] = get_cell(servicecenter3[0],servicecenter3[1])
	var finish_dir = [0, 0, 0];
	finish_dir = [servicecenter1[2],servicecenter2[2],servicecenter3[2]]
	var finish_dir1 = finish_dir[0]
	localization()
	x = robot1_pos % 8 //координата x робота
	y = parseInt(robot1_pos / 8,10) //координата у робота
	brick.display().addLabel("("+x+";"+y+")",1,1) //вывод ответа
	brick.display().redraw()
	brick.playTone(1000, 50);
	wait(10000);
	if (mailbox.myHullNumber() == 1){
		var ready1 = true;
		var ready2 = false;
		var ready3 = false;
		robot_pos[0] = robot1_pos
		robot_dir[0] = robot1_dir
		while(!(ready1 && ready2 && ready3)){
			while(!mailbox.hasMessages())script.wait(100)
			var msg = mailbox.receive()
			var data = msg.split(",")
			var msghull = data[0]
			var msgcoords = data[1].split(" ")
			if (msghull == "2"){
				ready2 = true;
				robot_pos[1] = msgcoords[0];
				robot_dir[1] = msgcoords[1];
				}
			if (msghull == "3"){
				ready3 = true;
				robot_pos[2] = msgcoords[0];
				robot_dir[2] = msgcoords[1];
			}
		}
		finish_dir1 = finish_dir[0]
		mailbox.send(2, "go " + finish_dir[1])
		mailbox.send(3, "go " + finish_dir[2])
	}
	if (mailbox.myHullNumber() == 2){
		while(!mailbox.hasMessages()){
			mailbox.send(1, "2,"+robot1_pos+" "+robot1_dir)
			script.wait(100);
		}
		var msg = mailbox.receive();
		var msgdata = msg.split(" ")
		finish_dir1 = parseInt(msgdata[1])
	}
	if (mailbox.myHullNumber() == 3){
		while(!mailbox.hasMessages()){
			mailbox.send(1, "3,"+robot1_pos+" "+robot1_dir)
			script.wait(100);
		}
		var msg = mailbox.receive();
		var msgdata = msg.split(" ")
		finish_dir1 = parseInt(msgdata[1])
	}
	mazemove(finish_pos)
	switch(robot1_dir){
		default:
			break;
		case 0:
			if (finish_dir1 == 0){

			}
			if (finish_dir1 == 1){
				update_positions("R");
				turnRight();
			}
			if (finish_dir1 == 2){
				update_positions("R");
				turnRight();
				update_positions("R");
				turnRight();
			}
			if (finish_dir1 == 3){
				update_positions("L");
				turnLeft();
			}
			break;
		case 1:
			if (finish_dir1 == 0){
				update_positions("L");
				turnLeft();
			}
			if (finish_dir1 == 1){

			}
			if (finish_dir1 == 2){
				update_positions("R");
				turnRight();
			}
			if (finish_dir1 == 3){
				update_positions("R");
				turnRight();
				update_positions("R");
				turnRight();
			}
			break;
		case 2:
			if (finish_dir1 == 0){
				update_positions("R");
				turnRight();
				update_positions("R");
				turnRight();
			}
			if (finish_dir1 == 1){
				update_positions("L");
				turnRight();
			}
			if (finish_dir1 == 2){

			}
			if (finish_dir1 == 3){
				update_positions("R");
				turnLeft();
			}
			break;
		case 3:
			if (finish_dir1 == 0){
				update_positions("R");
				turnRight();
			}
			if (finish_dir1 == 1){
				update_positions("R");
				turnRight();
				update_positions("R");
				turnRight();
			}
			if (finish_dir1 == 2){
				update_positions("L");
				turnRight();
			}
			if (finish_dir1 == 3){

			}
			break;
	}
	var tagresults = recartag()
	finish_pos = [-1, -1, -1]
	finish_pos[tagresults[2]] = get_cell(tagresults[0], tagresults[1])
	if(mailbox.mailbox.myHullNumber() != 1){
		while (!mailbox.hasMessages()){
			mailbox.send(1, tagresults[0] + " " + tagresults[1] + " " + tagresults[2])
			script.wait(100);
		}
	}
	else{
		while(!(finish_pos[0] > -1 && finish_pos[1] > -1 && finish_pos[2] > -1)){
			while (!mailbox.hasMessages()){
				script.wait(100);
			}
			var msg = mailbox.receive();
			var msgdata = msg.split(" ")
			finish_pos[parseInt(msgdata[2]) - 1] = get_cell(parseInt(msgdata[0]),parseInt(msgdata[1]))
		}
		mailbox.send("go finish")
	}
	mazemove(finish_pos)
	brick.display().addLabel("finish",1,1)
	brick.display().redraw()
	script.wait(10)
	// TODO: Вывести массив путей paths
}