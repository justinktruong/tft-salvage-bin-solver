from flask import Flask, flash, redirect, render_template, request, session
import json

# Configure application
app = Flask(__name__)

# Read json file
try:
    with open('items.json', 'r') as file:
        data = json.load(file)
except FileNotFoundError:
    print("Error: The JSON file was not found.")
except json.JSONDecodeError:
    print("Error: Failed to decode JSON from the file.")


@app.route("/")
def index():
    return render_template("salvage-bin.html")

