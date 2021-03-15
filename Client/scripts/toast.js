// Create toast
function creatToast( timeToShow, type, msg ) 
{
    var container = _( '.container' );

    var toast = document.createElement( 'div' );
    toast.setAttribute( 'id', 'toast' );
    document.body.insertBefore( toast, container );
    
    toast.appendChild( document.createTextNode( msg ) );
    toast.classList.add( 'show' );
    toast.classList.add( type );
  
    // After "timeToShow" seconds, remove toast
    setTimeout(() =>
    { 
        toast.remove();
    }, timeToShow );
}