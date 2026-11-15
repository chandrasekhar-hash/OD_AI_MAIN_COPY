import json
import urllib.request
import urllib.error

BASE = "http://localhost:8002/api/v1"


def req(method, path, data=None, token=None):
    r = urllib.request.Request(BASE + path, method=method)
    r.add_header("Content-Type", "application/json")
    if token:
        r.add_header("Authorization", "Bearer " + token)
    body = json.dumps(data).encode() if data is not None else None
    try:
        with urllib.request.urlopen(r, body) as resp:
            return resp.status, json.loads(resp.read().decode() or "null")
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode() or "null")


# login as admin
s, login = req("POST", "/auth/login", {"username": "admin", "password": "admin123"})
print("login", s, list(login.keys())[:3])
token = login.get("access_token")
if not token:
    s, login = req("POST", "/auth/login", {"username": "admin", "password": "admin"})
    print("login2", s, list(login.keys())[:3])
    token = login.get("access_token")
if not token:
    print("NO TOKEN - cannot test")
    raise SystemExit

# list navbar items
s, items = req("GET", "/admin/website/navbar-items", token=token)
print("list navbar", s, type(items).__name__, len(items) if isinstance(items, list) else items)

# create one
s, item = req(
    "POST",
    "/admin/website/navbar-items",
    {"label": "Test Nav", "url": "/test", "display_order": 99, "is_visible": True},
    token,
)
print("create navbar", s, item.get("id") if isinstance(item, dict) else item)
iid = item.get("id") if isinstance(item, dict) else None

if iid:
    s, upd = req(
        "PUT",
        f"/admin/website/navbar-items/{iid}",
        {"label": "Test Nav Updated", "url": "/updated", "is_visible": False},
        token,
    )
    print("update navbar", s, upd.get("label") if isinstance(upd, dict) else upd)

    s, one = req("GET", f"/admin/website/navbar-items/{iid}", token=token)
    print("get navbar", s, one.get("label") if isinstance(one, dict) else one)

    s, _ = req("DELETE", f"/admin/website/navbar-items/{iid}", token=token)
    print("delete navbar", s)

    s, lst = req("GET", "/admin/website/navbar-items", token=token)
    print("final list len", s, len(lst) if isinstance(lst, list) else lst)
