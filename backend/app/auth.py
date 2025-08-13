import os, time, json
from typing import List, Optional
import jwt
from jwt.algorithms import RSAAlgorithm
import httpx
from fastapi import HTTPException, Depends, Header

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
AUTH0_AUDIENCE = os.getenv("AUTH0_AUDIENCE")
ISSUER = os.getenv("AUTH0_ISSUER")
CLAIM_NS = os.getenv("AUTH0_CLAIM_NS", "https://delivops.app")

_jwks_cache = {"data": None, "exp": 0}

async def get_jwks():
    now = time.time()
    if _jwks_cache["data"] and _jwks_cache["exp"] > now:
        return _jwks_cache["data"]
    url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, timeout=10)
        resp.raise_for_status()
        jwks = resp.json()
    _jwks_cache["data"] = jwks
    _jwks_cache["exp"] = now + 3600
    return jwks

def _get_key(header, jwks):
    kid = header.get("kid")
    for k in jwks.get("keys", []):
        if k.get("kid") == kid:
            return k
    return None

async def require_auth(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing bearer token")
    token = authorization.split(" ", 1)[1]

    # 1) header non vérifié pour récupérer le kid
    try:
        header = jwt.get_unverified_header(token)
    except Exception as e:
        raise HTTPException(401, f"Invalid token header: {e}")

    # 2) clé publique via JWKS
    jwks = await get_jwks()
    jwk = _get_key(header, jwks)
    if not jwk:
        raise HTTPException(401, "Invalid token header (kid)")

    public_key = RSAAlgorithm.from_jwk(json.dumps(jwk))

    # 3) décodage + vérif audience/issuer
    try:
        payload = jwt.decode(
            token,
            key=public_key,
            algorithms=["RS256"],
            audience=AUTH0_AUDIENCE,
            issuer=ISSUER,
            options={"require": ["exp", "iat"], "verify_aud": True, "verify_signature": True}
        )
    except Exception as e:
        raise HTTPException(401, f"Token invalid: {e}")

    return payload

def require_role(roles_needed: List[str]):
    async def _inner(payload=Depends(require_auth)):
        roles = payload.get(f"{CLAIM_NS}/roles", [])
        if not any(r in roles for r in roles_needed):
            raise HTTPException(403, "Insufficient role")
        return payload
    return _inner
