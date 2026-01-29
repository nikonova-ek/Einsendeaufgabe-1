<?php

declare(strict_types=1);
// Antwortformat auf JSON setzen
header('Content-Type: application/json; charset=utf-8');
// Nur POST-Anfragen erlauben
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Nur POST erlaubt']);
  exit;
}
// JSON-Daten aus dem Request-Body lesen und dekodieren
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Ungültiges JSON']);
  exit;
}
// Eingabedaten (postId und Kommentar) validieren
$postId  = isset($data['postId']) ? trim((string)$data['postId']) : '';
$comment = isset($data['comment']) ? trim((string)$data['comment']) : '';

if ($postId === '' || $comment === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'postId und comment sind Pflichtfelder']);
  exit;
}

if (mb_strlen($comment) > 500) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Kommentar ist länger als 500 Zeichen']);
  exit;
}

// Nur bekannte Post-IDs zulassen
$allowed = ['post-1', 'post-2'];
if (!in_array($postId, $allowed, true)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Unbekannte postId']);
  exit;
}

// Speicherort für die JSON-Datei festlegen
$dir  = __DIR__ . DIRECTORY_SEPARATOR . 'data';
$file = $dir . DIRECTORY_SEPARATOR . 'comments.json';

if (!is_dir($dir)) {
  mkdir($dir, 0755, true);
}

// Bestehende Kommentare laden oder neu initialisieren
$comments = [];
if (file_exists($file)) {
  $existing = json_decode((string)file_get_contents($file), true);
  if (is_array($existing)) $comments = $existing;
}

if (!isset($comments[$postId]) || !is_array($comments[$postId])) {
  $comments[$postId] = [];
}
// Neuen Kommentar mit Zeitstempel speichern
$comments[$postId][] = [
  'text' => $comment,
  'ts'   => date('c'),
  'ip'   => $_SERVER['REMOTE_ADDR'] ?? null,
];

// JSON-Datei mit Dateisperre sicher überschreiben
$json = json_encode($comments, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);


$fp = fopen($file, 'c+');
if (!$fp) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Datei kann nicht geöffnet werden']);
  exit;
}
flock($fp, LOCK_EX);
ftruncate($fp, 0);
rewind($fp);
fwrite($fp, $json);
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);
// Erfolgsantwort an den Client senden
echo json_encode(['ok' => true]);
