var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var msgLog = [];
var users = [];

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

// listen to 'chat' messages
io.on('connection', function(socket){

	socket.on('chat', function(data){

		var index = getIndexOf(socket.id);
		var color = users[index].nickcolor;
		var time = getSentTime();

		io.emit('chat', {'time': time, 'msg': data.msg, 'username': data.name , 'color': color});

		if(msgLog.length + 1 > 200){
			msgLog.splice(0,1);
		}
		msgLog.push({'sender': data.name, 'time': time, 'msg': data.msg,'color': color});

	});

	socket.on('load', function(){

		if(msgLog !== null){
			for(var i = 0; i < msgLog.length; i++){
				socket.emit('chat',{'time': msgLog[i].time, 'msg': msgLog[i].msg, 'username': msgLog[i].sender, 'color': msgLog[i].color});
			}
		}

		var name = makeUserName();
		var nametaken = nameTaken(name);

		if(users !== null){

			while(nametaken){
				name = makeUserName();
				nametaken = nameTaken(name);
			}
		}

		socket.emit('name', {'username' : name});
		users.push({'id': socket.id,'username': name,'nickcolor':null});
	});

	socket.on('group',function(){
		io.emit('group',users);
	});

	socket.on('updateUsername', function(data){
		
		
		var index = getIndexOf(socket.id);

		if(nameTaken(data.newName)){
			socket.emit('alert',{'msg': "Name is already taken!"});
			return;
		}

		users[index].username = data.newName;
		socket.emit('name', {'username' : users[index].username});
		io.emit('group',users);
		socket.emit('alert',{'msg': "Your username has been changed successfully"});

	});

	socket.on('updateColor', function(data){
		var color = data.newColor;
		if(!color.match(/[a-f0-8]{6}/)){
			socket.emit('alert',{'msg': "Invalid Color Option"});
			return;
		}
		else{

			var index = getIndexOf(socket.id);

			users[index].nickcolor = "#" + color;
			socket.emit('alert',{'msg': "Your name color has been changed successfully"});

		}


	});

	socket.on('disconnect', function(){

		var index = getIndexOf(socket.id);
		
		(index !== -1) ? users.splice(index,1) : socket.emit('alert',{'msg': "Could not find user"});

		io.emit('group',users);
	});

});


//Get the Index of the user by Socket id
function getIndexOf(socketID){

	var index;
	var found = false;
	for(var i = 0; i < users.length; i++){
		if(users[i].id === socketID){
			index = i;
			found = true;
			break;
		}
	}
	return (found) ? index : -1;
}

function nameTaken(name){

	var taken = false;
	for(var i = 0; i < users.length; i++){
		if(users[i].username === name){
			taken = true;
			break;
		}
	}
	return taken;
}

//Get the time the message was sent
function getSentTime(){
	var d = new Date();
	var str = d.toUTCString();
	return str.match(/[0-9][0-9]:[0-9][0-9]/);
}


//This will make the user name
function makeUserName(){
	var name  = randomEl(adjectives);
	name += ' ' + randomEl(nouns);
	return name;
}

//This is the name-gen source::: https://jsfiddle.net/katowulf/3gtDf/    /////////////////////////////////////////////////////////////////////////////////////////////////////////

//Get the random element
function randomEl(list) {
    var i = Math.floor(Math.random() * list.length);
    return list[i];
}

//List of adjectives and nouns

var adjectives = ["adamant", "adroit", "amatory", "animistic", "antic", "arcadian", "baleful", "bellicose", "bilious", "boorish", "calamitous", "caustic", "cerulean", "comely", "concomitant", "contumacious", "corpulent", "crapulous", "defamatory", "didactic", "dilatory", "dowdy", "efficacious", "effulgent", "egregious", "endemic", "equanimous", "execrable", "fastidious", "feckless", "fecund", "friable", "fulsome", "garrulous", "guileless", "gustatory", "heuristic", "histrionic", "hubristic", "incendiary", "insidious", "insolent", "intransigent", "inveterate", "invidious", "irksome", "jejune", "jocular", "judicious", "lachrymose", "limpid", "loquacious", "luminous", "mannered", "mendacious", "meretricious", "minatory", "mordant", "munificent", "nefarious", "noxious", "obtuse", "parsimonious", "pendulous", "pernicious", "pervasive", "petulant", "platitudinous", "precipitate", "propitious", "puckish", "querulous", "quiescent", "rebarbative", "recalcitant", "redolent", "rhadamanthine", "risible", "ruminative", "sagacious", "salubrious", "sartorial", "sclerotic", "serpentine", "spasmodic", "strident", "taciturn", "tenacious", "tremulous", "trenchant", "turbulent", "turgid", "ubiquitous", "uxorious", "verdant", "voluble", "voracious", "wheedling", "withering", "zealous"];

var nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnomes", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "stick figures", "mermaid eggs", "sea barnacles", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice cream", "ukulele", "kazoo", "banjo", "opera singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "hot air balloon", "praying mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "make-up artist", "model", "musician", "penciller", "producer", "scenographer", "set decorator", "silversmith", "teacher", "auto mechanic", "beader", "bobbin boy", "clerk of the chapel", "filling station attendant", "foreman", "maintenance engineering", "mechanic", "miller", "moldmaker", "panel beater", "patternmaker", "plant operator", "plumber", "sawfiler", "shop foreman", "soaper", "stationary engineer", "wheelwright", "woodworkers"];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
