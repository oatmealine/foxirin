
//NERDY MY OWN CODE STARTS HERE, don't mess with it unless you know what you're doing
const readline = require('readline');

var keyPressed = null
var lastLinePrinted = null
var fs = require('fs')

//change this to true if you want to save
var saveNeeded = false

var savenum
var userFlags

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

function acceptKeypress(key) {
    keyPressed = key
}

process.stdin.on('keypress', (str, key) => {
  if(key.sequence === "\u0003") {process.exit()}
  acceptKeypress(key)
})

async function awaitKeypress(key) {
    return new Promise(resolve => {
        var n = 0
        function repeatCheck() {
            if(keyPressed !== null) {if(key === undefined || key === keyPressed.sequence) {resolve(keyPressed); keyPressed = null}} else {setTimeout(repeatCheck, 100)}
        }
        repeatCheck()
    })
}

async function enterName() {
    return new Promise(async function(resolve) {
        var savedStr = []
        function repeatCheck() {
            if(savedStr === undefined) {
                savedStr = []
            }
            if(keyPressed !== null) {
                if(keyPressed.sequence === '\r' || keyPressed.name === "return") {
                    if(!savedStr.length < 1) {
                        var resString = ""
                        savedStr.forEach(obj=>{resString = resString+obj})
                        resolve(resString)
                    } else {
                        setTimeout(repeatCheck, 100)
                    }
                } else if(keyPressed.name === "backspace") {
                    process.stdout.write("\b \b")
                    savedStr = savedStr.splice(savedStr.length-1,1)
                    setTimeout(repeatCheck, 100)
                } else {
                    process.stdout.write(keyPressed.sequence)
                    savedStr.push(keyPressed.sequence)
                    setTimeout(repeatCheck, 100)
                }
                keyPressed = null
            } else {
                setTimeout(repeatCheck, 100)
            }
        }
        repeatCheck()
    })
}

async function save(func,userflags,savename) {
    return new Promise(resolve=>{
        if(userflags === undefined) {userflags = userFlags}
        if(savename === undefined) {savename = saves[savenum].name}
        saves[savenum] = {currentFunc: func, flags: userflags, name: savename}
        fs.writeFile("./VSNsaves.json", JSON.stringify(saves), async function(err) {
            if(err) throw err;
            await writeDelayed("\nProgress saved.\n")
            resolve(err)
        })
    })
}

function redoLine(progress){
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(progress);
}

async function awaitKeypresses(keys) {
    return new Promise(resolve => {
        function repeatCheck() {
            if(keyPressed !== null) {if(keys.includes(keyPressed.sequence)) {resolve(keyPressed); keyPressed = null} else {keyPressed = null; setTimeout(repeatCheck, 100)}} else {setTimeout(repeatCheck, 100)}
        }
        repeatCheck()
    })
}

async function awaitAllKeypresses(keys) {
    return new Promise(resolve => {
        var pressedKeys = []
        process.stdout.write("> ")
        function repeatCheck() {
            if(keyPressed !== null) {if(keys.includes(keyPressed.sequence)) {if(!pressedKeys.includes(keyPressed.sequence)) {process.stdout.write(keyPressed.sequence+" "); pressedKeys.push(keyPressed.sequence)}; keyPressed = null; if(pressedKeys.length === keys.length) {process.stdout.write("\n"); resolve(pressedKeys)} else {setTimeout(repeatCheck, 100)}} else {redoLine("WRONG INPUT; start over\n> "); keyPressed = null; pressedKeys = []; setTimeout(repeatCheck, 100)}} else {setTimeout(repeatCheck, 100)}
        }
        repeatCheck()
    })
}

async function writeNonDelayed(str) {
    process.stdout.write(str)
    lastLinePrinted = str
    return str
}

async function writeDelayed(str) {
    return new Promise(resolve => {
        var res = str.split("")
        n = 0;
        function f() {
            process.stdout.write(res[n])
            n++
            if(keyPressed !== null) {
                keyPressed = null
                var printImmideate = "";
                oldn = n
                n = res.length
                res.splice(0,oldn)
                res.forEach(str=>{printImmideate = printImmideate+str})
                process.stdout.write(printImmideate)
            }
            if(n<res.length) {
                setTimeout(f,50)
            } else {
                resolve(str)
                lastLinePrinted = str
            }
        }
        f()
    })
}
    
async function quicktimeEvent(keypresses, delay, delayrandrange) {
    return new Promise(resolve => {
        process.stdout.write("\n")
        var n = 0
        var currDelay
        var startingDelay
        function doNewDelayedKey() {
            currDelay = Math.round(delay+(delayrandrange*(Math.random()-0.5)*2))
            startingDelay = currDelay
            process.stdout.write("PRESS > "+keypresses[n]+" | TIME  > ["+"=".repeat(currDelay)+"]")
            currDelay--
            setTimeout(delayDo, 1000)
        }
        function delayDo() {
            redoLine("PRESS > "+keypresses[n]+" | TIME  > ["+"=".repeat(currDelay)+" ".repeat(startingDelay-currDelay)+"]")
            if(keyPressed !== null) {
                if(keyPressed.sequence === keypresses[n]) {
                    redoLine(""); 
                    if(keypresses[n+1] === undefined) {
                        process.stdout.write("\n")
                        setTimeout(function(){resolve(true)},1000)
                    } else {
                        n++; 
                        setTimeout(doNewDelayedKey, 2000)
                    }
                } else {
                    redoLine("ERROR! Wrong keypress.\n\n"); 
                    lastLinePrinted = ""
                    setTimeout(function(){resolve(false)},1000)
                }
            keyPressed = null
            } else {
                if(currDelay<1) {
                    redoLine("TIMEOUT\n\n");
                    lastLinePrinted = ""
                    setTimeout(function(){resolve(false)},1000)
                } else {
                    currDelay--
                    setTimeout(delayDo, 1000)
                }
            }
        }
        doNewDelayedKey()
    })
}
//NERDY MY OWN CODE ENDS HERE; everything from here is all yours

async function main() {
    await writeDelayed("\n\nThis is a sample story to show off this engine's functions! (Press any key to continue)")
    await awaitKeypress()
    await writeDelayed("\nThis is the writeDelayed(str) function, that writes out any string like this, giving it a small sense of being spoken and not just written out.")
    await writeDelayed("\nThis is best used for dialogues and such. However, if you notice, when this text stops, it waits for you to press a button before writing out the new line.")
    await awaitKeypress()
    await writeDelayed("\nThe awaitKeypress() waits untill the users presses any key, or, a specific key if its specified:\nawait awaitKeypress('z')\nThis is best used for text advancing.")
    await awaitKeypress()
    await writeDelayed("\nYou can, of course, wait for multiple keypresses. How is this useful? For choice selects, for example:\nvar choice;\nawait awaitKeypresses(['1','2','3'])\n.then(key=>{choice = key});\nif(choice.sequence==='1') {} else if(choice.sequence==='2') {} else {}\nThis is pretty basic and it does not write anything when it does it. Try it out here by pressing either 1, 2 or 3!")
    var choice;
    await awaitKeypresses(['1','2','3'])
    .then(key=>{choice = key});
    if(choice.sequence==='1') {await writeDelayed("\nYou chose 1!")} else if(choice.sequence==='2') {await writeDelayed("\nYou chose 2!")} else {await writeDelayed("\nYou chose 3!")}
    await awaitKeypress();
    await writeDelayed("\nThe awaitKeypresses() function returns the keypress, meaning you can not only test for button presses, but for sequences as well! I've included a sqcTest.js file in the project. If you open it and press any key(s), it shows the keyPressed object for them.")
    await awaitKeypress()
    await writeDelayed("\nThere is also the awaitAllKeypresses() function, which waits for each of the keypresses to be typed in. For example, try typing in 'hi' now!\n")
    await awaitAllKeypresses(['h','i'])
    await writeDelayed("Before we talk about the final function of this engine, i just want to note that writeNonDelayed() is also a function. Please use this function instead of process.stdout as it allows you to use awaitKeypress().")
    await awaitKeypress()
    await writeNonDelayed("\nSee, it types in everything at once!")
    await awaitKeypress()
    await writeDelayed("\nNow for the final function, quicktimeEvent()! Let's first review the parameters:\nquicktimeEvent(keypresses,delay,delayrandrange)\nkeypresses - An array of all the keys you want to be pressed. (['a', '3', 'u'])\ndelay - The default delay (in seconds) before a timeout (and loss in the process).\ndelayrandrange - How far away from the delay number it can be randomized. Set this to 0 if you want the delay to be the same each time.\nSo, let's try it out!")
    await awaitKeypress()
    await quicktimeEvent(['t','e','s','t'], 8, 2)
    await writeDelayed("\nThis function returns a promise, which when finished returns a boolean, if the player failed the event or not. Now let's review saving!")
    await awaitKeypress()
    await writeDelayed("\nSaving is actually a lot less complex than it seems! At the top of the file for the script, there is a boolean: saveNeeded. If you turn this on, the second someone opens the game, a new file with 3 saves will be created. Then you can save the file at any point in time with the function save(func,flags). func is the name of the function you want to run upon loading this save (without brackets) and flags is an object which specifies all flags. If you set this to undefined, it will save all the flags from the flags variable, which is userFlags by default.\nSo, that's pretty much it, every single function in this engine is now explained! Go have fun with the engine! -Fox\n")
    await awaitKeypress()
    process.exit()
}



//OK ACTUALLY not really, a bit more of my code here
async function start() {
    console.clear();
    if(saveNeeded) {
    saves = []
        
    fs.access('./VSNsaves.json', fs.constants.F_OK, (err) => {
        if(err) {
            fs.writeFile('./VSNsaves.json', '[null, null, null]', function (err) {
                if (err) throw err;
                console.log('Made new save, hopefully works');
                saves = require('./VSNsaves.json')
              }); 
        } else {
            saves = require('./VSNsaves.json')
        }
    });
    var checksaveExists = function(givenSave) {if(givenSave === null) {return "Empty"} else {return givenSave.name}}
    await writeDelayed("Which save do you want to use?\n")
    await writeNonDelayed("1 - "+checksaveExists(saves[0])+"\n")
    await writeNonDelayed("2 - "+checksaveExists(saves[1])+"\n")
    await writeNonDelayed("3 - "+checksaveExists(saves[2])+"\n")
    await writeDelayed("Type in the number.\n")
    await awaitKeypresses(['1','2','3'])
    .then(key=>{choice = key});
    if(choice.sequence==='1') {await writeDelayed("\nYou chose save 1!")} else if(choice.sequence==='2') {await writeDelayed("\nYou chose save 2!")} else {await writeDelayed("\nYou chose save 3!")}
    savenum = Number(choice.sequence)-1
    
    if(checksaveExists(saves[Number(choice.sequence)-1]) === "Empty") {
        await writeDelayed("\nType in your save's name!: ")
        var saveName = await enterName()
        await save('main',[],saveName); 
        main()
    } else {
        currSave = saves[Number(choice.sequence)-1]
        userFlags = currSave.flags
        eval(currSave.currentFunc+'()')
    }
} else {main()}
}

start()
//done now