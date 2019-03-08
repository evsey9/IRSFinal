<<<<<<< HEAD
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


function get_cell(x,y){ return 8 * (y) + x + 1}
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



				i_d = 0;



				break



			case -1:



				i_d = 1;



				break;



			case -8:



				i_d = 2;



				break;



			case 1:



				i_d = 3;



				break;



			}	

		dela = (i_d - dir)*90;

		dela = min(Math.abs(dela), Math.abs(360 - dela));

		dela *= (i_d-dir)/Math.abs(i_d-dir);

		rotate(dela);

		

		eht(80);

		return [targ,i_d];

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



var main = function()



{

	__interpretation_started_timestamp__ = Date.now();

	coord = 1;

	targ = 3;

	dir = 1;

	while (coord != targ)

		{

			qde = bfs(coord, targ);

			tmp = dv_per(dir, qde[0], coord);

			coord = tmp[0];

			dir = tmp[1]

			}

	return;

}





		}











=======
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





var main = function()

{

	__interpretation_started_timestamp__ = Date.now();



	print(bfs(1,57));

	

	return;

}





>>>>>>> parent of 9776b35... ghgfhddr
