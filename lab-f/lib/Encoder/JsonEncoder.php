<?php

namespace App\Encoder;

class JsonEncoder implements EncoderInterface
{
    public function supports(string $format): bool
    {
        return $format === 'json';
    }

    public function decode(string $data): array
    {
        $decoded = json_decode($data, true);

        if (!is_array($decoded)) {
            return [];
        }

        return $decoded;
    }

    public function encode(array $data): string
    {
        return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}
