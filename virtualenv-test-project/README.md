# virtualenv-test-project — Virtual environment quickstart

Steps to create, activate and use the project virtual environment on macOS (zsh/bash):

1. Create the venv (if missing):

```bash
python3 -m venv .venv
```

2. Activate the venv:

```bash
source .venv/bin/activate
```

3. Install project dependencies:

```bash
pip install -r requirements.txt
```

4. Run your script:

```bash
python app.py
```

5. Deactivate when done:

```bash
deactivate
```

Tips:
- To add a package: `pip install <package>` then `pip freeze > requirements.txt`.
- In VS Code, select the interpreter at `.venv/bin/python` for the workspace.

pip --version
python3 -m pip --version
# if using the project venv
source .venv/bin/activate
pip --version
which pip
pip show pip