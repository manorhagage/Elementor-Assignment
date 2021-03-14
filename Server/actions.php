<?php

    require_once('functions.php');
    abstract class BaseAction 
    {
        // Contain all the actions the class should do
        abstract protected function actions( $data ): object ;

        // Validate the request - return true unless change
        protected function validation(): bool
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
            if( !$this->validation() )
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

            $userToResponse = findUserByEmail( $users, $data->Email );

            if( isset($userToResponse) )
            {
                $response = (object) 
                [
                    'code' => 409,
                    'content' => 'User allready exist',
                ];
            }
            else
            {
                array_push( $jsonfile->users, $data );
                file_put_contents( "DB.json", json_encode( $jsonfile ));
                $response = (object) 
                [
                    'code' => 201,
                    'content' => 'User created',
                ];
            }

            return $response;
        }
    }

    // Send a user by his Email
    class GetOneUserByEmail extends BaseAction
    {
        // Create new user
        protected function actions( $data ): object
        {
            $jsonfile = getDBFileContent();
            $users = $jsonfile->users;

            $userToResponse = findUserByEmail( $users, $data );

            if( isset($userToResponse) )
            {
                $response = (object) 
                [
                    'code' => 302,
                    'content' => $userToResponse,
                ];
            }
            else
            {
                $response = (object) 
                [
                    'code' => 404,
                    'content' => 'Not Found',
                ];
            }

            return $response;
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
                if( $user->Email === $data->Email && $user->Name === $data->Name )
                {
                    $userExists = true;

                    $user->VisitsCount += 1;
                    $user->EntranceTime = $data->EntranceTime;
                    $user->IsOnline = true;
                }
            }

            if( isset($userExists) )
            {
                $newArray = array( "users" => $users );
                file_put_contents( "DB.json", json_encode( $newArray ));
                $response = (object) 
                [
                    'code' => 200,
                    'content' => 'User logged in',
                ];
            }
            else
            {
                $response = (object) 
                [
                    'code' => 404,
                    'content' => 'Not Found',
                ];
            }

            return $response;
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
                if( $user->Email === $data->Email && $user->Name === $data->Name )
                {
                    $userExists = true;

                    $user->IsOnline = false;
                }
            }

            if( isset($userExists) )
            {
                $newArray = array( "users" => $users );
                file_put_contents( "DB.json", json_encode( $newArray ));
                $response = (object) 
                [
                    'code' => 200,
                    'content' => 'User logged out',
                ];
            }
            else
            {
                $response = (object) 
                [
                    'code' => 404,
                    'content' => 'Not Found',
                ];
            }

            return $response;
        }
    }

    // Send all users in DB
    class GetAllUsers extends BaseAction
    {
        // Create new user
        protected function actions( $data ): object
        {
            $jsonfile = getDBFileContent();

            $response = (object) 
            [
                'code' => 200,
                'content' => $jsonfile,
            ];

            return $response;
        }
    }

    // Handle unknown requests to the server
    class UnknownRequest extends BaseAction
    {
        protected function actions( $data ): object
        {
            $response = (object) 
            [
                'code' => 400,
                'content' => 'Unknown Request',
            ];

            return $response;
        }
    }

?>