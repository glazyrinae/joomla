<?php

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.controller');

if (!class_exists('JControllerLegacy')){
    class JControllerLegacy extends JController {

    }
}

class ChatController extends JControllerLegacy
{
	/**
	 * Method to display the view
	 *
	 * @access    public
	 */
	function display($cachable = false, $urlparams = array())
	{
		$user_to   = JRequest::getVar('id_to');
		$user_from = JRequest::getVar('id_from');
		$order = isset($_GET['order']) ? $_GET['order'] : 'ads';
		$limit = 10;
		$user = &JFactory::getUser();			
		$uid = $user->id;
		//if (empty($user)){			
		$db = JFactory::getDbo();
		$query = "SELECT * FROM `#__users` ORDER BY `name`";
		$db->setQuery($query);
		$users = $db->loadObjectList();
		$view = $this->getView('chat','html');
		$view->users = $users;
		if(isset($_GET['id']))
		{
			$id=$_GET['id'];
			$order = $_GET['order'];
			$start=($id-1)*$limit;
		}
		if (!empty($user_to) && !empty($user_from)){
			$query = "SELECT * FROM `#__msg_chat` WHERE (id_to=".$user_to." AND id_from=".$user_from.") 
			OR (id_from=".$user_to." AND id_to=".$user_from.") ORDER BY `date` ".$order." LIMIT ".$start.", 10";
			$db->setQuery($query);
			$msg_list = $db->loadObjectList();
			$view->msg_list = $msg_list;
			$view->id_to = $user_to;		
			$view->id_from = $user_from;
			$view->id = $_GET['id'];			
			$query = "SELECT COUNT(*) AS count FROM `#__msg_chat` WHERE (id_to=".$user_to." AND id_from=".$user_from.") 
			OR (id_from=".$user_to." AND id_to=".$user_from.")";
			$db->setQuery($query);
			$count = $db->loadObjectList();
			$view->count = $count[0];
		}
		parent::display();
	}
	public function deleteallmsg(){
		$user_to   = JRequest::getVar('id_to');
		$user_from = JRequest::getVar('id_from');
		$db = JFactory::getDbo();
		$query = "DELETE FROM `#__msg_chat` WHERE id_to=".$user_to." OR id_from=".$user_from;
		$db->setQuery($query);
		echo $result = $db->execute();
	}
	public function deletemsg(){
		$id = isset($_GET['id']) ? (int)($_GET['id']) : 0;
		$db = JFactory::getDbo();
		$query = $db->getQuery(true);
		// delete all custom keys for user 1001.
		$conditions = array(
			$db->quoteName('id') . ' = '.$id
		);
		$query->delete($db->quoteName('#__msg_chat'));
		$query->where($conditions);
		$db->setQuery($query);
		echo $result = $db->execute();
	}
	public function pagination(){
		parent::display();
	}
}