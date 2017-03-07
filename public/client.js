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

      var txt = $('#m').val();
      let cmd1 = "/nick ";
      let cmd2 = "/nickcolor ";

      if(txt.charAt(0) === '/'){

        var iscmd1 = true;
        var iscmd2 = true;

        for(var i = 0; i < cmd1.length; i++){
          if(txt.charAt(i) !== cmd1.charAt(i)){
            iscmd1 = false;
            break;
          }
        }

        for(var i = 0; i < cmd2.length; i++){
          if(txt.charAt(i) !== cmd2.charAt(i)){
            iscmd2 = false;
            break;
          }
        }

        if(iscmd1){

          var res = txt.slice(cmd1.length,(txt.length));
          console.log(res);
          socket.emit('updateUsername',{'newName': res});
          $('#m').val('');
          return false;
        }

        if(iscmd2){

          var res = txt.slice(cmd2.length,(txt.length));
          socket.emit('updateColor',{'newColor': res});
          $('#m').val('');
          return false;
        }

      }

      
      socket.emit('chat', {'name' : username.toString() , 'msg' : $('#m').val()});
      $('#m').val('');
      return false;

    });

    socket.on('alert',function(data){
      alert(data.msg);
    });



    socket.on('chat', function(data){
      if(data.color !== null){

        var styles = "color:" + data.color + ';'; 
        if(username !== data/username){
          styles += "font-weight: bold;";
        }
        var span = "<span style=" + '"' + styles + '"' + '>'+ data.username + "</span>";
        var toAppend = data.time + ' ' + span + ' ' + ": " + data.msg;
        toAppend = "<li>" + toAppend + "</li>";
        $('#messages').append(toAppend);

      }
      else{
        (username === data.username) ? $('#messages').append($('<li>').text(data.time + ' ' + data.username + ": "+ data.msg)) : $('#messages').append($('<li>').text(data.time + ' ' + data.username + ": "+ data.msg).css('font-weight','bold'));
      }
      
    });

    socket.on('disconnect',function(){
      socket.emit('disconnect',{'username': username});
    });

});
