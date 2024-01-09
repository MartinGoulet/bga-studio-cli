<?php

/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * ${Game} implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on https://boardgamearena.com.
 * See http://en.doc.boardgamearena.com/Studio for more information.
 * -----
 * 
 * ${game}.action.php
 *
 * ${Game} main action entry point
 *
 *
 * In this file, you are describing all the methods that can be called from your
 * user interface logic (javascript).
 *       
 * If you define a method "myAction" here, then you can call it from your javascript code with:
 * this.ajaxcall( "/${game}/${game}/myAction.html", ...)
 *
 */


class action_${game} extends APP_GameAction {
   // Constructor: please do not modify
   public function __default() {
      if (self::isArg('notifwindow')) {
         $this->view = "common_notifwindow";
         $this->viewArgs['table'] = self::getArg("table", AT_posint, true);
      } else {
         $this->view = "${game}_${game}";
         self::trace("Complete reinitialization of board game");
      }
   }

   /*
    
    Example:
  	
    public function myAction()
    {
        self::setAjaxMode();     

        // Retrieve arguments
        // Note: these arguments correspond to what has been sent through the javascript "ajaxcall" method
        $arg1 = self::getArg( "myArgument1", AT_posint, true );
        $arg2 = self::getArg( "myArgument2", AT_posint, true );

        // Then, call the appropriate method in your game logic
        $this->game->myAction( $arg1, $arg2 );

        self::ajaxResponse( );
    }
    
    */

   // TODO: defines your action entry points there

   private function getArrayArgs($args) {
      // Removing last ';' if exists
      if (substr($args, -1) == ';')
         $args = substr($args, 0, -1);

      if ($args == '')
         $args = array();
      else
         $args = explode(';', $args);

      return $args;
   }
}
