<?php

namespace App\Encoder;

class YamlEncoder implements EncoderInterface
{
    public function supports(string $format): bool
    {
        return $format === 'yaml';
    }

    public function decode(string $data): array
    {
        $decoded = yaml_parse($data);

        if (!is_array($decoded)) {
            return [];
        }

        return $decoded;
    }

    public function encode(array $data): string
    {
        return yaml_emit($data);
    }
}
