"""
Load the package.json to get the current version of the package for the installer
"""

import json
from pathlib import Path

try:
    # Loading package.json
    package_json_path = Path(__file__).parent.parent / "package.json"
    with package_json_path.open(encoding="utf-8") as f:
        data = json.load(f)

    # to get current version
    __version__ = data["version"]
except Exception as e: # pylint: disable=broad-exception-caught
    __version__ = "0.0.0"
