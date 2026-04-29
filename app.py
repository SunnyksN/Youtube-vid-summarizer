from flask import Flask, render_template, request
from youtube_transcript_api import YouTubeTranscriptApi
from langchain_ollama import OllamaLLM
import re

app = Flask(__name__)

llm = OllamaLLM(model="tinyllama")


def extract_video_id(url):
    patterns = [
        r"v=([a-zA-Z0-9_-]{11})",
        r"youtu\.be/([a-zA-Z0-9_-]{11})"
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)

    return None

def get_transcript(video_id):
    try:
        api = YouTubeTranscriptApi()

        transcript = api.fetch(video_id)

        text = " ".join(
            item.text for item in transcript
        )

        return text

    except Exception as e:
        return f"Error: {e}"


def summarize_text(text):

    # avoid huge prompts
    text=text[:8000]

    prompt=f"""
You are summarizing a YouTube video.

Provide:
1. Short summary
2. Key bullet points
3. Main takeaways

Transcript:
{text}
"""

    response=llm.invoke(prompt)
    return response


@app.route("/", methods=["GET","POST"])
def home():

    summary=None
    error=None

    if request.method=="POST":

        url=request.form["youtube_url"]

        video_id=extract_video_id(url)

        if not video_id:
            error="Invalid YouTube URL"

        else:
            transcript=get_transcript(video_id)

            if transcript.startswith("Error"):
                error=transcript
            else:
                summary=summarize_text(
                    transcript
                )

    return render_template(
        "index.html",
        summary=summary,
        error=error
    )


if __name__=="__main__":
    app.run(
        debug=True
    )