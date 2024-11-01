from flask import Flask, request
from flask_cors import CORS
import os
import subprocess

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

slide_number = -1

keynote_gotoslide_applescript_template = '''
tell application "Keynote"
    activate
    tell document 1
        set slideNumber to {slide_number} -- change to the specific slide you want
        set currentSlide to slide slideNumber

        -- Get all shapes on the current slide
        set shapeList to every shape of currentSlide

        -- Initialize markerExists to false
        set markerExists to false

        -- Iterate through all shapes and display their labels
        repeat with aShape in shapeList
            try
                set shapeLabel to object text of aShape

                -- Check if the shape is labeled "VideoMarker"
                if shapeLabel is "#video" then
                    set markerExists to true
                end if
            on error
                log "Could not retrieve shape label"
            end try
        end repeat

        -- Show slide
        show slide slideNumber

        -- If marker shape exists, simulate keypress
        if markerExists then
            delay 0.1 -- Give time for the slide to load
            tell application "System Events"
                key code 49 -- Press the space bar to start the video
            end tell
        end if
    end tell
end tell
'''



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
            subprocess.run(["osascript", "-e", keynote_gotoslide_applescript_template.format(slide_number=slide_number)], capture_output=True, text=True)
            #os.system(f'osascript -e "tell application \\"Keynote\\" to tell document 1 to show slide {slide_number}"')
        except ValueError:
            return "Invalid slide number", 400
    
    return "OK"

if __name__ == '__main__':
    app.run(port=8080)

