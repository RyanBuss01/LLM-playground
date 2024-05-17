import torch
from transformers import AutoProcessor, MusicgenForConditionalGeneration, AutoTokenizer, AutoModelForCausalLM
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler



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
        print("Model loaded")
        

    def predict(self, messages):
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
            img_path = "../images/result.jpg"
            image.save(img_path)
            return {'role':'system', 'content': img_path, 'type': 'image'}
        
