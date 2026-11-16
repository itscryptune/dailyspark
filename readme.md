# Daily Spark

A clock and daily quote display for TRMNL. It shows the date, time, and a quote in a simple layout with a mix of quotes from ZenQuotes and my own collection

## Features
- Date and time along with quotes
- Quotes from ZenQuotes and personal collection
- Full, half-horizontal, half-vertical, and quadrant layouts
- Shorter quote text for the smaller layouts

## Running it locally
I worked on this using Windows 11, Docker, and [TRMNL Preview](https://github.com/usetrmnl/trmnlp).
```powershell
git clone https://github.com/itscryptune/dailyspark.git
cd dailyspark
```
To preview the TRMNL plugin, run this in PowerShell from the project folder:
```powershell
docker run --rm -it -p 4567:4567 -v "${PWD}:/plugin" trmnl/trmnlp serve --bind 0.0.0.0
```

To preview the showcase run this
```powershell
node showcase/server.mjs
```
Open http://localhost:3210. To add your own quotes open `src/transform.js` and add your quotes to the `CUSTOM_QUOTES` list 


## What's missing
- The time on screen updates when TRMNL refreshes, so it isn't a proper ticking clock.
- ZenQuotes needs internet connection. 

## Built with
- HTML, CSS, and JavaScript
- TRMNL Liquid templates
- [ZenQuotes](https://zenquotes.io/)
- Node.js
- Nest for hosting
