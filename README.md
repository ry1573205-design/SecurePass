
# 🔐 SecurePass — Password Strength & Breach Checker

SecurePass is a Python-based web application that helps users evaluate password strength, check passwords against known data breaches, and generate secure passwords or memorable passphrases.

## ✨ Features

- **Password Strength Analyzer:** Evaluates password strength, score, entropy, estimated crack time, and improvement suggestions.
- **Breach Checker:** Checks known password breaches using the Have I Been Pwned Pwned Passwords API and its k-anonymity model.
- **Secure Password Generator:** Generates random passwords using Python's `secrets` module.
- **Passphrase Generator:** Creates memorable passphrases.
- **Responsive Dashboard:** Dark-themed interface built with HTML, CSS, and JavaScript.
- **Automated Tests:** Includes unit tests for password analysis.

## 🛠️ Tech Stack

- Python
- Flask
- HTML5
- CSS3
- JavaScript
- Have I Been Pwned API
- Python `hashlib`, `secrets`, and `unittest`

## 📁 Project Structure

```text
securepass/
├── app.py
├── checker.py
├── breach.py
├── generator.py
├── requirements.txt
├── README.md
├── .gitignore
├── templates/
│   └── index.html
├── static/
│   ├── style.css
│   └── script.js
└── tests/
    ├── __init__.py
    └── test_checker.py
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd securepass
```

### 2. Create a virtual environment

Windows:

```powershell
py -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```powershell
python -m pip install -r requirements.txt
```

### 4. Run the application

```powershell
python app.py
```

Open your browser and visit:

http://127.0.0.1:5000

## 🧪 Run Tests

```powershell
python -m unittest discover -s tests -v
```

The password checker currently has five passing unit tests.

## 🔒 Privacy and Security

- Password analysis is performed by the local Flask application.
- The breach checker should send only the first five hexadecimal characters of the password's SHA-1 hash to the Have I Been Pwned API.
- Passwords should never be stored in application logs or history.
- Use HTTPS, disable Flask debug mode, and add suitable security controls before public deployment.

SHA-1 is used here for compatibility with the breach lookup API, not for storing passwords or protecting password databases.

## 🎓 Project Purpose

SecurePass is an educational cybersecurity project demonstrating password-strength analysis, breach checking, secure random generation, API integration, and automated testing.

## 📄 License

This project is available for educational use. Add a suitable open-source license before redistributing it.
