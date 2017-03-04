// shorthand for $(document).ready(...)


$(function() {
    var socket = io();

    var username = "";

    socket.emit('name');
    socket.on('name',function(data){
  	   username = data.username
       $('#username').text("Your username name is: " + username);
    });

    socket.emit('group');
    socket.on('group',function(data){
      $('#members').append($('<li>').text(data[0].username));
    });


    $('form').submit(function(){
    	socket.emit('chat', {'name' : username.toString() , 'msg' : $('#m').val()});
    	$('#m').val('');
    	return false;
    });



    socket.on('chat', function(data){
      $('#messages').append($('<li>').text(data.time + ' ' + data.username + ": "+ data.msg));
    });

});
