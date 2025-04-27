# Form Trigger App

A simple HTML/vanilla JavaScript application that allows you to test form submissions to any endpoint.

## Features

- Configure form action URL and HTTP method (GET or POST)
- Add multiple form fields with different types (text, number, email, password, checkbox, radio, textarea, select, hidden, file, date)
- Preview how each field will appear in a real form
- Submit the form data and view the response

## Usage

1. Open `index.html` in your web browser
2. Enter the form action URL where you want to send the data
3. Select the HTTP method (GET or POST)
4. Configure form fields by:
   - Setting the field name
   - Selecting the field type
   - Providing a default value
   - Marking fields as required if needed
   - For select/radio fields, providing comma-separated options
5. Click "Add Field" to add more fields
6. Click "Submit Form" to send the data to the specified URL
7. View the response below the form

## Notes

- For file fields, a simulated file will be sent (since real file input requires browser interaction)
- The response will be displayed in JSON format if possible, otherwise as text
- If you encounter CORS issues, you'll need to ensure the target URL allows cross-origin requests

## Technical Details

This app is built with:

- HTML5
- Tailwind CSS (via CDN)
- Vanilla JavaScript (no frameworks)

No build process or dependencies are required - just open the HTML file in your browser.
