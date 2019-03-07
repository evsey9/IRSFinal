var __interpretation_started_timestamp__;

var pi = 3.1415926535897931;

var azimut = 0;
var direction = 0; // absolute angle of direction movement
var directionOld = 0;

mL = brick.motor("M2").setPower;

mR = brick.motor("M1").setPower;

eL = brick.encoder("E2").read;

eR = brick.encoder("E1").read;

sF = brick.sensor('D1').read;

sL = brick.sensor('A2').read;

var __interpretation_started_timestamp__;
var pi = 3.1415926535897931;
var b;
var xsize = 160
var ysize = 120
var arcells = 6
var n = 0;


var t = 0;


function turnDirection(_angle, _v){
	brick.playTone(2000, 50);
	
	azimut = _angle;
 //toMGrad
	var _vel = _v == undefined ? 10 : _v;
	var angleOfRotate = _angle + direction;
	var sgn = angleOfRotate == 0 ? 0 :
	angleOfRotate/Math.abs(angleOfRotate);
	motors(_v*sgn, -_v*sgn)
	//brick.display().addLabel("TURNING "+_angle, 1, 40)
	//brick.display().redraw()
	var path = pi*robot.track/4 - 0.25
	var cpath = cm_to_cpr(path)
	print(cpath)
	brick.encoder("E1").reset()
	brick.encoder("E2").reset()
	print(_angle)
	if (_angle < 0){
		motors(0,100)
		while(eR() < 560) script.wait(5)
		}
	else{
		motors(100,0)
		while(eL() < 560) script.wait(5)
		
	}
	brick.motor(M1).setPower(-100);
	brick.motor(M2).setPower(-100);
	brick.encoder("E1").reset()
	brick.encoder("E2").reset()
	while (!(brick.encoder(E1).read() < -360)) {
		script.wait(10);
	}
	
	//brick.display().clear()
	brick.motor("M1").brake();
	brick.motor("M2").brake();
	script.wait(200);
}

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
	if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
		return false
	}
	denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
	if (denominator === 0) {
		return false
	}
	var ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
	var ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
		return false
	}
	var x = x1 + ua * (x2 - x1)
	var y = y1 + ua * (y2 - y1)
	return [x, y];
}

function arTAG(photo)
{
	__interpretation_started_timestamp__ = Date.now();
	b = photo
	var c = listToMatrix(b[0].split(','),xsize)
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
	while (garray[y][x] != 1){
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
	var x = xsize-1;
	var y = 0;
	var l = 0;
	while (garray[y][x] != 1){
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
	var x = 0;
	var y = ysize - 1;
	var l = 0;
	while (garray[y][x] != 1){
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
	var x = xsize - 1;
	var y = ysize - 1;
	var l = 0;
	while (garray[y][x] != 1){
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
	}
	for (var i = 0; i < artag.length; i++){
	}
	if (artag[0][0] == 0){
		for (var i = 0; i < artag.length; i++){
			artag[i].reverse();
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
		}
		newArray.reverse();
		artag = newArray;
	}
	else if (artag[0][3] == 0){ 
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
	for (var i = 0; i < artag.length; i++){
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
	return xnum + " " + ynum + " " + nnum;
}


robot = {

	wheelD: 5.6,

	track:17.5,

	cpr: 360,

	v: 60,
	
	to_ik: 9,
	to_ik2: 11
	}

var cell_size = 70
var ik_cell = cell_size - robot.to_ik

function cm_to_cpr(cm){ return (cm/(pi*robot.wheelD)) * robot.cpr; }



function motors(vL, vR)

{

		vL = vL == undefined ? robot.v : vL;

		vR = vR == undefined ? vL : vR;

		mL(vL);

		mR(vR);

}

function eht(cm,v)

{
	
		brick.encoder("E2").reset();

		brick.encoder("E1").reset();

		v = v == undefined ? robot.v : v;

		var path0 = eL();
		path0 = 0
		var pth = cm_to_cpr(cm) + path0;

		var v0 = 30, vM = v0;

		var startStop = pth/4;

		var dV = (v-v0)/10

		var ang = brick.gyroscope().read()[6] / 1000
	
		drf = 0
	
		var L = 33 // расстояние до стены (идеал)
		var d = 0 // расстояние до стены(реал)
		var d1 = 0 // расстояние до стены справа
		var fl = false
		while (eL() < pth)

			{
				left = brick.sensor("A1").read();
				right = brick.sensor("A2").read();
				front = brick.sensor("D1").read();
				
				
				
				if (2<left && left < 50)
					{
							d = left
					}
				else{
					d = L
					}
				if (2<right && right < 50)
					{
							d1 = right
					}
				else{
					d1 = L
					}
				er3 = ((L - d) - (L - d1))
				//ang += er3 / 10
				print("el: "+-eL() + " startStop: "+startStop)
					if (eL() < path0 + startStop) {vM += dV;}

				else if (eL() > path0 + startStop * 3) { vM -= dV }

				er1 = ang - (brick.gyroscope().read()[6] / 1000) ;
				
				if ( Math.abs(er1) > 340 ) { er1 = 360 - Math.abs(er1); }

				er2 = eR() - eL();
				
				
				/*if (d < 25 && Math.abs(d - L) > 1){
				//ang = brick.gyroscope().read()[6] / 1000
				er3 = (L-d) > 0 ? 15 : -15
				er1 = 0
				er2 = 0}
				else {er3 = 0;}*/
				if (d > 5000){
				
					fl = true;
					print("FLAGGED WITH SENS "+d)
					}
				er2 = 0;
				//er3 = ((L - d) - (L - d1))
				//ang += er3 / 10
					
				uV = er1;
				//brick.display().addLabel("er3: "+er3 + " uV: "+uV, 1, 60)
				print("er3: "+er3 + " uV: "+uV)
				motors(100, 100)
				//if(front <= cell_size / 2 - robot.to_ik2) break;
				script.wait(10);

			}
brick.motor("M1").brake(500);
brick.motor("M2").brake(500);
motors(0, 0);
return fl;
}




	


function l_wall(pt)
{
	var p0 = 0;
	var p1 = 0;
	var p = 0;
	var el = 0;
	var ep = 0;
	var d = 0;
	var L = cell_size / 2 - robot.to_ik;
	brick.encoder("E2").reset();
	brick.encoder("E1").reset();
	var pth = cm_to_cpr(pt)
	while(-eL() < pth)
		{
				el = eL()
				er = eR()
				d0 = brick.sensor("A1").read();
				if (2<d0 && d0 < 100)
					{
							d = d0
					}
				p = (d-L)/10
				if (brick.sensor("A1").read() >= 25){
					p = 0
					}
				if(brick.sensor("A2").read() <= cell_size / 2 - robot.to_ik2 + 5) break;
				p0 += -20-p*2
				p1 += -20+p*2
				motors(-(p0-el)*3, -(p1-er)*3 );
				brick.display().addLabel("A1: " + d0 + " A2: "+ brick.sensor("A2").read(), 1, 1);
				brick.display().redraw()
				script.wait(10)		
				}
	
	
}

function l_hand()
{
	var left = brick.sensor("A1").read();
	var front = brick.sensor("D1").read();
	var flag = false
	while(true)
		{
			left = brick.sensor("A1").read();
			front = brick.sensor("D1").read();
			//brick.display().addLabel("CALL A1: " + brick.sensor("A1").read() + " A2: "+ brick.sensor("A2").read() + " D1: "+ brick.sensor("D1").read(), 1, 1);
			print("CHECK")
			//brick.display().redraw()
			print(front);
			//brick.playTone(500, 50);
			if (flag){
				flag = false;
				turnDirection(90, 40); print("TURN LEFT FLAG")
				eht(cell_size)
				}
			else{
				if (left > cell_size ) {print("TURN LEFT"); turnDirection(90, 40);  flag = eht(cell_size); print("MOVE CELL");}
			else if (left < cell_size / 2 + 10 && front < cell_size / 2 + 10) {print("TURN RIGHT"); turnDirection(-90, 40); }
			//eht(20);
			else {flag = eht(cell_size); print("MOVE CELL");} //l_wall(cell_size)
		}
			script.wait(500)
			//a2 = brick.sensor("A2").read()
			//a1 = brick.sensor("A1").read();
		}
	}

var main = function()

{
	
	__interpretation_started_timestamp__ = Date.now();
	var calibValues = [-207, -73, -81, -148, 31, 3977]
	//brick.gyroscope().setCalibrationValues(calibValues)
	/*while(true){
		brick.display().addLabel("D1: "+brick.sensor("D1").read(), 1, 60)
		brick.display().addLabel("A1: "+brick.sensor("A1").read(), 1, 1)
		brick.display().addLabel("A2: "+brick.sensor("A2").read(), 1, 20)
		brick.display().addLabel("A3: "+brick.sensor("A3").read(), 1, 40)
		brick.display().addLabel("A4: "+brick.sensor("A4").read(), 1, 60)
		brick.display().addLabel("A5: "+brick.sensor("A5").read(), 1, 80)
		brick.display().addLabel("A6: "+brick.sensor("A6").read(), 1, 100)
		brick.display().redraw()
		script.wait(5)
		}*/
	//print(brick.gyroscope().getCalibrationValues())
	//brick.playTone(1000, 50);
	//script.wait(5000);
	//turnDirection(-90,50)
	//turnDirection(90,50)
	//script.wait(2000);
	//script.wait(20000)
	l_hand();
	//eht(cell_size);
	//script.wait(5000);
	l_wall(280);
	turnDirection(-90, 40);
	l_wall(120);
	turnDirection(-90, 40);
	l_wall(200);
	turnDirection(90, 40);
	l_wall(80);
	turnDirection(-90, 40);
	l_wall(80);
	turnDirection(-90, 40);
	l_wall(200);
	//print(typeof(getPhoto()))
	//brick.configure("video2", "lineSensor");
	//brick.lineSensor("video2").init(true);
	//while (!brick.keys().wasPressed(KeysEnum.Up)){script.wait(100);}
	//print(arTAG(getPhoto()));

	return;

}