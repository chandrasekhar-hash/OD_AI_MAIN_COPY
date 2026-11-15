import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

# Ensure app package is loaded from backend directory, not root app.py
if "" in sys.path:
    sys.path.remove("")
root_dir = os.path.abspath(os.path.join(BASE_DIR, "..", "..", ".."))
if root_dir in sys.path:
    sys.path.remove(root_dir)

import uvicorn

if __name__ == "__main__":
    print("Starting JS Public Website Backend on http://localhost:8003")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8003, reload=False)
