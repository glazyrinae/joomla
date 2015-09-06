<?php defined('_JEXEC') or die( 'Restricted access' );

jimport( 'joomla.application.component.view');

if (JVERSION>=3.0){
    JHtml::_('formbehavior.chosen', 'select');
}

# For compatibility with older versions of Joomla 2.5
if (!class_exists('JViewLegacy')){
    class JViewLegacy extends JView {

    }
}

class ChatViewChat extends JViewLegacy
{
	protected $items;
	protected $pagination;
	function display($tpl = null)
	{
		parent::display($tpl);
	}
}
?>
<script>
</script>