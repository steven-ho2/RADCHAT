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


		var time = getSentTime();
		io.emit('chat', {'time': time, 'msg': data.msg, 'username': data.name });

		if(msgLog.length + 1 > 200){
			msgLog.splice(0,1);
		}
		msgLog.push({'sender': data.name, 'time': time, 'msg': data.msg});

	});

	socket.on('load', function(){

		if(msgLog !== null){
			
			for(var i = 0; i < msgLog.length; i++){
				socket.emit('chat',{'time': msgLog[i].time, 'msg': msgLog[i].msg, 'username': msgLog[i].sender});
			}
		}

		var name = makeUserName();
		if(users !== null){
			var matching = true;
			while(matching){
				matching = false;
				for(var i = 0; i < users.length; i ++){
					if(users[i].username === name){
						matching = true;
						name = makeUserName();
						break;
					}
				}
			}
		}

		socket.emit('name', {'username' : name});
		users.push({'id': socket.id,'username': name, 'nick': null,'nickcolor':null});
	});

	socket.on('group',function(){
		io.emit('group',users);
	});

	socket.on('disconnect', function(){

		for(var i = 0; i < users.length; i++){
			if(users[i].id === socket.id){
				users.splice(i,1);
			}
		}

		io.emit('group',users);
	});

});

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
