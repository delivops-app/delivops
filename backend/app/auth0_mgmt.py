import os, time
import httpx

DOMAIN = os.getenv("AUTH0_DOMAIN")
CLIENT_ID = os.getenv("AUTH0_MGMT_CLIENT_ID")
CLIENT_SECRET = os.getenv("AUTH0_MGMT_CLIENT_SECRET")
DB_CONNECTION = os.getenv("AUTH0_DB_CONNECTION")

_token_cache = {"value": None, "exp": 0}

async def _get_mgmt_token():
    now = time.time()
    if _token_cache["value"] and _token_cache["exp"] > now:
        return _token_cache["value"]
    url = f"https://{DOMAIN}/oauth/token"
    data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "audience": f"https://{DOMAIN}/api/v2/",
        "grant_type": "client_credentials",
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(url, json=data, timeout=15)
        resp.raise_for_status()
        out = resp.json()
    _token_cache["value"] = out["access_token"]
    _token_cache["exp"] = now + out.get("expires_in", 840) - 60
    return _token_cache["value"]

async def create_user(email: str, org_id: str, driver_id: str, blocked: bool = True):
    token = await _get_mgmt_token()
    url = f"https://{DOMAIN}/api/v2/users"
    payload = {
        "connection": DB_CONNECTION,
        "email": email,
        "password": "Temp1234!",  # sera remplacé via email reset
        "email_verified": False,
        "blocked": blocked,
        "app_metadata": {
            "org_id": org_id,
            "driver_id": driver_id,
            "status": "pending"
        }
    }
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        r = await client.post(url, json=payload, headers=headers, timeout=15)
        r.raise_for_status()
        return r.json()

async def send_password_reset_email(email: str):
    token = await _get_mgmt_token()
    url = f"https://{DOMAIN}/dbconnections/change_password"
    payload = {"email": email, "connection": DB_CONNECTION}
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        r = await client.post(url, json=payload, headers=headers, timeout=15)
        r.raise_for_status()
        return True

async def set_user_blocked(user_id: str, blocked: bool):
    token = await _get_mgmt_token()
    url = f"https://{DOMAIN}/api/v2/users/{user_id}"
    payload = {"blocked": blocked}
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        r = await client.patch(url, json=payload, headers=headers, timeout=15)
        r.raise_for_status()
        return r.json()

async def update_app_metadata(user_id: str, app_metadata: dict):
    token = await _get_mgmt_token()
    url = f"https://{DOMAIN}/api/v2/users/{user_id}"
    payload = {"app_metadata": app_metadata}
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        r = await client.patch(url, json=payload, headers=headers, timeout=15)
        r.raise_for_status()
        return r.json()

async def assign_role(user_id: str, role_name: str):
    token = await _get_mgmt_token()
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        roles_resp = await client.get(f"https://{DOMAIN}/api/v2/roles", headers=headers, timeout=15)
        roles_resp.raise_for_status()
        roles = roles_resp.json()
        role = next((r for r in roles if r["name"] == role_name), None)
        if not role:
            raise RuntimeError(f"Role {role_name} not found")
        assign_url = f"https://{DOMAIN}/api/v2/users/{user_id}/roles"
        r = await client.post(assign_url, json={"roles": [role["id"]]}, headers=headers, timeout=15)
        r.raise_for_status()
        return True
