from pypdf import PdfReader


def extract_text(pdf_path):

    reader = PdfReader(pdf_path)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text

    return text

import ollama

from config import MODEL

from pypdf import PdfReader


def extract_text(pdf_path):

    reader = PdfReader(pdf_path)

    text = ""

    for page in reader.pages:

        page_text = page.extract_text()

        if page_text:

            text += page_text

    return text

def summarize_pdf(pdf_path):

    text = extract_text(pdf_path)

    print(text)

    prompt = f"""
    Summarize the following document:

    {text[:8000]}
    """

    ...
    
def summarize_pdf(pdf_path):

    text = extract_text(pdf_path)

    prompt = f"""
    Summarize the following document.

    Document:

    {text[:8000]}
    """

    response = ollama.chat(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"]