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
    [46,62],
    [],
    [48,64],
    [49],
    [],
    [51,60],
    [59,61,52],
    [60,62],
    [61,54,63],
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

    while (curr != 1){

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
	print(coord)

    var finalcoord = get_coord(path[path.length - 1])
	print("FINAL: "+finalcoord)
    while (!(coord[0] == finalcoord[0] && coord[1] == finalcoord[1])){
		print("COORD: "+coord)
		print("DIR: "+cdir)
		print(coord == finalcoord)
        var nextcoord = get_coord(path[i])
        if (nextcoord[0] - coord[0] == 1){ //go right
			print("RIGHT")
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
		script.wait(250)
    }
	return spath;
}

var main = function()
{
	__interpretation_started_timestamp__ = Date.now();
	var startcoord = get_cell(0,0)
	var finalcoord = get_cell(1,0)
	var startdir = 4
	print(bfs(startcoord,finalcoord));
    print(make_sequence(bfs(startcoord,finalcoord), startdir, startcoord))

	return;
}
