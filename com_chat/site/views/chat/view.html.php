<?php
// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport( 'joomla.application.component.view');

if (!class_exists('JViewLegacy')){
    class JViewLegacy extends JView {

    }
}

class ChatViewChat extends JViewLegacy
{
	function display($tpl = null)
	{
		parent::display($tpl);
	}
}