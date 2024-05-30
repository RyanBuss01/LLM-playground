from modelHandler import ModelHandler

chat_model = ModelHandler('llama')
image_model = ModelHandler('image')
code_model = ModelHandler('code')
music_model = ModelHandler('music')

readableMessageTypes = [
    "chat",
    "instruct",
]

commandsList = [
    '/instruct',
    '/image',
    '/help',
    '/code',
    '/music'
]



helpContent = '''
{
  "header": "AI commands:",
  "sections": [
    {
      "subHeader": "/instruct",
      "description": "Customize your chatbot by providing instructions"
    },
    {
      "subHeader": "/image",
      "description": "create an image based on a description"
    },
    {
      "subHeader": "/code",
      "description": "chat with our chatbot the specializes in programing"
    }
     {
      "subHeader": "/music",
      "description": "generate music based on a description"
    }
  ]
}
'''
  

class MessageHandler:
    def __init__(self, rawMessages, command, commandData, updateMessagesCallback):
        self.rawMessages = rawMessages
        self.command = None
        self.commandData = None
        self.messages = self.messageScanner()
        self.callback=updateMessagesCallback
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
        if not self.messages:
            self.messages.insert(0, {'role': 'system', 'content': self.commandData, 'type': 'instruct'})
        elif self.messages[0]['role'] == 'user':
            # If the first message is from the user, insert a new system message at the beginning
            self.messages.insert(0, {'role': 'system', 'content': self.commandData, 'type': 'instruct'})
        elif self.messages[0]['role'] == 'system':
            # If the first message is already from the system, update its content
            self.messages[0]['content'] = self.commandData
        self.callback(self.messages[:-1])

    def commandHandler(self, content):
        if(self.command == '/instruct'):
            self.setInstruction()
            return chat_model.predict(self.messages)
        if(self.command == '/image'):
            return image_model.predict(self.messages)
        if(self.command == '/code'):
            return code_model.predict(self.messages)
        # if(self.command == '/music'):
            # return music_model.predict(self.messages)
        if(self.command == '/help'):
            return {'role':'system', 'content':helpContent, 'type': 'help'}
    
    def contentDiscimnator(self, content):
        if(content['content'].startswith('/help')):
            self.command = '/help'
            
    
    def getResponse(self, content):
        self.messages.append(content)
        self.contentDiscimnator(content)
        print("Resp - command: ", self.command)
        if(self.command != None):
            return self.commandHandler(content)
        else:
            response = chat_model.predict(self.messages)
            return response

