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
// page-home (main profile page)
// link-sign-up
// page-sign-up
// input-heard-phrase
// page-congrats
// label-bad-secret-phrase
// button-enter-secret-phrase
// input-story
// button-congrats-done
// button-history
// page-history
// page-potential <-- notification page
// button-create-potential

function createUser(name, description, photo, secretPhrase, password)
{
	var user = {
		'name':name,
		'description':description,
		'photo':photo,
		'secretPhrase':secretPhrase,
		'password':password,
	};
	gUsers.push(user);
}
createUser('Colonel Mustard', "Six foot short hair. Likes talking bollocks", '', 'The cuckoo flies high', 'password');


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
	$('#page-home').hide();
	$('#page-potential').show();
}
$('#button-create-potential').click(createPotentialConnections);


function linkSignIn()
{
	console.log("linksignin");
	var login = $('#input-login').val();
// return;
	var password = $('#input-password').val();
		var gCurrentUser = null;
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
		$('#label-bad-password').show();
	}
	else
	{
		$('#label-bad-password').hide();
		$('#signin_page').hide();
		$('#page-home').show();
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
		connection = {
			'datetime': gettime(), 
			'location': null, 
			'firstUser': gCurrentUser, 
			'secondUser': matchedUser, 
			'passPhrase': actualPhrase, 
			'story': '', 
		};
		gConnections.push(connection);
		$('#page-home').hide();
		$('#page-congrats').show();
	}
	else
	{
		$('#label-bad-secret-phrase').show();
		setTimeout(function() {
			$('#label-bad-secret-phrase').hide();
		}, 2000);
	}
}
$('#button-enter-secret-phrase').click(enterSecretPhrase);


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
	$('#page-congrats').hide();
	$('#page-home').show();
}
$('#button-congrats-done').click(buttonCongratsDone);


function buttonHistory()
{
	$('#page-home').hide();
	$('#page-history').show();
}
$('#button-history').click(buttonHistory);

// });

// $(document).ready(function() {
	$('#link-sign-in').on('click', function(e) {linkSignIn(); });
	console.log('asd'); 
});