# Table of Content
- [Screenshot](#screenshot)
- [How to use the plugin](#how-to-use-the-plugin)
- [Development](#development)

# Screenshot
![Figma how to install 1](https://i.imgur.com/mVzB2oT.jpg)

<br>
<br>

# How to use the plugin
**Please note:**
this plugin makes use of a specific Figma Teams Library, which you can find [here](https://www.figma.com/file/PeQbBDCy9SoTuQNfFB9YY1/IPSOS-Project?node-id=62%3A1579). Wihtout it the plugin will fail to find the components and not run as expected.

First you will need to instsall the [Figma desktop app](https://www.figma.com/downloads/), now all you have to do is follow these two simple steps and you'll be ready to use the plugin:

1. Open the app, login and go to the "Plugins" menu, "In Development" and click on the plus icon.
![Figma how to install 1](https://i.imgur.com/2y7Nh7Y.png)

2. Click to add the `/manifest.json` file found in the root of this repo.
![Figma how to install 2](https://i.imgur.com/oRzlisx.png)

3. The pluign has been installed, to run it you need to open a document, and go to "Plugins" -> "Development" -> "Ipsos project v2"
![Figma how to install 3](https://i.imgur.com/KGBN6Hx.png)


# Development

The main plugin code is in `src/code.ts`. The HTML for the UI is in
`src/ui.html`, while the embedded JavaScript is in `src/ui.js` and the Vue script is in `src/App.vue`.

These are compiled to files in `build/`, which are what Figma will use to run
your plugin as set in the `manifest.json`.

To build and run the plugin you will need to have the Figma desktop app (the web browser version does not work for development) and [Node.JS with npm](https://nodejs.org/en/download/) installed in your machine.

Once you have installed node JS go to the root of this repo and type in the following commands in your terminal:

    $ npm install
    $ npm run watch

This will create a Node server that builds the plugin live as it is saved, useful for development purposes.


[webpack]: ../webpack/
