var __interpretation_started_timestamp__;
var pi = 3.1415926535897931;

var x;
function messages(){
	if(mailbox.hasMessages()){
		var msg = mailbox.receive();
		var msgr = msg.split();
		msgr = msgr[0].split(" ")
		//print(msgr[0].split(" "));
		msg = msgr[1] + " " + msgr[2] + " " + msgr[3]
		brick.display().addLabel(msg,1,20*(parseInt(msgr[0]) - 1) + 1);
		brick.display().redraw();
		
		//script.wait(100);
		}
}
var main = function()
{
	__interpretation_started_timestamp__ = Date.now();
	
	brick.motor(M1).setPower(0);
	brick.motor(M2).setPower(0);
	mailbox.connect("192.168.77.1");
	print(mailbox.myHullNumber());
	var pager = script.timer(20);
	pager.timeout.connect(this, function() {messages() });
	pager.start();
	while(true){
		var left = brick.sensor("A1").read() > 20 ? 0 : 1;
		var right = brick.sensor("A2").read() > 20 ? 0 : 1;
		var front = brick.sensor("D1").read() > 20 ? 0 : 1;
		if(mailbox.myHullNumber() == 1){
			brick.display().addLabel(left + " " + front + " " + right, 1, 1)
			brick.display().redraw()
			}
		mailbox.send(mailbox.myHullNumber() + " " + left + " " + front + " " + right);
		
		script.wait(250);
		
		//brick.motor(M3).setPower(script.random(-100, 100));
		//brick.motor(M4).setPower(script.random(-100, 100));
		}
	
	return;
}
