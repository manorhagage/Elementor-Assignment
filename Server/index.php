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
            $json = file_get_contents('php://input');
            $data = json_decode( $json );

            $action = new CreateNewUser();
            return $action->handleRequest( $data );
        break;

        case 'LoginUser':
            $json = file_get_contents('php://input');
            $data = json_decode( $json );

            $action = new LoginUser();
            return $action->handleRequest( $data );
        break;

        case 'LogoutUser':
            $json = file_get_contents('php://input');
            $data = json_decode( $json );

            $action = new LogoutUser();
            return $action->handleRequest( $data );
        break;
        
        default:
        $action = new UnknownRequest();
        return $action->handleRequest( '' );
    }
?>