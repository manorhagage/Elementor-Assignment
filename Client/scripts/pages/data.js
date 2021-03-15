// prevent from unauthorized user to get in
if( !sessionStorage.getItem( 'online' ) )
{
    window.location = './';
}

// Values to print in the table
const fieldsName = [ 'Name', 'Last Entrance', 'Last Time Updated', 'IP' ];
const fieldsToPrint = [ 'Name', 'EntranceTime', 'LastUpdateTime', 'UserIp' ];
const fieldsToPrintAsTime = [ 'EntranceTime', 'LastUpdateTime' ];

// Fetch users and oreder in a table
async function fetchAndOrderUsers()
{
    _('.loader').classList.remove('hide');
    // Commit fetch request
    let getAllUsersReq = await establishRequest( 'GetAllUsers' );

    setTimeout( () => 
    { 
        _('.loader').classList.add('hide'); 
    }, 600 );

    // Print to table
    printToTable( getAllUsersReq, fieldsName, fieldsToPrint, fieldsToPrintAsTime, '.users' );

    // Create user modal on click
    createUserModalListener();
}

// Create user modal on click user row
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
            _('#entrance-time').innerHTML = timestampToDate( getUser.EntranceTime );
            _('#visits-count').innerHTML = getUser.VisitsCount;
    
            _('#modal').classList.remove('hidden');
        })
    });
}

// Logoutuser
async function logout()
{
    const logout = await establishRequest( 'LogoutUser', { 'Email': sessionStorage.getItem( 'email' ) });
    sessionStorage.clear();
    window.location = './';
}

// Add welcome message
_( '#welcome-msg' ).innerHTML = 'Welcome ' + sessionStorage.getItem( 'online' );


// Fetch once on load
fetchAndOrderUsers();

// // Refetch every 3 sec
setInterval( fetchAndOrderUsers, 3000 );


// logout user by click logout
_( '#logout' ).addEventListener( 'click', logout );

// logout user by close window
window.addEventListener( 'visibilitychange', () => 
{
    // Logout user when not focusing on window
    if( document.visibilityState === 'hidden' )
    {
        logout()
    }
});


// Close modal by click on X
_( '.close-modal' ).addEventListener( 'click', () =>
{
    _( '#modal' ).classList.add( 'hidden' );
});

// Close modal by click on overlay
_( '.overlay' ).addEventListener( 'click', () =>
{
    _( '#modal' ).classList.add( 'hidden' );
});