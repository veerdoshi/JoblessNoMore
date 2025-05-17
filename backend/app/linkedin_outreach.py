from browser_use import Agent, Controller, ActionResult
from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv

load_dotenv()

controller = Controller()

class LinkedInOutreach:
    def __init__(self):
        self.is_running = False

    async def start(self, company_name, job_name):
        self.is_running = True
        
        base_prompt = f"""                
        Go to https://www.linkedin.com/
        If prompted to login, login with these credentials:
            - Email: testboi7723@gmail.com
            - Password: Supabase123!
            
        Search for "{company_name} job title" in the search bar, where job title is a job title that makes sense for the {job_name} role the user applied for. For instance, if the user applied for "Software Engineer Intern" role at Google, the search query might be "Google Software Engineer".
        Click on a person from the results. Go to their profile.
        Click on the "Connect" button.
        Add a note if possible, saying something like "Hey! I'd love to learn more about what you do at {company_name}. The work seems so exciting."
        Click on the "Send" button.
        """
        
        agent = Agent(
            llm=ChatOpenAI(model="gpt-4o", api_key=os.environ.get("OPENAI_API_KEY")),
            controller=controller,
            task=base_prompt
        )
        
        await agent.run()

    def stop(self):
        self.is_running = False 