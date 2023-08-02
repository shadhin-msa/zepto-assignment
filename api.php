<?php

$servername = 'localhost';
$username = 'root';
$password = '';
$dbname = 'poster_creator';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// poster data to the database
function savePoster($heading, $description, $image, $headingAlignment, $headingColor) {
  global $servername, $username, $password, $dbname;
  $conn = new mysqli($servername, $username, $password, $dbname);

  if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
  }

  $updateFields = '';
  $insertFields = 'id,';
  $insertValues = '1, ';

  $heading = $conn->real_escape_string($heading);
  $description = $conn->real_escape_string($description);

  if (!empty($heading)) {
    $updateFields .= "heading = '$heading', ";
    $insertFields .= "heading, ";
    $insertValues .= "'$heading', ";
  }

  if (!empty($description)) {
    $updateFields .= "description = '$description', ";
    $insertFields .= "description, ";
    $insertValues .= "'$description', ";
  }

  if (!empty($image)) {
    // Delete previous image file if it exists
    $sql_delete_previous_image = "SELECT image FROM poster LIMIT 1";
    $result = $conn->query($sql_delete_previous_image);
    if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();
      $previous_image = $row['image'];
      if (file_exists($previous_image)) {
        unlink($previous_image);
      }
    }

    if($image !== 'delete') {
      $targetDir = 'uploads/';
      $targetFile = $targetDir . basename($image['name']);
      move_uploaded_file($image['tmp_name'], $targetFile);

    } else {
      $targetFile = '';
    }


    $updateFields .= "image = '$targetFile', ";
    $insertFields .= "image, ";
    $insertValues .= "'$targetFile', ";
  }

  if (!empty($headingAlignment)) {
    $updateFields .= "heading_alignment = '$headingAlignment', ";
    $insertFields .= "heading_alignment, ";
    $insertValues .= "'$headingAlignment', ";
  }

  
  if (!empty($headingColor)) {
    $updateFields .= "heading_color = '$headingColor', ";
    $insertFields .= "heading_color, ";
    $insertValues .= "'$headingColor', ";
  }

  // Trim trailing comma and space from updateFields, insertFields, and insertValues
  $updateFields = rtrim($updateFields, ', ');
  $insertFields = rtrim($insertFields, ', ');
  $insertValues = rtrim($insertValues, ', ');

  $sql = "INSERT INTO poster ($insertFields) VALUES ($insertValues)
          ON DUPLICATE KEY UPDATE $updateFields";

  if ($conn->query($sql) === TRUE) {
    $data = [
      'heading' => $heading,
      'description' => $description,
      'image' => isset($targetFile) ? $targetFile : null,
    ];
    $conn->close();
    return json_encode($data);
  } else {
    $conn->close();
    return json_encode(['error' => 'Failed to save data.']);
  }

}

// gets post data from db
function getPoster() {
  global $servername, $username, $password, $dbname;
  $conn = new mysqli($servername, $username, $password, $dbname);

  if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
  }

  $sql = "SELECT * FROM poster LIMIT 1";
  $result = $conn->query($sql);

  $data = [
    'heading' => '',
    'description' => '',
    'image' => '',
  ];

  if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
    
  }

  return $data; 
}

// API block other entry points
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  // Handle preflight requests for CORS
  header('HTTP/1.1 200 OK');
  exit();
}

// API entry points
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // Retrieve poster data from the database
  $responseData = getPoster();

  echo json_encode($responseData);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  $heading = isset($_POST['heading']) ? $_POST['heading'] : '';
  $description = isset($_POST['description']) ? $_POST['description'] : '';
  $headingAlignment = isset($_POST['headingAlignment']) ? $_POST['headingAlignment'] : null;
  $headingColor = isset($_POST['headingColor']) ? $_POST['headingColor'] : null;

  if(isset($_POST['image'])) {
    $image = isset($_POST['image']) ? $_POST['image'] : null;
  } else {
    $image = isset($_FILES['image']) ? $_FILES['image'] : null;
  }

  if (!empty($heading) || !empty($description) || !empty($image) || !empty($headingAlignment) || !empty($headingColor) ) {
    $response = savePoster($heading, $description, $image, $headingAlignment, $headingColor);
    $responseData = [
      'status' => 'success',
      'message' => 'Data received successfully.',
      'data' => $response,
    ];
  } else {
    $responseData = [
      'status' => 'error',
      'message' => $headingAlignment,
      'data' => null,
    ];
  }

  echo json_encode($responseData);
} else {
  // Invalid request method
  $responseData = [
    'status' => 'error',
    'message' => 'Invalid request method. Only POST requests are allowed.',
    'data' => null,
  ];

  echo json_encode($responseData);
}
