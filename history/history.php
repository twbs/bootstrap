<?php
class less2css {
  
    $host = 'localhost'; // Host name Normally 'LocalHost'
    $user = ''; // MySQL login username
    $pass = ''; // MySQL login password
    $database = 'bootstrap_compiled'; // Database name
     
    mysql_connect($host, $user, $pass);
    mysql_select_db($database);
    mysql_query("SET NAMES UTF8");

  public static function write_less() {

    if($_POST['posted_values']) {
      
      $values_arr = array();
     
     //Cycle all posts and append to array.
      foreach($_POST as $name => $value) {
        if (!empty($value)) {
              $values_arr[$name] = $value;
        }
      }
            
      $values = json_encode($values_arr);
      
    $insert_sql = mysql_query("INSERT INTO `bootstrap_compiled` ('first_name','last_name','email','values','created') VALUES ($_POST['first_name'],$_POST['last_name'],$_POST['email'],$values, NOW()) "); 
     
  }
  return true;
}

  public static function compile($email) {

    $variables = mysql_query("SELECT  `values` FROM  `bootstrap_compiled` WHERE email = $email ORDER BY `id` DESC LIMIT 1");

    $vars = array();
    foreach ($variables as $variable) {
      $vars = (array)json_decode($variable->values);
    }

    $source='../less/variables.less';
    $target='target/variables.less';
    
    // copy operation
    $sh=fopen($source, 'r');
    $th=fopen($target, 'w') or die('Cannot open file:  '.$target); //implicitly creates file


    foreach ($vars as $key => $var){
      while (!feof($sh)) {
          $line=fgets($sh);
          $compare_line = substr(strstr($line, ':', true),1);
          if ($compare_line == $key) {
            unset($line);
            $line ='@'.$key.':'.$var.';'.PHP_EOL;
          }
        fwrite($th, $line);
      }
    }

    fclose($th);
    fclose($sh);

    //compile and return true.
    return true;
  }
}

$less = new less2css();

$less->write_less();

$less->compile();

include '../docs/customize.html';

?>
