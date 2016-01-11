# Mustra, the front-end starter kit

Support: Latest versions of all major browser vendors, Internet Explorer 10 and up
License: MIT (c) Sprawsm doo 

Since we're a UI design shop that does their own front-end development in-house, we always had some kind of a starter kit to kick off the coding process. We always kept things very simple and basic simply because we didn't want to waste time going over the existing styles that may be in place, which is the case with frameworks such as Bootstrap and Foundation. 

The goal we had with Mustra was to create a starting point which we could take in whichever direction we need to take it and do it as fast as possible, regarding the project at hand. This is why the visual styling is kept at a minimum, and why it most likely won't win any beauty contests any time soon. 

Additionally, we wanted to minimize the gruntwork we needed to do for each codebase handover, things such as concatenation, image optimization, etc. This is why Mustra comes with a preconfigured Gruntfile and package.json which provide you with a basic development environment. 

At the moment Mustra will set you up with the following: 

- LESS-based CSS preprocessing 
- defaults normalization stylesheet based on normalize.css 
- sensible typographic defaults with some handy helper styles 
- flexbox-based grid based on (FlexboxGrid.com)[http://flexboxgrid.com/] 
- many helper classes for common styling and behavior presets, and a few UI elements to speed up your work 
- Jade-based templating 

We hope you enjoy using it, and hope it will help you get your work done faster. 

Cheers. 

## Setting up your project 

Here's a quick primer on how to get your Mustra up and running and kick off the front-end development of your project. 

1. Make sure you have Node.js and npm installed, if not go ahead and [install it from the Node.js site](https://nodejs.org/en/). 
2. Make sure you have the Grunt CLI installed, if not run the following command from your Terminal: `sudo npm install -g grunt-cli` (you may not need `sudo`, but you most likely will). 
3. Clone a fresh copy of Mustra by typing the following in your Terminal window: `git clone git@gitlab.com:sprawsm/mustra.git`, followed by `cd mustra`, and `git checkout master` (or [download it manually from here](https://gitlab.com/sprawsm/mustra/tree/master)). 
4. Run grunt in order to install all dependencies by typing the following commaind in Terminal: `npm install grunt --save-dev`. 
5. You're all set and good to go. 

That's all there is to it. A couple of notes, though: 

- If you have downloaded Mustra manually, make sure you are downloading from the master branch as it's always stable. Even more safe is to [download the latest release](https://gitlab.com/sprawsm/mustra/tags). If you would like to use the newest features, download from the development branch but beware that things might be rough around the edges, or break completely. 
