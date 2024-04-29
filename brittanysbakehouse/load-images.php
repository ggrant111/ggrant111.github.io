<?php
$directory = "assets/";
$images = glob($directory . "*.jpg");
echo json_encode($images);
?>
