// prevent from unauthorized user to get in
if( !sessionStorage.getItem( 'online' ) )
{
    window.location = './';
}

// Values to print in the table
const fieldsName = [ 'Name', 'Last Entrance', 'Last Time Updated', 'IP' ];
const fieldsToPrint = [ 'Name', 'EntranceTime', 'LastUpdateTime', 'UserIp'];
const fieldsToPrintAsTime = [ 'EntranceTime', 'LastUpdateTime' ];

async function fetchAndOrderUsers()
{
    // Commit fetch request
    let getAllUsersReq = await establishRequest( 'GetAllUsers' );

    // Print to table
    printToTable( getAllUsersReq, fieldsName, fieldsToPrint, fieldsToPrintAsTime, '.users' );

    // Create user modal on click
    createUserModalListener();
}

function createUserModalListener()
{
    __('.users-row').forEach( item => 
        {
        item.addEventListener('click', async e => 
        {
            const email = e.target.parentElement.attributes['rel'].value;
            const getUser = await establishRequest( 'GetOneUserByEmail', { 'email': email });
            
            _('#name').innerHTML = getUser.Name;
            _('#email').innerHTML = getUser.Email;
            _('#user-agent').innerHTML = getUser.UserAgent;
            _('#entrance-time').innerHTML = getUser.EntranceTime;
            _('#visits-count').innerHTML = getUser.VisitsCount;
    
            _('#modal').classList.remove('hidden');
        })
    });
}

// Add welcome message
_('#welcome-msg').innerHTML = 'Welcome ' + sessionStorage.getItem( 'online' );

fetchAndOrderUsers();

// // Refetch every 3 sec
setInterval( fetchAndOrderUsers, 3000 );

// logout user
_( '#logout' ).addEventListener('click',async () =>
{
    const logout = await establishRequest( 'LogoutUser', { 'Email': sessionStorage.getItem( 'email' ) });
    sessionStorage.clear();
    window.location = './';
});

_('.close-modal').addEventListener('click', () =>
{
    _('#modal').classList.add('hidden');
});