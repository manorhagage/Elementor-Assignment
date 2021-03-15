
// Submit button action
window.addEventListener('submit', async (e) =>
{
    e.preventDefault();

    // Get the values from the form
    const email = _( '#Email' ).value.trim();
    const name = _( '#Name' ).value.trim();

    if( specialChars( name ) )
    {
        creatToast( 3000, 'error', 'Error, your name can not contain special chars.');
        return;
    }

    // Create the values for login request
    const data = 
    {
        'Name': name,
        'Email': email,
        'EntranceTime': Date.now(),
    }

    // Try to loggin user
    const loginUserReq = await establishRequest( 'LoginUser', data );

    if( loginUserReq === 'User logged in' )
    {
        // Log in successfully
        creatToast( 3000, 'success', 'Enter successfully! You are being redirected');
        sessionStorage.setItem( 'online', name );
        sessionStorage.setItem( 'email', email );

        setTimeout( () => { window.location = './data.html'; }, 3000 );
    }
    else
    {
        // Add missing values for create request
        data.LastUpdateTime = Date.now(),
        data.VisitsCount = '1';
        data.IsOnline = 'true';

        // Try to create new user
        const createNewUserReq = await establishRequest( 'CreateNewUser', data );

        if( createNewUserReq !== 'User created' )
        {
            creatToast( 3000, 'error', 'Email allready in use. Use the correct Name to enter or use different Email.');
        }
        
        else
        {
            creatToast( 3000, 'success', 'Created successfully! You are being redirected');
            sessionStorage.setItem( 'online', name );
            sessionStorage.setItem( 'email', email );

            setTimeout( () => { window.location = './data.html'; }, 3000 );
        }
    }
});