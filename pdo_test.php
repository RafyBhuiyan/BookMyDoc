<?php
$pdo = new PDO("mysql:host=db;port=3306;dbname=bookmydoc3", "root", "", [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);
echo "PDO OK\n";
