const iChars = "!@#$%^&*()+=-[]\\\';,./{}|\":<>?";

// get one element by CSS selector
function _( selector )
{
	return document.querySelector( selector );

}

// get all elements by CSS selector
function __( selector )
{
	return document.querySelectorAll( selector );

}

// transform json into formdata
function jsonToFormData( json )
{
	let formData = new FormData();

	for( let key in json )
	{
		formData.append( key, json[key] );
	}

	return formData;
}

//order and print the data in table
function printToTable( data ,fieldsName, fieldsToPrint, fieldsToPrintAsTime, selector)
{
	var str;
	const time = new Date().toLocaleTimeString('he-IL', 
	{ 	hour12: false, 
		hour: "numeric", 
		minute: "numeric",
		second: "numeric"
	});

	str = "<table class='users-data'><thead><tr>";
	fieldsName.map( element => 
	{
		str += "<td class='" + element.toLowerCase() +"'>" + element + " </td>";
	});

	str += "</tr><tr><td class='last-update' colspan='3'>Last update: " + time + "</td></tr></thead><tbody><tr>";

	data.map(( item ) => 
	{
		str += "<tr class='users-row' rel='" + item['Email'] + "'>";

		for( let [ key, value ] of Object.entries( item ) )
		{
			if( fieldsToPrint.includes(key) )
			{
				if( fieldsToPrintAsTime.includes(key) )
				{
					value = new Date( parseInt( value )).toLocaleTimeString('he-IL', 
					{ year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
				}

				str += "<td>" + value + "</td>";		
			}
		}

		str += "</tr>";;
		
	});
	
	str += "</tbody></table>";

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