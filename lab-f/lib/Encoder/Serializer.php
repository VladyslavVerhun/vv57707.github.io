<?php

namespace App\Encoder;

class Serializer
{
    /**
     * @param EncoderInterface[] $encoders
     */
    public function __construct(private array $encoders)
    {
    }

    public function convert(string $data, string $inputFormat, string $outputFormat): string
    {
        $inputEncoder = $this->findEncoder($inputFormat);
        $outputEncoder = $this->findEncoder($outputFormat);

        $decoded = $inputEncoder->decode($data);

        return $outputEncoder->encode($decoded);
    }

    private function findEncoder(string $format): EncoderInterface
    {
        foreach ($this->encoders as $encoder) {
            if ($encoder->supports($format)) {
                return $encoder;
            }
        }

        throw new \InvalidArgumentException("Nieobsługiwany format: {$format}");
    }
}
