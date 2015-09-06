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
		parent::display();
	}
	public function getAjax()
	{
		$user = &JFactory::getUser();
		$uid = $user->id;
		$db = JFactory::getDbo();
		$helper = new comChatHelper();
		switch ($_GET['type']) {
			case "users":
				$query = "SELECT * FROM `#__users` WHERE id<>'".$uid."' ORDER BY `name`"; //TIMESTAMPDIFF(MINUTE, lastvisitDate, NOW()) > 2  AND 
				$db->setQuery($query);
				$result = $db->loadObjectList();
				$i=0;
				if ($result){
					$endTime = new DateTime();
					foreach($result as $res){
						$time = new Datetime($res->lastvisitDate);
						$diff = $endTime->diff($time);
						$arr[$i] = $res;
						$arr[$i]->avatar = $helper->getAvatar($res->id);
						$arr[$i]->time1 = $endTime; /*test*/
						$arr[$i]->time2 = $time;
						$arr[$i]->diff = $diff;
						if ($diff->h==0 && $diff->days==0 && $diff->y==0){
							$arr[$i]->online = ($diff->format('%i')>2) ? false : true;
						}
						else{
							$arr[$i]->online = false;
						}
						$query = 'SELECT COUNT(id) AS count FROM `#__msg_chat` WHERE `id_to`='.$uid.' 
						AND `id_from`='.$res->id.' AND `hide`=0 AND `read`=0 ORDER BY date';
						$db->setQuery($query);
						$new_msg = $db->loadObjectList();
						if ($new_msg){
							foreach($new_msg as $msg){
								$arr[$i]->new_msg = $msg->count;
							}
						}
						$query = 'SELECT * FROM `#__msg_chat` WHERE (`id_to`='.$uid.' AND `id_from`='.$res->id.')
						OR (`id_from`='.$uid.' AND `id_to`='.$res->id.') AND `hide`=0
						ORDER BY id DESC LIMIT 1';
						$db->setQuery($query);
						$msg = $db->loadObjectList();
						if ($msg){
							foreach($msg as $msg){
								//$arr[$i]->new_msg = $msg->count;
								$arr[$i]->msg = $msg->msg;
							}
						}
						$i++;						
					}
				}		
				echo json_encode($arr);
			break;
			case "hide":
				$db = JFactory::getDbo();
				$query = $db->getQuery(true);				 
				$fields = array(
					$db->quoteName('hide').' = 1',
				);				 
				$conditions = array(
					$db->quoteName('id') . ' = '.$_GET["id"], 
				);				 
				$query->update($db->quoteName('#__msg_chat'))->set($fields)->where($conditions);				 
				$db->setQuery($query);				 
				echo $db->query() ? $db->query() : ''; 
			break;
			case "getmsg":
				$subquery = $_POST['deltaId'] ? 'AND id<='.$_POST['deltaId'] : '';
				$startFrom = ($_POST['startFrom'] ? $_POST['startFrom'] : 0);
				$query = 'SELECT * from `#__msg_chat` WHERE (id_from='.$uid.' AND id_to='.$_POST['id'].') OR (id_from='.$_POST['id'].' AND id_to='.$uid.') 
				'.$subquery.' ORDER BY id DESC LIMIT '.$startFrom.',10';
				$db->setQuery($query);
				$result = $db->loadObjectList();

				if ($result){
					if (!$startFrom) $c = count($result);
					foreach($result as $res){
						$res->date = "<br>".date("d.m.Y (H:i)",$res->date);	
						$res->test=$query;
						if (!$startFrom) $arr[--$c] = $res; else $arr[] = $res;
					}
					echo json_encode($arr);
				}
				else{
					 $arr[]['startFrom'] = $startFrom;
					 echo json_encode($arr);
				}
			break;
			case "update":
				$query = 'SELECT * from `#__msg_chat` WHERE (`id_from`='.$_POST['id_to'].' AND `id_to`='.$uid.' AND `id` > '.$_POST['id_last'].') ORDER BY `date`';
				$db->setQuery($query);
				$result = $db->loadObjectList();

				if ($result){
					foreach($result as $res){
						$res->date = "<br>".date("d.m.Y (H:i)",$res->date);	
						$arr[] = $res;
					}
				}
				$id_to = $_POST['id_to'];
				$query = "SELECT name FROM `#__users` WHERE TIMESTAMPDIFF(MINUTE, lastvisitDate, NOW()) <= 2 AND id=".$id_to."";
				$db->setQuery($query);
				$result = $db->loadObjectList();
				
				if ($result){
					foreach($result as $res){
						$arr[]['status'] = 'online';
					}
				}
				else{
					$arr[]['status'] = 'offline';					
				}
				
				$query = 'SELECT id from `#__msg_chat` WHERE (`id_from`='.$_POST['id_to'].' AND `id_to`='.$uid.' AND `hide`=1 AND `read`=0) ORDER BY `date`';
				$db->setQuery($query);
				$result = $db->loadObjectList();

				if ($result){
					foreach($result as $res){
						$arr[]['hide'] = $res;
					}
				}				
				echo $arr ? json_encode($arr) : ''; 
			break;
			case "sendmsg":
				$query = 'SELECT * from `#__msg_chat` WHERE (id_from='.$_POST['id_to'].' AND id_to='.$uid.' AND `id` > '.$_POST['id_last'].' ) ORDER BY `date`';
				$db->setQuery($query);
				$result = $db->loadObjectList();

				if ($result){
					foreach($result as $res){
						$res->date = "<br>".date("d.m.Y (H:i)",$row["date"]);	
						$arr[] = $res;
					}
				}
				
				$msg = new stdClass();
				$msg->id_from = $uid;
				$msg->id_to=$_POST['id_to'];
				$msg->msg=$_POST['msg'];
				$msg->date=$_POST['date'];
				$result = JFactory::getDbo()->insertObject('#__msg_chat', $msg);
				$res = $db->insertid();
				$arr[]["last_id"]=$db->insertid();	
				
				$status = new stdClass();
				$status->id=$uid;
				$status->lastvisitDate=date('Y-m-d H:i:s');
				$result = JFactory::getDbo()->updateObject('#__users', $status, 'id');
				echo ($res) ? (($arr) ? json_encode($arr) : json_encode($arr)) : json_encode('error'); 
				
			break;
			case "readmsg":
				$db = JFactory::getDbo();
				$query = $db->getQuery(true);				 
				$fields = array(
					$db->quoteName('read').' = 1',
				);				 
				$conditions = array(
					$db->quoteName('id') . ' <= '.$_POST["id"], 
					$db->quoteName('id_to') . ' = ' .$uid,
				);				 
				$query->update($db->quoteName('#__msg_chat'))->set($fields)->where($conditions);				 
				$db->setQuery($query);				 
				$result = $db->execute();
				$query = 'SELECT * from `#__msg_chat` WHERE id='.$_POST['id'].' AND `read`=1';
				$db->setQuery($query);
				$row = $db->loadRow(); 
				echo ($row) ? 'ok' : '';	
			break;
			case "uploadfile":
				if(isset($_FILES["FileInput"]) && $_FILES["FileInput"]["error"]== UPLOAD_ERR_OK)
				{
					$UploadDirectory	= dirname( __FILE__ ) . '/uploads/'; 
					if (!isset($_SERVER['HTTP_X_REQUESTED_WITH'])){
						die();
					}
					//Is file size is less than allowed size.
					if ($_FILES["FileInput"]["size"] > 5242880) {
						die("File size is too big!");
					}					
					//allowed file type Server side check
					switch(strtolower($_FILES['FileInput']['type']))
						{
							//allowed file types
							case 'image/png': 
							case 'image/gif': 
							case 'image/jpeg': 
							case 'image/pjpeg':
							case 'text/plain':
							case 'text/html': //html file
							case 'application/x-zip-compressed':
							case 'application/pdf':
							case 'application/msword':
							case 'application/vnd.ms-excel':
							case 'video/mp4':
								break;
							default:
								die('Unsupported File!'); //output error
					}
					
					$File_Name          = strtolower($_FILES['FileInput']['name']);
					$File_Ext           = substr($File_Name, strrpos($File_Name, '.')); //get file extention
					$Random_Number      = rand(0, 9999999999); //Random number to be added to name.
					$NewFileName 		= $Random_Number.$File_Ext; //new file name
					
					if(move_uploaded_file($_FILES['FileInput']['tmp_name'], $UploadDirectory.$NewFileName ))
					   {
						die($NewFileName);
					}else{
						die('Error uploading File!');
					}
					
				}
				else
				{
					die('Error! Something wrong with upload! Is "upload_max_filesize" set correctly?');
				}				
			break;
		}
	}
}