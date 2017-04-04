<?php
   $level_num = intval($_REQUEST["level_num"]);
   $levels_json = file_get_contents("../levels.json");
   $all_levels_info = JSON_decode($levels_json, true);
   $level_info = $all_levels_info["levels"][$level_num];
   $defaults = $all_levels_info["defaults"];
   foreach ($level_info["blockGroups"] as &$block_group) {
      // Any unspecified properties get filled in with defaults (reduces redendancy)
      $block_group = array_merge($defaults, $block_group);
   }
   echo json_encode($level_info);
?>