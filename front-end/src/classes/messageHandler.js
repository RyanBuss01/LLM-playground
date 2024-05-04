// Purpose: This file contains the class that handles the instruction commands
//
//Instructions:
//  1. Add a new command to the instructArray
//  2. Assign an overlay to the command
//  3. Assign a message to the command
//  4. update server side to handle the new command


const instructArray= [
    '/instruct',
    '/image'
]

const assignOverlay = (text, onInputChange) => {
    if(text=='/instruct') {
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
    else if(text=='/image') {
        return (
            <div className="instruct-overlay" >
              <div className="instruct-title">Describe your image  </div>
            </div>
          );
    }
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

export {instructArray, assignOverlay, assignMessage, commandAssigner};
