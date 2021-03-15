// prevent from unauthorized user to get in
if( !sessionStorage.getItem( 'online' ) )
{
    window.location = './';
}

// Submit button action
window.addEventListener('load', async () =>
{
    // Add welcome message
    _('#welcome-msg').innerHTML = 'Welcome ' + sessionStorage.getItem( 'online' );

    
    // values to print in the table
    const fieldsName = [ 'Name', 'Last Entrance', 'Last Time Updated', 'IP' ];
    const fieldsToPrint = [ 'Name', 'EntranceTime', 'LastUpdateTime', 'UserIp'];
    const fieldsToPrintAsTime = [ 'EntranceTime', 'LastUpdateTime' ];

async function fetchAndOrderUsers()
{
    // Commit fetch request
    let getAllUsersReq = await establishRequest( 'GetAllUsers' );

    // Print to table
    printToTable( getAllUsersReq['users'], fieldsName, fieldsToPrint, fieldsToPrintAsTime, '.users' );

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
});