<?php
$behaviorId = $_REQUEST["behaviorId"];
$behavior_json = file_get_contents("../json/behavior.json", true);
$all_behaviors = JSON_decode($behavior_json, true);
$behavior_info = $all_behaviors["behavior"][$behaviorId];
echo json_encode($behavior_info);
?>
