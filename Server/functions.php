<?php 

function findUserByEmail( $users, $email )
{
    foreach ($users as $user) 
    {
        if( $user->Email === $email )
        {
            return $user;
        }
    }
}

function getDBFileContent()
{
    $getfile = file_get_contents( 'DB.json' );
    $jsonfile = json_decode( $getfile );

    return $jsonfile;
}

function filterArray( $array, $fields )
{
    foreach ( $array as $key => $value ) 
    {
        if ( in_array( $key, $fields ))
        {
            $response[ $key ] = $value;
        }
    }

    return $response;
}

?>