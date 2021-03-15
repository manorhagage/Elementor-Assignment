const API_URL = '../Server/index.php';

// send the right method to the fetch request 
function establishRequest( action , data='' )
{
	switch ( action ) {
		case 'CreateNewUser':
			return fetchRequest( 'POST', action, data );

		case 'LoginUser':
			return fetchRequest( 'POST', action, data );


		default:
			console.log( 'something went wrong' );
			break;
	}
}

// fetch request to the API
async function fetchRequest( method, action, data )
{
	let url = `${ API_URL }?action=${ action }`;
    let options =
	{ 
		method, 
		mode: 'cors', 
		redirect: 'follow'
	};

	if( method === 'GET' )
	{
		const queryString = Object.keys( data ).map( key => ( key + '=' + data[key] ) ).join( '&' );
		url += queryString ? '&' + queryString : '';
	}

	// other methods, add 'data' as body
	else
	{
		options.body = jsonToFormData( data );
	}

	console.log( data )

	return fetch( url, options ).then( res => res.json());
}