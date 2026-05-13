<?php

namespace App\Encoder;

class CsvEncoder implements EncoderInterface
{
    private string $format;

    public function __construct(string $format = 'csv')
    {
        $this->format = $format;
    }

    public function supports(string $format): bool
    {
        return $this->format === $format;
    }

    public function decode(string $data): array
    {
        $separator = $this->getSeparator();

        $lines = array_filter(
            explode(PHP_EOL, trim($data)),
            fn(string $line): bool => trim($line) !== ''
        );

        if (empty($lines)) {
            return [];
        }

        $headers = str_getcsv(array_shift($lines), $separator, '"', '\\');
        $result = [];

        foreach ($lines as $line) {
            $values = str_getcsv($line, $separator, '"', '\\');
            $result[] = array_combine($headers, $values);
        }

        return $result;
    }

    public function encode(array $data): string
    {
        if (empty($data)) {
            return '';
        }

        $separator = $this->getSeparator();

        $headers = array_keys($data[0]);
        $lines = [];
        $lines[] = implode($separator, $headers);

        foreach ($data as $row) {
            $lines[] = implode($separator, $row);
        }

        return implode(PHP_EOL, $lines);
    }

    private function getSeparator(): string
    {
        return match ($this->format) {
            'csv' => ',',
            'ssv' => ';',
            'tsv' => "\t",
            default => ',',
        };
    }
}
