import os
import torch
from transformers import AutoProcessor, MusicgenForConditionalGeneration, AutoTokenizer, AutoModelForCausalLM
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler
from scipy.io.wavfile import write
import numpy as np



class ModelHandler:
    def __init__(self, selectedModel):
        self.model = None
        self.tokenizer = None
        self.pipe = None
        self.selectedModel = selectedModel
        if(selectedModel):
            self.load(selectedModel)

    def load(self, selectedModel):
        if(selectedModel == 'llama'):
            model_path = "../models/llama-3-8B-instruct" #convert to 30b
            self.tokenizer = AutoTokenizer.from_pretrained(model_path)
            self.model = AutoModelForCausalLM.from_pretrained(
            model_path,
            torch_dtype=torch.bfloat16,
            device_map="cuda",
            )
        elif(selectedModel == 'image'):
            model_path = "../saved_models/Protogen_x3.4"

            self.pipe = StableDiffusionPipeline.from_pretrained(model_path, torch_dtype=torch.float16)
            self.pipe.scheduler = DPMSolverMultistepScheduler.from_config(self.pipe.scheduler.config)
            self.pipe = self.pipe.to("cuda")

        elif(selectedModel == 'code'):
            token_path = "../saved_models/tokenizer/code-llama-instruct"
            model_path = "../saved_models/code-llama-instruct"
            self.tokenizer = AutoTokenizer.from_pretrained(token_path)
            self.model = AutoModelForCausalLM.from_pretrained(
                model_path,
                torch_dtype=torch.bfloat16,
                device_map="cuda",
            )
        elif(selectedModel == 'music'):
            model_path = "../models/musicGen"
            self.tokenizer = AutoProcessor.from_pretrained(model_path)
            self.model = MusicgenForConditionalGeneration.from_pretrained(model_path)
            # self.model.cuda()

        print("Model loaded")
        

    def predict(self, messages):
        print(messages)
        if(self.selectedModel == 'llama'):
            input_ids = self.tokenizer.apply_chat_template(
                messages,
                add_generation_prompt=True,
                return_tensors="pt"
                ).to(self.model.device)

            terminators = [
                self.tokenizer.eos_token_id,
                self.tokenizer.convert_tokens_to_ids("<|eot_id|>")
            ]

            outputs = self.model.generate(
                input_ids,
                max_new_tokens=256,
                eos_token_id=terminators,
                do_sample=True,
                temperature=0.6,
                top_p=0.9,
            )
            response = outputs[0][input_ids.shape[-1]:]
            message = self.tokenizer.decode(response, skip_special_tokens=True)
            return {'role':'system', 'content': message, 'type': 'chat'}
        elif(self.selectedModel == 'image'):
            image = self.pipe(messages[-1]['content'], num_inference_steps=25).images[0]
            random_hex = os.urandom(8).hex()
            image_name = f'{random_hex}.jpg'
            img_path = f"../images/{image_name}"
            image.save(img_path)
            return {'role':'system', 'content': image_name, 'type': 'image'}
        
        elif(self.selectedModel=='code'):
            input_ids = self.tokenizer.apply_chat_template(
                messages,
                add_generation_prompt=True,
                return_tensors="pt"
            )
            outputs = self.model.generate(
                input_ids.to(self.model.device),
                max_new_tokens=256,
            )
            response = outputs[0][input_ids.shape[-1]:]
            content=self.tokenizer.decode(response, skip_special_tokens=True)

            return {'role':'system', 'content': content, 'type': 'chat'}
        
        elif(self.selectedModel=='music'):
            print("all-messages: ", messages)
            print("last-content: ", messages[-1]['content'])
            inputs = self.tokenizer(
            text=[messages[-1]['content']],
            padding=True,
            return_tensors="pt",
            )
            # .to(self.model.device)

            audio_values = self.model.generate(**inputs, max_new_tokens=256)
            sampling_rate = self.model.config.audio_encoder.sampling_rate
            random_hex = os.urandom(8).hex()
            music_name = f'{random_hex}.wav' 
            music_path = f"../music/{music_name}"
            write(music_path, sampling_rate, audio_values.astype(np.int16))
            return {'role':'system', 'content': music_name, 'type': 'music'}