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

    // print to table
    printToTable( getAllUsersReq['users'], fieldsName, fieldsToPrint, fieldsToPrintAsTime, '.users' );

    // // reload every 3 sec
    // setInterval( () => 
    // { 
    //     getAllUsersReq = establishRequest(action,json);
    //     printPromiseToTable( getAllUsersReq, fieldsName, fieldsToPrint, '.users' ); 
    // }, 3000 );

    // logout user
    _( '#logout' ).addEventListener('click', e =>
    {
        sessionStorage.clear();
        window.location = './';
    });
});