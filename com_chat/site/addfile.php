<?php
session_start();
$file="uploads/".$_GET["q"];
header('Content-Type: application/octet-stream');
 header('Content-Disposition: filename="'.htmlspecialchars($_GET['q']).'"');
header('Content-length: '.filesize($file));
header('Cache-Control: no-cache');
header("Content-Transfer-Encoding: chunked"); 
readfile($file);
?>