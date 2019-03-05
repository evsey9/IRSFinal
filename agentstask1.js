var __interpretation_started_timestamp__;
var pi = 3.1415926535897931;
robot = {
	wheelD: 8.0,
	track: 20,
	cpr: 360,
	v: 50
	}
var x;
	var b;

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


	b = getPhoto();
	print(b)
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

		//print(garray[i])

	}

	/*for (var i = 0; i < ysize; i++){

		for (var j = 0; j < 5; j++){

			garray[i][j] = 0

		}

	}*/

	var x = 0;

	var y = 0;

	var l = 0;

	var ULcorner = [0, 0];

	var URcorner = [0, 0];

	var DLcorner = [0, 0];

	var DRcorner = [0, 0];

	////print("ULCORNER");

	////print(garray.length);






	try{
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


			var cxU = onevecUP[0] * j + onevecUP[0] / 2;

			var cyU = onevecUP[1] * i;

			var cxD = onevecDOWN[0] * j + onevecDOWN[0] / 2 + dirvecLEFT[0];

			var cyD = onevecDOWN[1] * i + dirvecLEFT[1];

			var cxL = onevecLEFT[0] * j;

			var cyL = onevecLEFT[1] * i + onevecLEFT[1] / 2;

			var cxR = onevecRIGHT[0] * j + dirvecUP[0];

			var cyR = onevecRIGHT[1] * i + onevecRIGHT[1] / 2 + dirvecUP[1];

			var vec = intersect(cxU, cyU, cxD, cyD, cxL, cyL, cxR, cyR);


			artag[i - 1][j - 1] = garray[ULcorner[1] + Math.round(vec[1])][ULcorner[0] + Math.round(vec[0])];

		}

		//print("NEW ROW");

	}





	

	for (var i = 0; i < artag.length; i++){

		//print(artag[i]);

	}

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

	brick.display().addLabel(xnum + " " + ynum + " " + nnum, 1, 1);
	brick.display().redraw();
	return [xnum, ynum, nnum];
	}
	catch(e){
		return false;
	}
	//while(b != '1'){ script.wait(10);};

	return;

}
var readGyro = brick.gyroscope().read
mL	=	brick.motor('M1').setPower   // левый мотор
mR	=	brick.motor('M2').setPower   // правый мотор
eL	=	brick.encoder('E1').read	 // левый энкодер
eR	=	brick.encoder('E2').read 	 // правый энкодер
sF	=	brick.sensor('D1').read	 // сенсор спереди (УЗ)
sL	=	brick.sensor('A2').read	 // сенсор справа (ИК)
pi 	=	Math.PI
abs =	Math.abs
wait = script.wait

var led = brick.led();





//моторы



//сенсоры ИК

sA1 = brick.sensor(A1).readRawData;

sA2 = brick.sensor(A2).readRawData;

sA3 = brick.sensor(A3).readRawData;

//энкодеры

var eLeft = brick.encoder(E1);

var eRight = brick.encoder(E2);

//длина клетки

var cellLength = 40 * robot.cpr / (pi * robot.wheelD);

var direction = 0; // absolute angle of direction movement

var directionOld = 0;

var azimut = 0; // we should go on azimut or turn to it

var ex = 0;

var ey = 0;

var encLeftOld = 0;

var encRightOld = 0;

var encLeft = 0;

var encRight = 0;

var n = 0;

var t = 0;
function readYaw() { return -readGyro()[6]; }

function angle() {

    var sgn = 0;

    var _direction = readYaw(); // mgrad

    var dtDirection = _direction - directionOld;

    sgn = directionOld == 0 ? 0 :

        directionOld / Math.abs(directionOld);

    n += sgn * Math.floor(Math.abs(dtDirection / 320000));

    direction = _direction + n * 360000;

    directionOld = _direction;

}
function printGyro() {

    print("direction=" + direction);

}


function turnDirection(_angle, _v) {

    _angle = azimut + _angle;

    azimut = _angle;

    _angle = _angle * 1000; //toMGrad

    var _vel = _v == undefined ? 10 : _v;

    var angleOfRotate = _angle - direction;

    var sgn = angleOfRotate == 0 ? 0 :

        angleOfRotate / Math.abs(angleOfRotate);

    mL(_vel * sgn);

    mR(-_vel * sgn);

    while (Math.abs(angleOfRotate = _angle + direction) > 8000) {

        script.wait(50);

    }

    brick.motor(M1).brake(500);

    brick.motor(M2).brake(500);

    script.wait(500);

}
robot = {
	wheelD: 8.0,
	track: 20,
	cpr: 360,
	v: 50
	
	}

function cm2cpr(cm){return(cm / (pi * robot.wheelD)) * robot.cpr}
function motors(vL, vR){
	vL = vL == undefined ? robot.v : vL
	vR = vR == undefined ? vL : vR
	mL(vL)
	mR(vR)
}
function straightpid(cm){
	var power = 70;
	var path = cm2cpr(cm)
	var kp = 1;
	var kd = 10;
	var ki = 0.01;
	motors()
	brick.encoder("E1").reset();
	brick.encoder("E2").reset();
	var ang = readYaw()/1000;
	var deltaOld = 0;
	var P
	var D
	var I
	var delta
	while (-eL() < path) { 
		var a = readYaw()/1000;
		print("ang " + ang)
		print("a " + a)
		delta = (ang - a)
		P = delta * kp
		D = (delta - deltaOld) * kd
		I += delta * kI
		print("delta " + delta)
		motors(power+(P+D+I), power-(P+D+I))
		deltaOld = delta;
		wait(10) }
	brick.motor("M1").brake(500);
	brick.motor("M2").brake(500);
	motors(0)
}
function straight(cm,power){
	var path = cm2cpr(cm)
	var kp = 3;
	var startStop = path / 4
	var v0 = 30;
	var vM = 30;
	//var power = power == undefined ? robot.v : power;
	var dV = (power - v0) / 10
	//motors()
	brick.encoder("E1").reset();
	brick.encoder("E2").reset();
	var ang = readYaw()/1000;
	while (-eL() < path) { 
		var a = readYaw()/1000;
		print("ang " + ang)
		print("a " + a)
		print("vm " + vM)
		var delta = (ang - a) * kp
		if (-eL() < startStop) vM += dV
		else if (-eL() > startStop * 3) vM -= dV
		print("delta " + delta)
		motors(power - delta, power + delta)
		wait(100) }
	brick.motor("M1").brake(500);
	brick.motor("M2").brake(500);
	motors(0)
}

function turnr(speed, deg){
	var expected = 0;
	brick.encoder("E1").reset();
	brick.encoder("E2").reset();
	var ld = -eL();
	var rd = -eR();
	var a = readYaw()/1000;
	while((readYaw()/1000 - a) > deg){
		ld = -eL();
		rd = -eR();
		print("yaw "+readYaw()/1000)
		
		expected += speed;
		motors(speed, -speed)
		script.wait(10);
	
		}
	brick.motor("M1").brake(500);
	brick.motor("M2").brake(500);
	motors(0)
	
}
function turnl(speed, deg){
	var expected = 0;
	brick.encoder("E1").reset();
	brick.encoder("E2").reset();
	var ld = -eL();
	var rd = -eR();
	var a = readYaw()/1000;
	print(a)
	while((readYaw()/1000 - a) < deg){
		ld = -eL();
		rd = -eR();
		print("yaw "+readYaw()/1000)
		print("a-" + (a - readYaw()/1000))
		expected += speed;
		motors(-speed, speed)
		script.wait(10);
	
		}
	brick.motor("M1").brake(500);
	brick.motor("M2").brake(500);
	motors(0)
	
}
function messages(){
	if(mailbox.hasMessages()){
		var msg = mailbox.receive();
		brick.display().addLabel(msg,10,10);
		brick.display().redraw();
		script.wait(100);
		}
}
var main = function()
{
	__interpretation_started_timestamp__ = Date.now();
	print("gyro initialaize...");
	//brick.configure("video2", "lineSensor");
    //brick.lineSensor("video2").init(true);
    //while (!brick.keys().wasPressed(KeysEnum.Up))         
    //script.wait(100);
	
	//recartag();
	brick.gyroscope().calibrate(14000);
	script.wait(15000);
	var ptimer = script.timer(300);

ptimer.timeout.connect(printGyro);
var mtimer = script.timer(50);

mtimer.timeout.connect(angle);
	mailbox.connect("192.168.77.1");
	print(mailbox.myHullNumber());
	//var pager = script.timer(20);
	//pager.timeout.connect(this, function() {messages() });
	//pager.start();
	print(mailbox.myHullNumber() + "HN");
	/*if(mailbox.myHullNumber() == 1) mailbox.send(2, "1");
	while(true){
		//mailbox.send("helloworld "+script.random(0,100000)+" "+mailbox.myHullNumber());
		if (mailbox.hasMessages()){
		
		var msg = mailbox.receive();
		print("rec "+msg);
			switch(mailbox.myHullNumber()){
		case 1:
			mailbox.send(2, parseInt(msg)+1)
			break;
		case 2:
			mailbox.send(3, parseInt(msg))
			break;
		case 3:
			mailbox.send(1, parseInt(msg))
			break;
		default:
			break;
		}
		brick.display().addLabel(msg, 10,10);
		brick.display().redraw();
		}
		script.wait(5);
		
		//brick.motor(M3).setPower(script.random(-100, 100));
		//brick.motor(M4).setPower(script.random(-100, 100));
		}*/
		//turnright(90);
		//turnr(50,180);
		//turnl(50,90);
		turnDirection(90, 50);
		
		//straight(300,70);
	
	return;
}
