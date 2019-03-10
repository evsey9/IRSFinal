var __interpretation_started_timestamp__;
var pi = 3.1415926535897931;
// adj[i][j] содержит номер сектора, который находится по направлению 0 <= j <= 3 от i-ой сектора
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
	b = script.readAll("input.txt");
	var c = listToMatrix(b[1].split(','),xsize)

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
		//print(artag[i]);
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
	//while(b != '1'){ script.wait(10);};
	return [xnum, ynum, nnum];
}

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
function block(cell)
{
	lab[cell - 1] = []
	for(var i = 0; i < 64; i += 1){
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
	var i = 0;
	var j = 0;

	var text = script.readAll("input.txt")
	print(text[0])
	var olab = lab
	var startcoord = get_cell(parseInt((text[0].split(" "))[0]),parseInt((text[0].split(" "))[1]))
	var tagresults = recartag()
	print(tagresults)
	print(startcoord)
	var finalcoord = get_cell(tagresults[0], tagresults[1])
	var startdir = parseInt((text[0].split(" "))[2]) + 1
	var bseq = bfs(startcoord,finalcoord)
	var seq = make_sequence(bseq, startdir, startcoord)
	//print(finalcoord)
	//Problematic spots: 45, 52, 56, 63, 2, 5
	/*if (startcoord != 52 && finalcoord != 52 && startcoord != 45 && finalcoord != 45 && false){
		lab = olab
		block(45)
		block(52)
		var seqn = make_sequence(bfs(startcoord,finalcoord), startdir, startcoord)
		lab = olab
		if (seqn.length < seq.length) seq = seqn
		}*/
	if (startcoord != 52 && finalcoord != 52 ){
		//lab = olab
		block(52)
		bseq1 = bfs(startcoord,finalcoord)
		var seqn = make_sequence(bseq1, startdir, startcoord)
		//lab = olab
		if (seqn.length < seq.length) { seq = seqn; bseq = bseq1 }
		}
	if (startcoord != 45 && finalcoord != 45){
		//lab = olab
		block(45)
		bseq1 = bfs(startcoord,finalcoord)
		var seqn = make_sequence(bseq1, startdir, startcoord)
		//lab = olab
		if (seqn.length < seq.length){ seq = seqn; bseq = bseq1 }
		}
	if (bseq.indexOf(18) != -1 && startcoord != 18 && finalcoord != 18){
		var olab1 = lab
		block(18)
		bseq1 = bfs(startcoord,finalcoord)
		var seqn = make_sequence(bseq1, startdir, startcoord)
		/*lab = olab1
		if (seqn.length < seq.length) seq = seqn
		block(47)
		var seqn = make_sequence(bfs(startcoord,finalcoord), startdir, startcoord)
		lab = olab1*/
		if (seqn.length < seq.length){ seq = seqn; bseq = bseq1 }
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
	brick.display().addLabel("finish",1,1)
	brick.display().redraw()
	script.wait(5000)
}
var main = function() {
	brick.gyroscope().calibrate(2000); //калибровка гироскопа
	script.wait(2050)

	moveSmall() // небольшой проезд, чтобы встать по центру
	maze_move()
}