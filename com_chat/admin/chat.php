<?php defined('_JEXEC') or die('Restricted access');

jimport('joomla.application.component.helper');
require_once(JPATH_COMPONENT.'/controller.php');

$task = JFactory::getApplication()->input->get('task');
$controller    = JControllerLegacy::getInstance('Chat');
$controller->execute(JFactory::getApplication()->input->get('task'));

$controller->redirect();