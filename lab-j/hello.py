import sys
from flask import Flask

app = Flask(__name__)


@app.route("/")
def hello():
    name = "Vladyslav"
    album = 57707
    python_version = sys.version.split()[0]
    python_path = sys.executable

    return (
        f"Hello {name} ({album}). "
        f"This environment is using Python version {python_version} "
        f"at location {python_path}"
    )


if __name__ == "__main__":
    app.run(port=57707, debug=True)