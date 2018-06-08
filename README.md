
# Foxirin
*Foxirin is a Node.JS-powered visual novel engine, built for variety and customization*. It includes all you'll ever wish from a text-based visual novel: *quicktime events, saving* and more!
### That's cool and all, but how do you use it?
*Using Foxirin is as easy as cake:* in the default file, there are multiple functions and docs to help you along the way.
All you do here is compile the main() function out of existing functions and maybe more if you wish!
### Why should i use Foxirin?
Its incredibly easy, and most importantly, clean as *h e c c*. You see, Node.JS wasn't really made for console apps, so it doesnt have much to help with creating something out of its' reach. With Foxirin, everything you'd need for a visual novel is there, and if you wish for even more, *just add it in yourself!*
## More info
In the project, there are 2 main files:

 - **charinput.js**, which is the 'index' of the entire game. You can name it whatever you want;
 - And **sqcTest.js**. This will help you working with the engine itself, as it uses Node's keypress sequences to operate most of itself.

### Functions & Docs
To enable or disable saving, use the 'save' boolean at the top of the file.
```js
...fs = require('fs')

  //change this to true if you want to save
  var saveNeeded = false

var save...
```
You shouldn't use functions that aren't listed here, unless you know what you're doing!

 - **save(func,[flags],[name]**
    This function allows the player to save their progress.
    **func** - the name of the function that needs to be ran at the start of the save.
    **flags** - an object of saved flags you want to keep untill the next game. If undefined, it will use the *userFlags* variable.
    **name** - the name of the save. It is normally only used for the intro sequence when the player makes a save, but it can also be used for whatever you wish for; go wild!
    **Returns**: a Promise that is resolved once everything is saved.
    
  - **awaitKeypress([key])**
     This function waits untill the player presses a key. It's best used for text advancement.
     **key** - the key required to be pressed. If undefined, the player can press any key.
     **Returns**: a Promise which then returns the key pressed after keypress.
     
  - **enterName()**
     This function allows the player to enter in a string!
     **Returns**: a Promise which returns the string after pressing enter.
     
  - **redoLine(line)**
     This function erases the last line and rewrites it! Go wild with this!

  - **awaitKeypresses(keypressArray)**
     Waits untill one of the keys are pressed, then returns the pressed key. You can use this for choices!
     **keypressArray** - the keypresses that can be accepted. Others will be ignored.
     **Returns**: a Promise which returns the key pressed.

  - **awaitAllKeypresses(keypressArray)**
     Waits untill all keypresses are reached, then returns an array in which order the keys were pressed.
     **keypressArray** - an array consisting of all keypresses required to continue.
     **Returns**: a Promise which returns the keys pressed, in order.

  - **writeDelayed(str)**
     Writes down the string, character by character. Press any button to skip to the end.
     **str** - the string to write down.
     **Returns**: a Promise which is resolved after the string is typed in.

  - **writeNonDelayed(str)**
    Same as writeDelayed(), just without delay. Not gonna write everything down as before here.

  - **quicktimeEvent(keypresses, delay, delayrandrange)**
     Starts a quicktime event, where you have to press a keypress before the time runs out!
     **keypresses**: an array of all the keypresses! You'll have to randomize it yourself, but here's a hint:
	 ```js
	 var keypressesArray = ['a','b','c'];
	 var chosenKeypress = keypressesArray[Math.floor(Math.random() * keypressesArray.length)]
	 ```
	 **delay**: the default delay that is then used with delayrandrange in a formula, specified below
	 **delayrandrange**: used to randomize the delay with this formula: `Math.round(delay+(delayrandrange*(Math.random()-0.5)*2))`
	 **Returns**: a Promise, which is then resolved to either `true` or `false`, depending on if the player succeeded or not.
     
Foxirin 1.0.1