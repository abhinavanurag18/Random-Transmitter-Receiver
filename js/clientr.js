$(document).ready(function(e){
	// alert("hii");
	var maximum = 100;
	var minimum = 1;
	var randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
	var username = "User "+randomnumber;
	var ntId = randomnumber;
	var message1 = {name : username, networkId : ntId, colorValue : {stroke : "#5E008C", fill : "#FF8F00"}};
	var message2 = {type : 2, activityId : "org.sugarlabs.ChatPrototype"};
	var groupId = null;
	var msgInit = 0;
	var msgListUsers = 1;
	var msgCreateSharedActivity = 2;
	var msgListSharedActivities = 3;
	var msgJoinSharedActivity = 4;
	var msgLeaveSharedActivity = 5;
	var msgOnConnectionClosed = 6;
	var msgOnSharedActivityUserChanged = 7;
	var msgSendMessage = 8;


	var socket = new WebSocket("ws://localhost:8039");
	socket.onopen = function(){
		alert("Connected to the server");
		
		socket.send(JSON.stringify(message1));
		// socket.send(JSON.stringify(message2));
		// alert(socket.readyState);
	};

	

	socket.onmessage = function(evt){
		var res = JSON.parse(evt.data);
		// var i;
		// for(i in res){
		// 	alert(i + " " + res[i]);
		// }
		if(res.d == "d"){
			var message2 = {type : 2, activityId : "org.sugarlabs.ChatPrototype"};
			socket.send(JSON.stringify(message2));
		}
		if(res.type == 2){
			groupId = res.data;
			$('#grpId').html("<strong> Username : "+username+" &nbsp;&nbsp;Shared Activity ID : "+groupId+"</strong>");
		}

		if(res.type == msgSendMessage){
			// alert(res.data.content);
			$('.messages').append("<h4>"+res.data.user.name+" : "+res.data.content+"</h4><br />");
		}
		if(res.type == msgListSharedActivities){
			var j,k;
			$('.listGrps').html("");
			for(j in res.data){
				$('.listGrps').append("<button class='group' id='"+res.data[j].id+"'>"+res.data[j].id+"</button><br />");				
			}
			$('.group').on('click',groupClick);
			// alert("listing shared activities : " +res.data.length);
		}

		if(res.type == msgJoinSharedActivity){
			// var i;
			// // var groupId = null;
			// for(i in res.data){
			// 	alert(i + " " + res.data[i]);
			// }
			groupId = res.data.id;
			$('#grpId').html("<strong> Username : "+username+" &nbsp;&nbsp;Shared Activity ID : "+groupId+"</strong>");
		}
		
	}

	socket.onclose = function(con){
		alert("Disconnected from the server");
	}

	$('#sendMsg').click(function(e){
		var data = $('#msgTxt').val();
		// alert(data);
		var msg3 = {type : 8, group : groupId, data : {user : message1 , content : data}};
		socket.send(JSON.stringify(msg3));
	});

	$('#showGrps').click(function(e){
		socket.send(JSON.stringify({type : msgListSharedActivities}));
	});

	var groupClick = function(e){
		e.preventDefault();
		// alert("hi");
		var group = $(this).attr('id');
		// alert(group);
		var msg = {type : msgJoinSharedActivity, group : group};
		socket.send(JSON.stringify(msg));
	}

	



	
});