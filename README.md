# Tractor Pulling Club Website

This is a website used to show results from the Community Antique Tractor Pulling Club.

## Getting Started

These instructions will get you a copy of the project up and running on your lcoal machine for development and testing purposes.

### Prerequisites

You will need to install [Node.js](https://nodejs.org/en/download/) on your local machine.

### Environment Variables

You will need to set the following environment variables

```
TRACTORPULLINGENV // prod or something else
CATP_EDIT_SECRET // secret to allow edit access
JWT_SECRET // secret to encrypt tokens
```

_Note that these can change to what ever values desired for deployment._

### Run Locally

You will first need to install all required node modules

```
npm i
```

Then you will need to build the react build folder

```
npm run build
```

Start hosting the server with the following command

```
node backend/server.js
```

If UI development is planned, then in a new session (keep server running) start up the UI. This will auto refresh the page for each save made in a UI file.

```
node run local
```

Open the page in your browser http://localhost:8080/, or if doing UI development use http://localhost:3000
