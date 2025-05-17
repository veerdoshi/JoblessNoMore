import os
import json
from browser_use import Agent, Controller, ActionResult
from browser_use.browser.context import BrowserContext
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from datetime import datetime
from .supabase import get_supabase_client

load_dotenv()

controller = Controller()
_current_upload_file_path = None
supabase = get_supabase_client()

@controller.action('Upload resume')
async def upload_resume(index: int, browser: BrowserContext):
    """Helper function to upload the resume PDF file"""
    global _current_upload_file_path
    _current_upload_file_path = os.path.expanduser("~/Downloads/TesBoiResume.pdf")
    
    if _current_upload_file_path is None:
        return ActionResult(error='No file path set for upload')
        
    dom_el = await browser.get_dom_element_by_index(index)
    
    if dom_el is None:
        return ActionResult(error=f'No element found at index {index}')
        
    file_upload_dom_el = dom_el.get_file_upload_element()
    
    if file_upload_dom_el is None:
        return ActionResult(error=f'No file upload element found at index {index}')
        
    file_upload_el = await browser.get_locate_element(file_upload_dom_el)
    
    if file_upload_el is None:
        return ActionResult(error=f'No file upload element found at index {index}')
        
    try:
        await file_upload_el.set_input_files(_current_upload_file_path)
        return ActionResult(extracted_content=f'Successfully uploaded resume to index {index}')
    except Exception as e:
        return ActionResult(error=f'Failed to upload resume to index {index}: {str(e)}')

@controller.action('Check if should run')
async def check_if_should_run(browser: BrowserContext):
    """Check if the automation should continue running"""
    return ActionResult(extracted_content=AutoApply.is_running)

@controller.action('Store job applied')
async def store_job_applied(job_name: str, company_name: str, browser: BrowserContext):
    """Store the job application in the Supabase applications table"""
    try:
        data = {
            'profile_id': os.environ.get("CURRENT_PROFILE_ID"),
            'apply_date': datetime.now().isoformat(),
            'job_name': job_name,
            'company': company_name,
            'status': 'applied'
        }
        
        result = supabase.table('applications').insert(data).execute()
        return ActionResult(extracted_content=f'Successfully stored application for {job_name} at {company_name}')
    except Exception as e:
        return ActionResult(error=f'Failed to store application: {str(e)}')

class AutoApply:
    def __init__(self):
        self.is_running = False

    async def start(self, user_profile):
        self.is_running = True
        job_preferences = json.loads(user_profile['jobPreferences'])
        
        # Determine job category based on preferences
        category = "software-engineering" if job_preferences.get("swe") else "data-science"
        
        base_prompt = f"""                
        Go to https://www.linkedin.com/jobs/.
        If prompted to login, login with these credentials:
            - Email: testboi7723@gmail.com
            - Password: Supabase123!
            
        Search for jobs with a relevant search term for this category: {category}. Click on the best option from the dropdown for this search term. If no options show up, try a different search term. Then you'll be on the job listing page.
        Select "Easy Apply" on this page. Don't go to any other page.
        
        For each job listing:
        1. Click the Apply button. Wait a significant amount of time. If you go to a new page that isn't Linkedin, go back to the job listing page and continue to the next job listing.
        2. Apply to the job. Remember the job name and company name.
        3. Fill out all the fields of the application. Meticulously scroll through the page step by step to fill everything out. 
           Once you fill out a field, YOU MUST WAIT AND CHECK IF IT IS A DROPDOWN. IF YOU SEE ANY OPTIONS HOVER UNDERNEATH THE FIELD, IT IS A DROPDOWN. IF IT IS A DROPDOWN, SELECT THE BEST OPTION. 
        
        Here are some inputs you should use to fill out specific fields if needed:
           - First Name: {user_profile['firstname']}
           - Last Name: {user_profile['lastname']}
           - Education: {user_profile['education']}
           - Phone Number: 4092312312
           
        5. Scroll through each page of the application form and fill out each page. When continuing to the next page, wait for the page to load.
        6. When asked for resume, find the file upload element and use the "Upload resume" action. Try different index values if the upload fails. Wait for the upload to complete and then continue.
        7. Submit application. Wait to see if it was successful. If it was, use the "Store job applied" action with the job name and company name.
        8. Go back to the job listing page and continue with the next job listing.
        
        If any required information is missing, use sample data that makes sense for it.
        If any error occurs, skip to the next job listing.
        """
        
        agent = Agent(
            llm=ChatOpenAI(model="gpt-4o", api_key=os.environ.get("OPENAI_API_KEY")),
            controller=controller,
            task=base_prompt
        )
        
        await agent.run()

    def stop(self):
        self.is_running = False 