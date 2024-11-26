# Improv-Tables

#### websites for improvisational tabletop presentations. 

#### use at: [dantaeyoung.github.io/improv-table](https://dantaeyoung.github.io/improv-table)


## Improv Tables: Sketching
![screenshot](screenshot.png)

#### How to use:

- Press `O` to open camera. It tries to use your [phone as a webcam](https://support.apple.com/en-us/HT213244). Hopefully your phone has the word 'phone' in its name.
- Attempt to explain with diagrams. 
- Add more diagrams
- Occasionally press `C` to capture an image.
- Keep on going.
- Save all your images with `S`.

## Improv Tables: Dots

- Run `control-keynote.py` as a separate process.
- Open `Keynote` in non-full-screen mode (in Fullscreen mode, browser activity is paused).
- The page will detect a sequence of stamped dots.
- Use the color picker at the bottom of the page to select the key color of the dots to be detected. Green is recommended as a color.
- Use Hue/Saturation/Value sliders to control the tolerance of dot selection.
- A sequence of large/small dots will be interpreted as binary, going right to left.
- Newly detected binary codes will trigger Keynote to navigate to that slide (in decimal)
