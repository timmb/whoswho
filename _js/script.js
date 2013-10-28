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



// css ids:
// input-login
// input-password
// label-bad-password
// page-login
// link-sign-in
// page-home (main profile page)
// link-sign-up
// page-sign-up
// input-heard-phrase
// page-congrats
// label-bad-secret-phrase
// button-enter-secret-phrase
// input-story

function createUser(name, description, photo, secretPhrase)
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


function linkSignIn()
{
	var login = $['#input-login'].val();
	var password = $['#input-password'].val();
	var gCurrentUser = null;
	for (var i=0; i<gUsers.length; i++)
	{
		if (gUsers[i].name == login && gUsers[i].password == password)
		{
			gCurrentUser = gUsers[i];
			break;
		}
	}
	if (gCurrentUser == null)
	{
		$['#label-bad-password'].show();
	}
	else
	{
		$['#label-bad-password'].hide();
		$['#page-login'].hide();
		$['#page-home'].show();
	}
}
$['#link-sign-in'].click(linkSignIn);


function linkSignUp()
{
	$['#page-login'].hide();
	$['#page-sign-up'].show();
}
$['#link-sign-up'].click(linkSignUp);


function enterSecretPhrase()
{
	var heardPhrase = $['#input-heard-phrase'].val();
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
		$['#page-home'].hide();
		$['#page-congrats'].show();
	}
	else
	{
		$['#label-bad-secret-phrase'].show();
	}
}
$['#button-enter-secret-phrase'].click(enterSecretPhrase);

// for congrats page
function editStory()
{
	if (connections.length==0)
		return;
	connections[connections.length-1].story = $['#input-story'].val();
}
$['#input-story'].change(editStory);