var gUsers = [
//	'Caroline',
//	'Imeh',
//	'Jiaxuan',
//	'Tim'
];

var gConnections = 
[
	// { datetime, location, firstUser, secondUser, passPhrase, story }
];

var gPotentialConnections = 
[
	// { datetime, notifiedUser, targetUser }
];

var gCurrentUser = null;

var gLastConnectionMade = null;


$(document).ready( function() {


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
// .button_show_history
// page_history
// page_potential_connections <-- notification page
// button-create-potential

var elements = [
	'signin_page',
	'profile',
	'conn_correct',
	'page_congrats',
	'page_history',
	'page_potential_connections',
];


function show(element_id)
{
	for (var i=0; i<elements.length; i++)
		$('#'+elements[i]).hide();
	if (element_id=='profile')
	{
		updateProfileElements();
	}
	if (element_id=="page_history")
	{
		updateHistoryPage();
	}
	if (element_id=="profile")
	{
		$('#secret_phrase').hide();
		$('#phrase_found').show();
	}
	$('#'+element_id).show();
	console.log("showed "+element_id);

	$('#label-bad-password').hide();
}


function createConnectionHtml(connection, isStoryEditable)
{
	var u = connection.secondUser;
	console.log('create connections for user:');
	console.log(u);
	var html = '\
	<div class="connection">\
		<img class="avatar" src="'+u.photo+'"/>\
		<p class="name">'+u.name+'</p>\
		<p class="phrase">'+u.secretPhrase+'</p>\
';
	if (isStoryEditable)
	{
		html += '\
	<textarea class="connection_story_editor" id="connection_story_editor" placeholder="Describe how you met '+u.name+'"></textarea>\
		';
	}
	else
	{
		html += '\
		<p class="story">'+connection.story+'</p>\
		';
	}
	html += '</div>';
	return html;

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
createUser('Professor plum', "purple jumper", "enjoys fruit", '', 'I like crumble', 'password');


// returns whether we have previously connected with a user
function havePreviouslyConnectedWith(user)
{
	for (var i=0; i<gConnections.length; i++)
	{
		if (gConnections.firstUser==user || gConnections.secondUser==user)
		{
			return true;
		}
	}
	return false;
}


function createPotentialConnections()
{
	gPotentialConnections = [];
	// creates potential connection with notification for current user
	targets = [];
	for (var i=0; i<gUsers.length; i++)
	{
		if (gUsers[i] != gCurrentUser // cant connect with yourself
			&& !havePreviouslyConnectedWith(gUsers[i]) // cant connect twice
			&& Math.random() < 0.7 // a bit of chance
			)
		{
			console.log('have previously connected '+havePreviouslyConnectedWith(gUsers[i]));
			console.log('user '+i);
			console.log(gUsers[i]);
			p = {
				'datetime': (new Date()).getTime(),
				'notifiedUser': gCurrentUser,
				'targetUser': gUsers[i],
			};
			gPotentialConnections.push(p);
		}
	}
	updateMyPotentialConnections();
}
$('#button-create-potential').click(createPotentialConnections);


// Check if I have any potential connections and show notification
// if I do.
function updateMyPotentialConnections()
{
	var myPotentials = [];
	for (var i=0; i<gPotentialConnections.length; i++)
	{
		var notified = gPotentialConnections[i].notifiedUser;
		if (notified == gCurrentUser)
		{
			myPotentials.push(gPotentialConnections[i]);
		}
	}
	$('.potential_connection_number').html(myPotentials.length);
	var html = ''
	for (var i=0; i<myPotentials.length; i++)
	{
		var p = myPotentials[i];
		html += '\
		<div class="potential_connection">\
			<img class="avatar" src="'+p.targetUser.photo+'"/>\
			<p class="name">'+p.targetUser.name+'</p>\
			<p class="physical_trait">'+p.targetUser.physicalTrait+'</p>\
			<p class="personal_trait">'+p.targetUser.personalTrait+'</p>\
		</div>\
		'
	}
	$('#list_of_potential_connections').html(html);
	if (myPotentials.length > 0)
	{

		$('#potential_connection_alert').show();
	}
	else
	{
		$('#potential_connection_alert').hide();
	}
}


function linkSignIn()
{
	console.log("linksignin");
	var login = $('#input-login').val();
	var password = $('#input-password').val();
	gCurrentUser = null;
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
		$('#label-bad-password').show();
	}
	else
	{
		console.log('signin successful');
		$('#label-bad-password').hide();
		show('profile');
	}
}

function updateProfileElements()
{
	if (gCurrentUser==null)
	{
		$('#text_name').html('');
		$('#text_physical_trait').html('');
		$('#text_personal_trait').html('');
		$('#text_phrase').html('');
		$('#text_score').html('');
	}
	else
	{
		// populate home page
		$('#text_name').html(gCurrentUser.name);
		$('#text_physical_trait').html(gCurrentUser.physicalTrait);
		$('#text_personal_trait').html(gCurrentUser.personalTrait);
		$('#text_phrase').html(gCurrentUser.secretPhrase);
		$('#text_score').html(gCurrentUser.score);
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
	var matchedPotentialIndex = -1;

	// search potential connections
	for (var i=0; i<gPotentialConnections.length; i++)
	{
		p = gPotentialConnections[i];
		if (p.notifiedUser == gCurrentUser)
		{
			// search target users
				var target = p.targetUser;
				if (target.secretPhrase.toLowerCase() == heardPhrase.toLowerCase())
				{
					matchedUser = target;
					actualPhrase = target.secretPhrase;
					matchedPotentialIndex = i;
				}
		}
		else if (p.targetUser == gCurrentUser)
		{
			// check if our user is a target and we heard the notified user secret phrase
				if (p.targetUsers == gCurrentUser 
					&& p.notifiedUser.secretPhrase.toLowerCase() == heardPhrase.toLowerCase())
				{
					matchedUser = p.notifiedUser;
					actualPhrase = p.notifiedUser.secretPhrase;
					matchedPotentialIndex = i;
				}

		}
	}
	if (matchedUser != null)
	{
		gCurrentUser.score += 1;
		matchedUser.score +=1;
		connection = {
			'datetime': (new Date()).getTime(), 
			'location': null, 
			'firstUser': gCurrentUser, 
			'secondUser': matchedUser, 
			'passPhrase': actualPhrase, 
			'story': '', 
		};
		console.log('created connection secondUser '+connection.secondUser);
		gConnections.push(connection);
		gPotentialConnections.splice(matchedPotentialIndex, matchedPotentialIndex+1);
		updateMyPotentialConnections();
		// update congrats page
		$('#the_connection').html(createConnectionHtml(connection, true));
		gLastConnectionMade = connection;
		$('#link_congrats_back').click( function(e) {
			gLastConnectionMade.story = $('#connection_story_editor').val();
			show('profile');
		})
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




function updateHistoryPage()
{
	var html = '';
	for (var i=0; i<gConnections.length; i++)
	{
		html += createConnectionHtml(gConnections[i], false);
	}
	$('#the_connection_history').html(html);
}


	
	$('#link-sign-in').on('click', function(e) {linkSignIn(); e.preventDefault(); return false;});
	$('#link-phrase_found').on('click', function(e){
		$('#phrase_found').hide();
		$('#secret_phrase').show();
	});
	$('#btn-enter-secret-phrase').on('click', function(e){enterSecretPhrase(); e.preventDefault();});
	$('#link_potential_connections').on('click', function(e) { show('page_potential_connections'); e.preventDefault();});
	$('#link_potential_connections_back').on('click', function(e) { show('profile'); e.preventDefault();});
	$('.button_show_history').on('click', function(e) { show('page_history'); e.preventDefault();});
	$('#link_history_back').on('click', function(e) { show('profile'); e.preventDefault();});
	$('#link_congrats_back').on('click', function(e) { show('profile'); e.preventDefault(); });

show('signin_page');
console.log('Page loaded.');


});
console.log('asdf');

