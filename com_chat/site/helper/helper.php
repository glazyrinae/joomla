<?php
defined('_JEXEC') or die('(@)|(@)');
 
class comChatHelper
{
	function GetFieldValue($field_id, $uid)
	{
		$db = JFactory::getDBO();
		$query = "select value from `#__extrareg_fields_values` where field_id = $field_id and uid = $uid";
		$result = $db->setQuery($query);
		return $db->loadResult();
	}

	function GetOption($option)
	{
		$db = JFactory::getDBO();
		$query = "select value from `#__extrareg_options` where `option` = '$option'";
		$result = $db->setQuery($query);  
		$result = $db->loadResult();
		return $result;
	}

	public function getAvatar($id_user){	
		if (JComponentHelper::getComponent('com_extraregistration', true)->enabled){
			$uid = $id_user; //текущий пользователь
			$fid = $this->GetOption('pic_id');
			return $image_url = $this->GetFieldValue($fid, $uid);
		}
		else
			return "";
	} 
}
