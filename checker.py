
import math
import re
from zxcvbn import zxcvbn


def analyze_password(password):
    if not isinstance(password, str):
        raise TypeError("Password must be a string")

    if not password:
        return {
            "score": 0,
            "strength": "Very Weak",
            "length": 0,
            "entropy_bits": 0,
            "crack_time": "No password entered",
            "suggestions": ["Enter a password to analyze."]
        }

    result = zxcvbn(password)
    score = result["score"] * 25

    pool = 0

    if re.search(r"[a-z]", password):
        pool += 26
    if re.search(r"[A-Z]", password):
        pool += 26
    if re.search(r"[0-9]", password):
        pool += 10
    if re.search(r"[^a-zA-Z0-9]", password):
        pool += 33

    entropy = len(password) * math.log2(pool) if pool else 0

    suggestions = result.get("feedback", {}).get("suggestions", [])

    suggestions = list(suggestions)

    if len(password) < 12:
        suggestions.append("Use a longer password, preferably 12 or more characters.")

    if not re.search(r"[A-Z]", password):
        suggestions.append("Consider adding uppercase letters.")

    if not re.search(r"[a-z]", password):
        suggestions.append("Consider adding lowercase letters.")

    if not re.search(r"[0-9]", password):
        suggestions.append("Consider adding numbers.")

    if not re.search(r"[^a-zA-Z0-9]", password):
        suggestions.append("Consider adding symbols.")

    labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"]

    crack_time = result.get("crack_times_display", {}).get(
        "offline_slow_hashing_1e4_per_second",
        "Unknown"
    )

    return {
        "score": score,
        "strength": labels[result["score"]],
        "length": len(password),
        "entropy_bits": round(entropy, 2),
        "crack_time": crack_time,
        "suggestions": list(dict.fromkeys(suggestions))
    }
