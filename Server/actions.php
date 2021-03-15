<?php

    require_once('functions.php');
    abstract class BaseAction 
    {
        // Contain all the actions the class should do
        abstract protected function actions( $data ): object ;

        // Validate the request - return true unless change
        protected function validation( $data ): bool
        {
            return true;
        }
        
        // Response using the HTTP class
        protected function response( $code, $content ) 
        {
            header( 'Content-Type: application/json' );
            header( 'HTTP/1.0 ' . $code );
            die( json_encode( $content ) );
        }

        // Combine all classes
        public final function handleRequest( $data )
        {
            if( !$this->validation( $data ) )
            {
                $this->response( 400 , 'Validation Error' );
            }

            $response = $this->actions( $data );
            
            return $this->response( $response->code , $response->content );
        }
    }

    // Create new user and add to the DB file - if not created
    class CreateNewUser extends BaseAction
    {
        protected function actions( $data ): object
        {
            $jsonfile = getDBFileContent();
            $users = $jsonfile->users;

            $userToResponse = findUserByEmail( $users, $data['Email'] );

            $data['UserAgent'] = $_SERVER['HTTP_USER_AGENT'];
            $data['UserIp'] = $_SERVER['REMOTE_ADDR'];

            if( isset($userToResponse) )
            {
                return (object) 
                [
                    'code' => 409,
                    'content' => 'User allready exists',
                ];
            }
            
            array_push( $jsonfile->users, $data );
            file_put_contents( "DB.json", json_encode( $jsonfile ));
            
            return (object) 
            [
                'code' => 201,
                'content' => 'User created',
            ];
        }
    }

    // Send a user by his Email
    class GetOneUserByEmail extends BaseAction
    {
        // Check if received email
        protected function validation( $data ): bool
        {
            return isset( $data );
        }
        // Create new user
        protected function actions( $data ): object
        {
            $jsonfile = getDBFileContent();
            $users = $jsonfile->users;

            $userToResponse = findUserByEmail( $users, $data );

            // If user not found
            if( !isset($userToResponse) )
            {
                return (object) 
                [
                    'code' => 404,
                    'content' => 'Not Found',
                ];
            }

            // Response only required fields
            $fieldsToResponse = [ 'Email', 'Name', 'UserAgent', 'EntranceTime', 'VisitsCount' ];
            $response = filterArray( $userToResponse, $fieldsToResponse );

            return (object) 
            [
                'code' => 302,
                'content' => $response,
            ];
        }
    }

    // Login user and change necessary fields
    class LoginUser extends BaseAction
    {
        protected function actions( $data ): object
        {
            $jsonfile = getDBFileContent();
            $users = $jsonfile->users;

            foreach ($users as $user) 
            {
                if( $user->Email === $data['Email'] && $user->Name === $data['Name'] )
                {
                    $userExists = true;

                    // Update user values
                    $user->UserAgent = $_SERVER['HTTP_USER_AGENT'];
                    $user->UserIp = $_SERVER['REMOTE_ADDR'];
                    $user->VisitsCount += 1;
                    $user->EntranceTime = $data['EntranceTime'];
                    $user->IsOnline = true;
                }
            }

            if( !isset($userExists) )
            {
                return (object) 
                [
                    'code' => 404,
                    'content' => 'Not Found',
                ];

            }

            $newArray = array( "users" => $users );
            file_put_contents( "DB.json", json_encode( $newArray ));
            
            return (object) 
            [
                'code' => 200,
                'content' => 'User logged in',
            ];
        }
    }

    // Logout user and change necessary fields
    class LogoutUser extends BaseAction
    {
        protected function actions( $data ): object
        {
            $jsonfile = getDBFileContent();
            $users = $jsonfile->users;

            foreach ($users as $user) 
            {
                if( $user->Email === $data['Email'] )
                {
                    $userExists = true;

                    $user->IsOnline = false;
                }
            }

            // Check if user not found
            if( !isset($userExists) )
            {
                return (object) 
                [
                    'code' => 404,
                    'content' => 'Not Found',
                ];
            }

            $newArray = array( "users" => $users );
            file_put_contents( "DB.json", json_encode( $newArray ));
            return (object) 
            [
                'code' => 200,
                'content' => 'User logged out',
            ];

        }
    }

    // Send all users in DB
    class GetAllUsers extends BaseAction
    {
        protected function actions( $data ): object
        {
            $jsonfile = getDBFileContent();

            // Response only required fields
            $fieldsToResponse = [ 'Email', 'Name','EntranceTime', 'LastUpdateTime', 'UserIp' ];
            $response = array();

            foreach ($jsonfile->users as $key => $value ) 
            {
                // Response only online users 
                if( $value->IsOnline == true )
                {
                    array_push( $response ,filterArray( $value, $fieldsToResponse ));
                }
            }
            
            return (object) 
            [
                'code' => 200,
                'content' => $response,
            ];
        }
    }

    // Handle unknown requests to the server
    class UnknownRequest extends BaseAction
    {
        protected function actions( $data ): object
        {
            return (object) 
            [
                'code' => 400,
                'content' => 'Unknown Request',
            ];
        }
    }

?>