#!/usr/bin/env python3
"""Flask server for Wheel of Wander.

Serves the static site plus a small JSON API that stores every wheel's
destinations and spin history in a single file on the server, so both
of you always see the same data — nothing lives in the browser anymore
(except your personal filter selections).

There are two wheels, each with its own destination list and history:
  - "holidays"  : whole-country holiday destinations
  - "citytrips" : city trips in and around Europe

Storage: data/db.json next to this file by default; override the
directory with the HOLIDAY_DATA_DIR environment variable (the systemd
unit sets it to /var/lib/holiday-picker). On first run each wheel is
seeded from its seed-*.json file.

Run directly for a quick start:

    python3 server.py            # serves on http://0.0.0.0:8000
"""
import json
import os
import threading
import uuid
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, abort, jsonify, request, send_from_directory

ROOT = Path(__file__).parent.resolve()
DATA_DIR = Path(os.environ.get("HOLIDAY_DATA_DIR", str(ROOT / "data")))
DB_FILE = DATA_DIR / "db.json"

WHEEL_SEEDS = {
    "holidays": ROOT / "seed-destinations.json",
    "citytrips": ROOT / "seed-citytrips.json",
}

BUDGETS = {"low", "mid", "high"}
DISTANCES = {"regional", "europe", "longhaul"}
VIBES = {"nature", "culture", "food", "winter"}
SEASONS = {"spring", "summer", "autumn", "winter"}
PARTIES = {"couple", "group"}
HISTORY_LIMIT = 50

app = Flask(__name__)
_lock = threading.Lock()


# ── Storage ──────────────────────────────────────────────────────────
def load_db():
    if DB_FILE.exists():
        db = json.loads(DB_FILE.read_text(encoding="utf-8"))
        # Migrate the pre-wheels layout (flat destinations/history)
        if "wheels" not in db:
            db = {"wheels": {"holidays": {
                "destinations": db.get("destinations", []),
                "history": db.get("history", []),
            }}}
    else:
        db = {"wheels": {}}
    # Seed any wheel that doesn't exist yet
    changed = False
    for wheel, seed in WHEEL_SEEDS.items():
        if wheel not in db["wheels"]:
            db["wheels"][wheel] = {
                "destinations": json.loads(seed.read_text(encoding="utf-8")),
                "history": [],
            }
            changed = True
    if changed:
        save_db(db)
    return db


def save_db(db):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    tmp = DB_FILE.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(DB_FILE)


def wheel_data(db, wheel):
    if wheel not in WHEEL_SEEDS:
        abort(404, description=f"unknown wheel '{wheel}'")
    return db["wheels"][wheel]


# ── Validation ───────────────────────────────────────────────────────
def clean_destination(payload, existing=None):
    """Normalise and validate a destination payload; raises ValueError."""
    base = existing or {}
    if not isinstance(payload, dict):
        raise ValueError("expected a JSON object")

    name = str(payload.get("name", base.get("name", ""))).strip()[:60]
    if not name:
        raise ValueError("name is required")

    def subset(key, allowed, fallback):
        values = payload.get(key, base.get(key, fallback))
        if not isinstance(values, list):
            return fallback
        values = [v for v in values if v in allowed]
        return values or fallback

    budget = payload.get("budget", base.get("budget", "mid"))
    distance = payload.get("distance", base.get("distance", "europe"))
    return {
        "id": base.get("id") or "d-" + uuid.uuid4().hex[:10],
        "name": name,
        "flag": (str(payload.get("flag", base.get("flag", "📍"))).strip() or "📍")[:28],
        "budget": budget if budget in BUDGETS else "mid",
        "distance": distance if distance in DISTANCES else "europe",
        "vibes": subset("vibes", VIBES, ["nature"]),
        "seasons": subset("seasons", SEASONS, sorted(SEASONS)),
        "party": subset("party", PARTIES, sorted(PARTIES)),
        "favorite": bool(payload.get("favorite", base.get("favorite", False))),
        "enabled": bool(payload.get("enabled", base.get("enabled", True))),
    }


# ── Destinations API ─────────────────────────────────────────────────
@app.get("/api/wheels/<wheel>/destinations")
def list_destinations(wheel):
    with _lock:
        return jsonify(wheel_data(load_db(), wheel)["destinations"])


@app.post("/api/wheels/<wheel>/destinations")
def create_destination(wheel):
    try:
        dest = clean_destination(request.get_json(force=True, silent=True))
    except ValueError as err:
        abort(400, description=str(err))
    with _lock:
        db = load_db()
        wheel_data(db, wheel)["destinations"].append(dest)
        save_db(db)
    return jsonify(dest), 201


@app.put("/api/wheels/<wheel>/destinations/<dest_id>")
def update_destination(wheel, dest_id):
    with _lock:
        db = load_db()
        destinations = wheel_data(db, wheel)["destinations"]
        for i, dest in enumerate(destinations):
            if dest["id"] == dest_id:
                try:
                    updated = clean_destination(request.get_json(force=True, silent=True), existing=dest)
                except ValueError as err:
                    abort(400, description=str(err))
                destinations[i] = updated
                save_db(db)
                return jsonify(updated)
    abort(404, description="destination not found")


@app.delete("/api/wheels/<wheel>/destinations/<dest_id>")
def delete_destination(wheel, dest_id):
    with _lock:
        db = load_db()
        data = wheel_data(db, wheel)
        before = len(data["destinations"])
        data["destinations"] = [d for d in data["destinations"] if d["id"] != dest_id]
        if len(data["destinations"]) == before:
            abort(404, description="destination not found")
        save_db(db)
    return "", 204


# ── History API ──────────────────────────────────────────────────────
@app.get("/api/wheels/<wheel>/history")
def list_history(wheel):
    with _lock:
        return jsonify(wheel_data(load_db(), wheel)["history"])


@app.post("/api/wheels/<wheel>/history")
def add_history(wheel):
    payload = request.get_json(force=True, silent=True) or {}
    name = str(payload.get("name", "")).strip()[:60]
    if not name:
        abort(400, description="name is required")
    entry = {
        "name": name,
        "flag": (str(payload.get("flag", "📍")).strip() or "📍")[:28],
        "date": datetime.now(timezone.utc).isoformat(),
    }
    with _lock:
        db = load_db()
        data = wheel_data(db, wheel)
        data["history"] = ([entry] + data["history"])[:HISTORY_LIMIT]
        save_db(db)
        return jsonify(data["history"]), 201


@app.delete("/api/wheels/<wheel>/history")
def clear_history(wheel):
    with _lock:
        db = load_db()
        wheel_data(db, wheel)["history"] = []
        save_db(db)
    return "", 204


# ── Static site ──────────────────────────────────────────────────────
@app.get("/")
def index():
    return send_from_directory(ROOT, "index.html")


@app.get("/<path:filename>")
def assets(filename):
    # send_from_directory refuses paths that escape ROOT
    return send_from_directory(ROOT, filename)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
