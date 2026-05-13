<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Konwerter danych</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 30px;
        }

        form {
            display: grid;
            gap: 12px;
            max-width: 900px;
        }

        textarea {
            width: 100%;
            height: 180px;
            font-family: monospace;
        }

        select, button {
            padding: 6px;
        }

        .row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        pre {
            background: #f2f2f2;
            padding: 12px;
            min-height: 120px;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>

<h1>Konwerter danych</h1>

<form method="post">
    <div class="row">
        <div>
            <label for="input_format">Format wejściowy:</label>
            <select name="input_format" id="input_format">
                <option value="csv" <?= $inputFormat === 'csv' ? 'selected' : '' ?>>CSV</option>
                <option value="ssv" <?= $inputFormat === 'ssv' ? 'selected' : '' ?>>SSV</option>
                <option value="tsv" <?= $inputFormat === 'tsv' ? 'selected' : '' ?>>TSV</option>
                <option value="json" <?= $inputFormat === 'json' ? 'selected' : '' ?>>JSON</option>
                <option value="yaml" <?= $inputFormat === 'yaml' ? 'selected' : '' ?>>YAML</option>
            </select>
        </div>

        <div>
            <label for="output_format">Format wyjściowy:</label>
            <select name="output_format" id="output_format">
                <option value="csv" <?= $outputFormat === 'csv' ? 'selected' : '' ?>>CSV</option>
                <option value="ssv" <?= $outputFormat === 'ssv' ? 'selected' : '' ?>>SSV</option>
                <option value="tsv" <?= $outputFormat === 'tsv' ? 'selected' : '' ?>>TSV</option>
                <option value="json" <?= $outputFormat === 'json' ? 'selected' : '' ?>>JSON</option>
                <option value="yaml" <?= $outputFormat === 'yaml' ? 'selected' : '' ?>>YAML</option>
            </select>
        </div>
    </div>

    <div>
        <label for="input_data">Dane wejściowe:</label>
        <textarea name="input_data" id="input_data"><?= htmlspecialchars($inputData) ?></textarea>
    </div>

    <button type="submit">Convert</button>
</form>

<h2>Wynik:</h2>
<pre><?= htmlspecialchars($outputData) ?></pre>

</body>
</html>
