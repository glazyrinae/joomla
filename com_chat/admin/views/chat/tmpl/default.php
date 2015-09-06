<?php defined('_JEXEC') or die('Restricted access'); 
JHtml::_('jquery.framework');
$document = &JFactory::getDocument(); 
$href="/administrator/index.php?option=com_chat&id_from=".$_GET['id_from']."&id_to=".$_GET['id_to']."&order=".$_GET['order'];
$total=$this->count;
$total=ceil($total->count/10);?>
<script>
	jQuery(document).ready(function(){
		//e.preventDefault();
		jQuery("#show_msg").show();
		if (jQuery("#from_user").val()==jQuery("#to_user").val())
			jQuery("#show_msg").hide();
		if (!jQuery("#from_user").val() || !jQuery("#to_user").val())
			jQuery("#show_msg").hide();
		if (!jQuery("#from_user").val() && !jQuery("#to_user").val())
			jQuery("#show_msg").hide();	
	});
	
<?php if ($_GET['id_from'] && $_GET['id_to']):?>	
	jQuery(document).ready(function(){	
		jQuery(".date_msg").click(function(){
			window.location = '/administrator/index.php?option=com_chat&id_from=<?=$_GET['id_from']?>&id_to=<?=$_GET['id_to']?>&order=<?=$_GET['order']=='asc' ? 'desc' : 'asc'?>&id=1';
		});
	});
	jQuery(document).on('click',".del-msg",function(e){
		e.preventDefault();
		var _self=jQuery(this);
		var $id=jQuery(this).data('idmsg');
		if ($id=='all'){
			jQuery.get( '/administrator/index.php?option=com_chat&task=deleteallmsg&id_from=<?=$_GET['id_from']?>&id_to=<?=$_GET['id_to']?>',function( data ) {
				if (data)
					//alert('???');
					window.location='/administrator/index.php?option=com_chat&id_from=<?=$_GET['id_from']?>&id_to=<?=$_GET['id_to']?>&order=desc&id=1';
			});
		}
		else{
			jQuery.get( '/administrator/index.php?option=com_chat&task=deletemsg&id_from='+jQuery("#from_user").val()+'&id_to='+jQuery("#to_user").val(),{id:$id},function( data ) {
				if (data)
					_self.closest('tr').remove();
			});
		}
	});
<?endif?>	
	jQuery(document).on('change',"#from_user, #to_user",function(e){
		e.preventDefault();
		jQuery("#show_msg").show();
		if (jQuery("#from_user").val()==jQuery("#to_user").val())
			jQuery("#show_msg").hide();
		if (!jQuery("#from_user").val() || !jQuery("#to_user").val())
			jQuery("#show_msg").hide();
		if (!jQuery("#from_user").val() && !jQuery("#to_user").val())
			jQuery("#show_msg").hide();	
	});
	jQuery(document).on('click',"#show_msg",function(e){
		e.preventDefault();
		window.location = '/administrator/index.php?option=com_chat&id_from='+jQuery("#from_user").val()+'&id_to='+jQuery("#to_user").val()+'&order=desc&id=1';
	})
	
</script>
<div id="j-sidebar-container" class="span3">
	<span class="nav-header">Выберете переписку между пользователем:</span>
    <?php echo $this->sidebar; ?>
	<select id='to_user' class="form-control">
		<option value='' <?=empty($this->id_to) ? 'selected' : ''?>>Выберите пользователя</option>
		<?foreach($this->users as $users):?>
		<option value='<?=$users->id?>' <?php if ($users->id==$_GET['id_to']) {echo 'selected'; $id_to=$_GET['id_to']; $name_to=$users->name; }?>><?=$users->name?></option>
		<?endforeach?>
	</select>
	<span class="nav-header">и пользователем:</span>
    <?php echo $this->sidebar; ?>
	<select id='from_user' class="form-control">
		<option value='' <?=empty($this->id_from) ? 'selected' : ''?>>Выберите пользователя</option>
		<?foreach($this->users as $users):?>
		<option value='<?=$users->id?>' <?php if ($users->id==$_GET['id_from']) {echo 'selected'; $id_from=$_GET['id_from']; $name_from=$users->name; }?>><?=$users->name?></option>
		<?endforeach?>
	</select>
	<br>
	<br>
	<br>
	<button id="show_msg" type="submit" class="btn btn-default">Показать переписку</button>
</div>
<div id="j-main-container" class="span9">
    <form action="<?php echo JRoute::_('index.php?option=com_chat&view=chat'); ?>" method="post" name="adminForm" id="adminForm">
		<table class="table table-striped">
			<?php if ($this->msg_list):?>
			<thead>
				<tr>
					<th>
						<span>Переписка</span>
					</th>
					<th class='date_msg' style="cursor:pointer">Дата сообщения</th>
					<th></th>
				</tr>
			</thead>
			<?endif?>
			<tbody>
				<?foreach($this->msg_list as $msg_list):?>
				<tr>
					<td>
						<h5><?=$msg_list->id_from==$id_from ? $name_from : $name_to?></h5>
						<p><?=$msg_list->msg?></p>
					</td>
					<td>
						<span><?=date('d.m.Y H:i:s',$msg_list->date)?></span>
					</td>
					<td>
						<div class="btn-wrapper">
							<button class="btn btn-small del-msg" data-idmsg=<?=$msg_list->id?>><span class="icon-cancel"></span>Удалить</button>
						</div>
					</td>
				</tr>
				<?endforeach?>
			</tbody>
			<tfoot>
				<tr>
					<td colspan="11">
						<?php if ($this->msg_list):?>
						<div class="pagination pagination-toolbar">
							<ul class="pagination-list">		
								<?php if($this->id-1!=0):?><li ><a href=<?=$href."&id=".($this->id-1)?> class='button'><i class="icon-previous"></i></a></li><?endif?>
								<?php for($i=1;$i<=$total;$i++):?>
								<?php if($i==$this->id):?><li class="active hidden-phone"><a href=<?=$href."&id=".$i?>><?=$i?></a></li>
								<?else:?>
								<li class="hidden-phone"><a href=<?=$href."&id=".$i?>><?=$i?></a></li>
								<?endif?>
								<?endfor;?>
								<?php if($this->id!=$total):?><li><a class="hasTooltip" title="" href=<?=$href."&id=".($this->id+1)?>><i class="icon-next"></i></a>
								</li><?endif?>
							</ul>
						</div>
						<?php endif?>
					</td>
				</tr>
			</tfoot>
		</table>

	
		<input type="hidden" name="task" value="" />
		<input type="hidden" name="boxchecked" value="0" />
		<input type="hidden" name="filter_order" value="<?php echo $listOrder; ?>" />
		<input type="hidden" name="filter_order_Dir" value="<?php echo $listDirn; ?>" />
		<?php echo JHtml::_('form.token'); ?>
	</form>
</div>