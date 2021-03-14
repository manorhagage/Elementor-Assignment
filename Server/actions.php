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


?>