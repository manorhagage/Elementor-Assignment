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



?>