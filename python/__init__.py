import json
from pathlib import Path
from importlib import resources

try:
    # Loading package.json
    package_json_path = Path(__file__).parent.parent / "package.json"
    with package_json_path.open(encoding="utf-8") as f:
        data = json.load(f)
    
    # to get current version
    __version__ = data["version"]
except Exception as e:
    __version__ = "0.0.0"
