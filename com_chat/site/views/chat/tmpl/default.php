<?php defined('_JEXEC') or die('Restricted access'); ?>

<?php
JHtml::_('jquery.framework');
$document = &JFactory::getDocument();
$document->addScript( 'components/com_chat/js/jquery.slimscroll.min.js' );   
$document->addScript( 'components/com_chat/js/jquery.form.min.js' ); 
$document->addScript( 'components/com_chat/js/jquery.emotions.js' ); 
$document->addScript( 'components/com_chat/js/index.js' ); 
$document->addStyleSheet('components/com_chat/css/main.css');
$document->addStyleSheet('components/com_chat/css/jquery.emotions.fb.css');
$document->addStyleSheet('components/com_chat/css/bootstrap.min.css');
$document->addStyleSheet('components/com_chat/css/uploadify.css"');
$scripts = $document->_scripts;
if (is_array($scripts) && !empty($scripts)) {
    $first_scripts = array();
	foreach ($scripts as $key => $script) {
		if (strpos($key, 'caption.js')!== false) {
		    $first_scripts[$key] = $script;
			unset($scripts[$key]);
		}
	}

	if (!empty($first_scripts)) {
		$scripts = $first_scripts + $scripts;
	}
}
$doc->_scripts = $scripts;
defined('_JEXEC') or die;
?>
<div class="module" style="width:100%;height:615px;border:1px solid #5780AB;">
	<div id="title" style="width:100%;height:50px;background:#5780AB"></div>
	<div id="wrapper">
		<div class="table" >
			<div class="thead" style="border-bottom:1px solid #e4e8ed">
				<div>
					<div><a class="list_user" href="">Пользователи</a></div>
				</div>
			</div>
			<div id="content_msg" >
			</div>
			<div class="tfoot" >
				<div>
					<div style="padding:4px 10px;">
						<div class="chat-input" >
							<img src="components/com_chat/images/smiles.png" id="smilesBtn" style="float:left;margin-left:-5px;padding-top:10px;padding-right:3px;">
							<div id="smilesChoose">o:) o.O 3:) :D <3 :* :) 8| :/ ;) :'( :( 8) >:( :p</div>
							<textarea id="search" type="text" class="form-control" placeholder="..." style="float:left;height:40px;border:none" ></textarea>
							<form action="index.php?option=com_chat&task=getajax&format=raw&type=uploadfile" method="post" enctype="multipart/form-data" id="MyUploadForm" style="float:left;height:20px;width:20px;margin-left:-2px;padding-top:10px;cursor:pointer">					
								<label id="label_file">
									<input name="FileInput" id="FileInput" onchange="jQuery('#MyUploadForm').trigger('submit')" type="file" />
								</label>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>