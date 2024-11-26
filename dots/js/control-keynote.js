function sendKeynoteCommand(command, slideNumber = null) {
    let bodyContent = `command=${command}`;
    if (slideNumber) {
        bodyContent += `&slide_number=${slideNumber}`;
    }

    console.log(bodyContent);
    fetch('http://localhost:8080/control-keynote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyContent
    }).then(response => response.text()).then(data => {
        console.log('Command sent:', command, slideNumber ? `Slide: ${slideNumber}` : '');
    }).catch(err => console.error('Error:', err));
}

// To move to the next slide:
//sendKeynoteCommand('next');

// To go to a specific slide (e.g., slide 5):
//sendKeynoteCommand('go_to_slide', 5);

