<?php defined('_JEXEC') or die('Restricted access'); ?>

<?php
JHtml::_('jquery.framework');
$document = &JFactory::getDocument(); 
$document->addStyleSheet('components/com_chat/css/Lottery.css');
$user = JFactory::getUser();
$uid = $user->id;

$db = JFactory::getDBO();
$query = "select * from `#__users` where id <> $uid";
$result = $db->setQuery($query);   
$users = $db->loadObjectList();

$n = count($users);
$u1 = rand(0, $n-1);

$u = $users[$u1];

echo "Это профиль пользователя с ID: $u->id";


/*$helper = new comChatHelper();
$r = rand(2,99);
$helper->generationTicket($r);
$ticket=$helper->getTicket($r);
$cnt = json_decode($ticket->cnt);
$b = $ticket->bonus;
$i=0; */
?>
 <a href="/index.php?option=com_chat&id=<?=$u->id?>">demo</a>
<br>