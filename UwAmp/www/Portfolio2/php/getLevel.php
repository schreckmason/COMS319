<?php
   $level_num = intval($_REQUEST["level_num"]);
   $levels_json = file_get_contents("../levels.json");
   $all_levels_info = JSON_decode($levels_json, true);
   $level_info = $all_levels_info["levels"][$level_num];
   $defaults = $all_levels_info["defaults"];
   // Any unspecified properties get filled in with defaults (reduces redendancy)
   $level_info = array_merge($defaults, $level_info);
   foreach ($level_info["blockGroups"] as &$block_group) {
      $block_group = array_merge($defaults["blockGroups"], $block_group);
   }
   echo json_encode($level_info);
?>