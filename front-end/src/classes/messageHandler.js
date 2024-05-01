class InstructHandler {
    constructor() {
        this.instructArray= [
            '/instruct',
            '/search'
        ]

        this.commandAssigner = (text) => {
           for (let i = 0; i < this.instructArray.length; i++) {
               if (text.startsWith(this.instructArray[i])) {
                   return this.instructArray[i];
               }
           }
        }

        this.assignMessage = (text, command) => {
            if(command === '/instruct') {
                return { role: "system", content: text, id: text.length }
            }
        }
    }
}


export default InstructHandler;