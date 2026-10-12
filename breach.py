
import hashlib
import requests


API_URL = "https://api.pwnedpasswords.com/range/"


def check_password_breach(password):
    if not isinstance(password, str):
        raise TypeError("Password must be a string")

    if not password:
        return {
            "checked": False,
            "breached": False,
            "count": 0,
            "message": "Enter a password to check."
        }

    sha1_hash = hashlib.sha1(
        password.encode("utf-8")
    ).hexdigest().upper()

    prefix = sha1_hash[:5]
    suffix = sha1_hash[5:]

    try:
        response = requests.get(
            API_URL + prefix,
            headers={"Add-Padding": "true"},
            timeout=10
        )
        response.raise_for_status()

    except requests.RequestException:
        return {
            "checked": False,
            "breached": False,
            "count": 0,
            "message": "Breach check unavailable. Please try again."
        }

    for line in response.text.splitlines():
        parts = line.split(":")

        if len(parts) != 2:
            continue

        returned_suffix, count = parts

        if returned_suffix.upper() == suffix:
            return {
                "checked": True,
                "breached": True,
                "count": int(count),
                "message": "This password was found in known breaches."
            }

    return {
        "checked": True,
        "breached": False,
        "count": 0,
        "message": "No match found in the queried breach dataset."
    }
