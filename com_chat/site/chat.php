<?php

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

// Require the base controller
if(!defined('DS')){
	define('DS',DIRECTORY_SEPARATOR);
}

require_once( JPATH_COMPONENT.DS.'controller.php' );
require_once( dirname( __FILE__ ) . '/helper/helper.php' );
$classname	= 'ChatController';
$controller	= new $classname();

// Perform the Request task
$input = JFactory::getApplication()->input;
$task = $input->get('task');
$controller->execute($task);

// Redirect if set by the controller
$controller->redirect();