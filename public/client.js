// shorthand for $(document).ready(...)


$(function() {
    var socket = io();

    var username = "";

    socket.emit('load');

    socket.on('name',function(data){
  	   username = data.username
       $('#username').text("Your username name is: " + username);
    });

    socket.emit('group');
    socket.on('group',function(data){

      $('#members').empty();

      $.each(data, function(i,item){
        $('#members').append($('<li>').text(data[i].username));
      })
      
    });


    $('form').submit(function(){


    	socket.emit('chat', {'name' : username.toString() , 'msg' : $('#m').val()});
    	$('#m').val('');
    	return false;


    });



    socket.on('chat', function(data){
      $('#messages').append($('<li>').text(data.time + ' ' + data.username + ": "+ data.msg));
    });

    socket.on('disconnect',function(){
      socket.emit('disconnect',{'username': username});
    });

});
