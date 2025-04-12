import os
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="URL Parser API", description="Parse URLs and extract keywords using Gemini API")

# Set up Gemini API
# Replace with your actual API key
GEMINI_API_KEY = "AIzaSyAE_ML5RWNO-9P-pA968S2IPo4Ym_lsjZQ"
genai.configure(api_key=GEMINI_API_KEY)

# Create a model configuration
model = genai.GenerativeModel('gemini-2.0-flash')

class URLInput(BaseModel):
    url: str

class KeywordResponse(BaseModel):
    url: str
    keywords: list[str]

@app.post("/parse_url", response_model=KeywordResponse)
async def parse_url(url_input: URLInput):
    """
    Parse a URL and extract important keywords using Gemini API.
    """
    url = url_input.url
    
    # Log the URL
    logger.info(f"Processing URL: {url}")
    
    try:
        # Generate prompt for Gemini
        prompt = f"""
        Extract the most important keywords from this URL: {url}
        Return only a list of keywords, separated by commas.
        Focus on meaningful terms that represent the content or topic of the URL.
        """
        
        # Call Gemini API
        response = model.generate_content(prompt)
        
        # Process the response to get keywords
        keywords_text = response.text.strip()
        keywords = [keyword.strip() for keyword in keywords_text.split(',')]
        
        return KeywordResponse(url=url, keywords=keywords)
    
    except Exception as e:
        logger.error(f"Error processing URL {url}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing URL: {str(e)}")

@app.get("/")
async def root():
    """
    Root endpoint with basic API information.
    """
    return {"message": "URL Parser API. Use /parse_url endpoint to extract keywords from URLs."}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=3000, reload=True)
