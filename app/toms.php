<?php

$pinpoint_sample_array = array();

$Total_Tests = 5;

$Total_Students = 25;

for ($student = 1; $student <=$Total_Students; $student++) {
  
$pinpoint_sample_array[$student]['Name'] = 'student ' . $student; 
    
switch (true) {
  case $student > 0 && $student < 10:
    $pinpoint_sample_array[$student]['Class'] = 'Class A';
    break;
  case $student >=10 && $student < 20:
    $pinpoint_sample_array[$student]['Class'] = 'Class B'; 
    break;                 
  default:
    $pinpoint_sample_array[$student]['Class'] = 'Class C';                 
    break;
}
  for ($test_Number = 1; $test_Number <=$Total_Tests; $test_Number++) {

  $pinpoint_sample_array[$student]['Test' . $test_Number] = $student;
  
  }

}

echo json_encode($pinpoint_sample_array);   
//tormod - remove the // to see the table data

?>