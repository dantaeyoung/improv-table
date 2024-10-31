from flask import Flask, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/control-keynote', methods=['POST'])
def control_keynote():
    command = request.form.get('command')
    slide_number = request.form.get('slide_number')

    print("we received", command, "+", slide_number)
    
    if command == "next":
        os.system('osascript -e "tell application \\"Keynote\\" to show next"')
    elif command == "previous":
        os.system('osascript -e "tell application \\"Keynote\\" to show previous"')
    elif command == "go_to_slide" and slide_number:
        try:
            slide_number = int(slide_number)
            os.system(f'osascript -e "tell application \\"Keynote\\" to tell document 1 to show slide {slide_number}"')
        except ValueError:
            return "Invalid slide number", 400
    
    return "OK"

if __name__ == '__main__':
    app.run(port=8080)

