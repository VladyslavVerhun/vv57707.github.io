<?php

require_once __DIR__ . '/autoload.php';

use App\Encoder\CsvEncoder;
use App\Encoder\JsonEncoder;
use App\Encoder\Serializer;
use App\Encoder\YamlEncoder;

$inputFormat = $_COOKIE['input_format'] ?? 'csv';
$outputFormat = $_COOKIE['output_format'] ?? 'json';
$inputData = $_COOKIE['input_data'] ?? '';
$outputData = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputFormat = $_POST['input_format'] ?? 'csv';
    $outputFormat = $_POST['output_format'] ?? 'json';
    $inputData = $_POST['input_data'] ?? '';

    setcookie('input_format', $inputFormat, time() + 3600);
    setcookie('output_format', $outputFormat, time() + 3600);
    setcookie('input_data', $inputData, time() + 3600);

    $serializer = new Serializer([
        new CsvEncoder('csv'),
        new CsvEncoder('ssv'),
        new CsvEncoder('tsv'),
        new JsonEncoder(),
        new YamlEncoder(),
    ]);

    try {
        $outputData = $serializer->convert($inputData, $inputFormat, $outputFormat);
    } catch (Throwable $exception) {
        $outputData = 'Błąd: ' . $exception->getMessage();
    }
}

require __DIR__ . '/templates/layout.php';