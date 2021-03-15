const iChars = "!@#$%^&*()+=-[]\\\';,./{}|\":<>?";

// Get one element by selector
function _( selector )
{
	return document.querySelector( selector );
}

// Get all elements by selector
function __( selector )
{
	return document.querySelectorAll( selector );
}

// Transform json into formdata
function jsonToFormData( json )
{
	let formData = new FormData();

	for( let key in json )
	{
		formData.append( key, json[ key ] );
	}

	return formData;
}

// Transform timestamp to readable date
function timestampToDate( string )
{
	return new Date( parseInt( string )).toLocaleTimeString('he-IL', 
			{ year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

//Order and print the data in a table
function printToTable( data , fieldsName, fieldsToPrint, fieldsToPrintAsTime, selector )
{
	// Table string
	let str;

	// Get and form current time
	const time = new Date().toLocaleTimeString('he-IL', 
	{ 	hour12: false, 
		hour: 'numeric', 
		minute: 'numeric',
		second: 'numeric'
	});

	// Fill thead
	str = "<table class='users-data'><thead><tr>";
	fieldsName.map( element => 
	{
		str += "<td class='" + element.toLowerCase() +"'>" + element + " </td>";
	});

	str += "</tr><tr><td class='last-update' colspan='4'>Last update: " + time + "<div class='loader'></div></div></td></tr></thead><tbody><tr>";

	// Fill tbody
	data.map(( item ) => 
	{
		str += "<tr class='users-row' rel='" + item['Email'] + "'>";

		for( let [ key, value ] of Object.entries( item ) )
		{
			if( fieldsToPrint.includes(key) )
			{
				if( fieldsToPrintAsTime.includes( key ) )
				{
					value = timestampToDate( value );
				}

				str += "<td>" + value + "</td>";		
			}
		}

		str += "</tr>";;
		
	});
	
	str += "</tbody></table>";

	// Insert into element
	_(selector).innerHTML = str;
}

// Check for special chars
function specialChars( data )
{
	for ( var i = 0; i < data.length; i++ ) 
	{
		if ( iChars.indexOf( data.charAt( i )) != -1 ) 
		{
			return true;
		}
	}
	return false;
}