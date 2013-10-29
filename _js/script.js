$(document).ready( function() {

var gUsers = [
//	'Caroline',
//	'Imeh',
//	'Jiaxuan',
//	'Tim'
];

var gConnections = 
{
	// { datetime, location, firstUser, secondUser, passPhrase, story }
}

var gPotentialConnections = 
{
	// { datetime, notifiedUser, [targetUserNames] }
}

var gCurrentUser = null;

console.log("page load");


// css ids:
// input-login
// input-password
// label-bad-password
// signin_page
// link-sign-in
// profile (main profile page)
// link-sign-up
// page-sign-up
// input-heard-phrase
// page_congrats
// label-bad-secret-phrase
// button-enter-secret-phrase
// input-story
// button-congrats-done
// button-history
// page-history
// page-potential <-- notification page
// button-create-potential

var elements = [
	'signin_page',
	'profile',
	'conn_correct',
	'page_congrats',
];


function show(element_id)
{
	for (var i=0; i<elements.length; i++)
		$('#'+elements[i]).hide();
	$('#'+element_id).show();
	console.log("showed "+element_id);
	$('#secret_phrase').hide();
	$('#bad_password').hide();
}


function createUser(name, physicalTrait, personalTrait, photo, secretPhrase, password)
{
	var user = {
		'name':name,
		'physicalTrait':physicalTrait,
		'personalTrait':personalTrait,
		'photo':photo,
		'secretPhrase':secretPhrase,
		'password':password,
		'score':0
	};
	console.log('new user');
	console.log(user);
	gUsers.push(user);
}
createUser('Colonel Mustard', "Six foot short hair.", "Likes talking bollocks", '', 'The cuckoo flies high', 'password');


function createPotentialConnections()
{
	// creates potential connection with notification for current user
	targets = [];
	for (var i=0; i<gUsers.length; i++)
	{
		if (gUsers[i] != gCurrentUser && Math.random() < 0.7)
		{
			targets.push(gUsers[i]);
		}
	}
	p = {
		'datetime': getTime(),
		'notifiedUser': gCurrentUser,
		'targetUsers': targets,
	};
	gPotentialConnections.push(p);
	show('page-potential');
}
$('#button-create-potential').click(createPotentialConnections);


function linkSignIn()
{
	console.log("linksignin");
	var login = $('#input-login').val();
	var password = $('#input-password').val();
	var gCurrentUser = null;
	console.log('entered login and password '+login+' '+password);
	for (var i=0; i<gUsers.length; i++)
	{
		if (gUsers[i].name == login && gUsers[i].password == password)
		{
			gCurrentUser = gUsers[i];
			console.log('successful sign in');
			break;
		}
	}
	if (gCurrentUser == null)
	{
		console.log('signin failed');
		show('label-bad-password');
	}
	else
	{
		console.log('signin successful');
		$('#label-bad-password').hide();
		// populate home page
		$('#text_name').html(gCurrentUser.name);
		$('#text_physical_trait').html(gCurrentUser.physicalTrait);
		$('#text_personal_trait').html(gCurrentUser.personalTrait);
		$('#text_phrase').html(gCurrentUser.secretPhrase);
		show('profile');
	}
}


function linkSignUp()
{
	$('#signin_page').hide();
	$('#page-sign-up').show();
}
$('#link-sign-up').click(linkSignUp);

function enterSecretPhrase()
{
	var heardPhrase = $('#input-heard-phrase').val();
	var actualPhrase = null;
	var matchedUser = null;

	// search potential connections
	for (var i=0; i<gPotentialConnections.length; i++)
	{
		p = gPotentialConnections[i];
		if (p.notifiedUser == gCurrentUser)
		{
			// search target users
			for (var j=0; j<p.targetUsers.length; j++)
			{
				var target = p.targetUsers[j];
				if (target.secretPhrase.toLowerCase() == heardPhrase.toLowerCase())
				{
					matchedUser = target;
					actualPhrase = target.secretPhrase;
				}
			}
		}
		else
		{
			// check if our user is a target and we heard the notified user secret phrase
			for (var j=0; j<p.targetUserNames.length; j++)
			{
				if (p.targetUsers[j] == gCurrentUser 
					&& p.notifiedUser.secretPhrase.toLowerCase() == heardPhrase.toLowerCase())
				{
					matchedUser = p.notifiedUser;
					actualPhrase = p.notifiedUser.secretPhrase;
				}
			}

		}
	}
	if (matchedUser != null)
	{
		gCurrentUser.score += 1;
		matchedUser +=1;
		connection = {
			'datetime': gettime(), 
			'location': null, 
			'firstUser': gCurrentUser, 
			'secondUser': matchedUser, 
			'passPhrase': actualPhrase, 
			'story': '', 
		};
		gConnections.push(connection);
		show('page_congrats');
	}
	else
	{
		$('#label-bad-secret-phrase').show();
		setTimeout(function() {
			$('#label-bad-secret-phrase').hide();
		}, 2000);
	}
}



// for congrats page
function editStory()
{
	if (connections.length==0)
		return;
	connections[connections.length-1].story = $('#input-story').val();
}
$('#input-story').change(editStory);


function buttonCongratsDone()
{
	show('profile');
}
$('#button-congrats-done').click(buttonCongratsDone);


function buttonHistory()
{
	show('page-history');
}
$('#button-history').click(buttonHistory);

// var hidden = ['profile','conn_correct','secret_phrase'];

// for (var i=0; i<hidden.length; i++)
// {
// 	$('#'+hidden[i]).hide();
// }

show('signin_page');

	
	$('#link-sign-in').on('click', function(e) {linkSignIn(); e.preventDefault(); return false;});
	$('#link-phrase_found').on('click', function(e){
		$('.phrase_found').hide();
		$('.secret_phrase').show();
	});
	$('#btn-enter-secret-phrase').on('click', function(e){enterSecretPhrase();});
	console.log('asd'); 
});