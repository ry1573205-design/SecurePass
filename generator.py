
import secrets
import string


WORDS = [
    "amber", "apple", "breeze", "candle", "cloud",
    "coral", "daisy", "dawn", "falcon", "forest",
    "garden", "harbor", "island", "jungle", "lantern",
    "lemon", "maple", "meadow", "meteor", "ocean",
    "olive", "orbit", "pebble", "planet", "rabbit",
    "rainbow", "river", "silver", "sunset", "tiger",
    "velvet", "violet", "willow", "winter", "yellow"
]


def generate_password(length=16):
    if not isinstance(length, int) or isinstance(length, bool):
        raise TypeError("Length must be an integer")

    if not 12 <= length <= 64:
        raise ValueError("Length must be between 12 and 64")

    alphabet = string.ascii_letters + string.digits + "!@#$%^&*()-_=+"
    required = [
        secrets.choice(string.ascii_lowercase),
        secrets.choice(string.ascii_uppercase),
        secrets.choice(string.digits),
        secrets.choice("!@#$%^&*()-_=+")
    ]

    password_chars = required + [
        secrets.choice(alphabet) for _ in range(length - len(required))
    ]

    secrets.SystemRandom().shuffle(password_chars)

    return "".join(password_chars)


def generate_passphrase(word_count=4):
    if not isinstance(word_count, int) or isinstance(word_count, bool):
        raise TypeError("Word count must be an integer")

    if not 4 <= word_count <= 8:
        raise ValueError("Word count must be between 4 and 8")

    words = [
        secrets.choice(WORDS)
        for _ in range(word_count)
    ]

    return "-".join(words)
