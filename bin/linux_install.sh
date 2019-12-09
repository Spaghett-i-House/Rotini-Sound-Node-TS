#!/bin/bash
BASEDIR=$(dirname "$0")
echo "$BASEDIR"

echo "Installing python dependencies"
if command -v python3 &>/dev/null; then
    echo "Python 3 was installed skipping"
else
    echo "Python 3 was not installed installing"
    sudo apt install python3
fi
echo "installing python dependencies"
python3 -m pip install -r $BASEDIR/python_requirements.txt
echo "All python dependencies have been installed"


