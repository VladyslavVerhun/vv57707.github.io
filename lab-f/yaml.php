<?php // I:\ptw\lab-f\yaml.php

$data = [
    'name' => 'Verhun Vladyslav',
    'index' => '57707',
    'date' => date(DATE_ATOM),
];

$yaml = yaml_emit($data);

echo $yaml;