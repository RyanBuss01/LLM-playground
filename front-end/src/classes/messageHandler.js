// Purpose: This file contains the class that handles the instruction commands
//
//Instructions:
//  1. Add a new command to the instructArray
//  2. Assign an overlay to the command
//  3. Assign a message to the command
//  4. update server side to handle the new command


const instructArray= [
    '/instruct',
    '/image',
    '/help',
    '/code',
    '/music'
]

const assignOverlay = (text, onInputChange) => {
    if(text==='/instruct') {
        return (
            <div className="instruct-overlay" >
              <div className="instruct-title">Enter Instruction: </div>
              <input
                className="instruct-text"
                type="text"
                placeholder="Type your instruction here..."
                onChange={onInputChange} // Use the passed handler
              />
            </div>
          );
    }
    else if(text==='/image') {
        return (
            <div className="instruct-overlay" >
              <div className="instruct-title">Describe your image  </div>
            </div>
          );
    }
    else if(text==='/code') {
        return (
            <div className="instruct-overlay" >
              <div className="instruct-title">What coding advice do you need? </div>
            </div>
          );
    }
    else if(text==='/music') {
        return (
            <div className="instruct-overlay" >
              <div className="instruct-title">Explain what kind of music you want to hear </div>
            </div>
          );
    }
}

const assignSlice = (text, command) => {
    if(command==='/instruct') {
        return 9;
    }
    else if(command==='/image') {
        return 6;
    }
    else if(command==='/code') {
        return 5;
    }
    else if(command==='/music') {
        return 6;
    }
    else if(command==='/help') {
        return 0;
    }
    return 0;
}

const assignMessage = (text, command) => {
        return { role: "system", content: text, id: text.length, instruct:true, instruction:command }
}

const commandAssigner = (text) => {
    for (let i = 0; i < instructArray.length; i++) {
        if (text.startsWith(instructArray[i])) {
            return instructArray[i];
        }
    }
}

export {instructArray, assignOverlay, assignMessage, commandAssigner, assignSlice};
