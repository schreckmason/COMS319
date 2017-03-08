<?php
/**
 * Server-side file.
 * It gets the file data.txt's last-changed timestamp, checks if this is
 * larger than the timestamp of the * AJAX-submitted timestamp (time of
 * last ajax request), and if so, it sends back a JSON with the data from
 * data.txt (and a timestamp). Else, it sends back a string. 
 *
 * Note: This returns a JSON, containing the content of data.txt and the
 * timestamp of the last data.txt change.  
 * This timestamp is used by the client's JavaScript for the next
 * request, so THIS server-side script
 * here only serves new content after the last file change. 
 *
 */

// set php runtime to unlimited

$data_source_file = 'data.txt';


// if ajax request has send a timestamp, 
// then $last_ajax_call = timestamp, 
// else $last_ajax_call = null 
$last_ajax_call 
    = isset($_GET['timestamp']) ? (int)$_GET['timestamp'] : null;


// PHP caches file data, like requesting the size of a file, by default.
// clearstatcache() clears that cache 
clearstatcache();

// get timestamp of when file has been changed the last time
$last_change_in_data_file = filemtime($data_source_file);

// if no timestamp delivered via ajax or data.txt has been changed SINCE
// last ajax timestamp
if ($last_ajax_call == null 
    || $last_change_in_data_file > $last_ajax_call) {

    // get content of data.txt
    $data = file_get_contents($data_source_file);

    // put data.txt's content and timestamp of last data.txt change into array
    $result = array(
        'data_from_file' => $data,
        'timestamp' => $last_change_in_data_file
    );

    // encode to JSON, render the result (for AJAX)
    $json = json_encode($result);
    echo $json;
}
else {
    $json = json_encode("Nothing!");
    echo $json;
}
