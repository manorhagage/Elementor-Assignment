<?php 

    require_once('actions.php');

    // Get the action from the request
    $action = $_GET['action'];

    // Use the class by the request action
    switch ( $action ) 
    {            
        case 'GetAllUsers':
            $action = new GetAllUsers();
            return $action->handleRequest( '' );
        break;

        case 'GetOneUserByEmail':
            $data = $_GET['email'];

            $action = new GetOneUserByEmail();
            return $action->handleRequest( $data );
        break;

        case 'CreateNewUser':
            $data =  $_POST;

            $action = new CreateNewUser();
            return $action->handleRequest( $data );
        break;

        case 'LoginUser':
            $data =  $_POST;

            $action = new LoginUser();
            return $action->handleRequest( $data );
        break;

        case 'LogoutUser':
            $data =  $_POST;

            $action = new LogoutUser();
            return $action->handleRequest( $data );
        break;
        
        default:
        $action = new UnknownRequest();
        return $action->handleRequest( '' );
    }
?>