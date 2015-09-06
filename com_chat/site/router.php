<?php
defined('_JEXEC') or die;

/**
 * @param   array
 * @return  array
 */
function ChatBuildRoute(&$query)
{
	$segments = array();

	if (isset($query['view']))
	{
		unset($query['view']);
	}
	return $segments;
}

/**
 * @param   array
 * @return  array
 */
function ChatParseRoute($segments)
{
	$vars = array();

	$params	= array_shift($segments);
	$vars['params'] = $params;
	$vars['view'] = 'Chat';

	return $vars;
}
