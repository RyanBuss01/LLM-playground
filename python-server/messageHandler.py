from modelHandler import ModelHandler

chat_model = ModelHandler('llama')
image_model = ModelHandler('image')


readableMessageTypes = [
    "chat",
    "instruct",
]

commandsList = [
    '/instruct',
    '/image',
    '/help'
]

  

class MessageHandler:
    def __init__(self, rawMessages, command, commandData):
        self.rawMessages = rawMessages
        self.command = None
        self.commandData = None
        self.messages = self.messageScanner()
        self.commandParser(command, commandData)

    def messageScanner(self):
        resMessages = []
        i = 0
        for message in self.rawMessages:
            if message['type'] in readableMessageTypes or i == len(self.rawMessages) - 1:
                resMessages.append(message)
            i += 1
        return resMessages

    def commandParser(self, command, commandData):
        if(command in commandsList):
            self.command = command
            self.commandData = commandData
        else:
            self.command = None
            self.commandData = None

    def setInstruction(self):
        if(self.messages[0]['role'] == 'user' or not self.messages):
            self.messages[-1] = {'role': 'system', 'content': self.commandData, 'type': 'instruct'}
        elif(self.messages[0]['role'] == 'system'):
            self.messages[0]['content'] = self.commandData

    def commandHandler(self, content):
        if(self.command == '/instruct'):
            self.setInstruction()
            return chat_model.predict(self.messages)
        if(self.command == '/image'):
            return image_model.predict(self.messages)
        if(self.command == '/help'):
            return self.messages.append({'role':'system', 'content':'/instruct \n/image', 'type': 'help'})
            
    
    def getResponse(self, content):
        self.messages.append(content)
        if(self.command != None):
            return self.commandHandler(content)
        else:
            response = chat_model.predict(self.messages)
            return response
