import os
import re
import pytesseract
import cv2
import pandas as pd
import pdfplumber
from pdf2image import convert_from_path

# Path to Tesseract (adjust per system)

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def preprocess_image(image_path):
    """Preprocess image for better OCR results"""
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # Adaptive threshold (better than simple thresholding for different scans)
    gray = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                 cv2.THRESH_BINARY, 31, 2)
    return gray

def mask_aadhaar(aadhaar_number):
    """Mask Aadhaar number for security (XXXX XXXX 1234)"""
    if not aadhaar_number:
        return ""
    return "XXXX XXXX " + aadhaar_number.strip()[-4:]

def extract_from_text(text):
    details = {
        "firstname": "",
        "lastname": "",
        "dob": "",
        "gender": "",
        "aadhaar_number": "",
        "address": ""
    }

    # Aadhaar number (unmasked or masked form)
    aadhaar_match = re.search(r"\b\d{4}\s\d{4}\s\d{4}\b", text)
    if aadhaar_match:
        details["aadhaar_number"] = mask_aadhaar(aadhaar_match.group())

    # DOB or YOB
    dob_match = re.search(r"(\d{2}/\d{2}/\d{4})", text)
    yob_match = re.search(r"Year of Birth\s*:? (\d{4})", text, re.IGNORECASE)
    if dob_match:
        details["dob"] = dob_match.group()
    elif yob_match:
        details["dob"] = yob_match.group(1)

    # Gender (support multiple formats)
    if re.search(r"\bMale\b|\bM\b", text, re.IGNORECASE):
        details["gender"] = "Male"
    elif re.search(r"\bFemale\b|\bF\b", text, re.IGNORECASE):
        details["gender"] = "Female"
    elif re.search(r"\bTransgender\b|\bT\b", text, re.IGNORECASE):
        details["gender"] = "Transgender"

    # Address (look for Address or common keywords)
    addr_match = re.search(r"(Address|Add|Addr)[: ](.+)", text, re.IGNORECASE | re.DOTALL)
    if addr_match:
        details["address"] = addr_match.group(2).replace("\n", " ").strip()
    else:
        # fallback: last few lines often have address
        lines = [l.strip() for l in text.split("\n") if l.strip()]
        if len(lines) > 3:
            details["address"] = " ".join(lines[-3:])

    # Name extraction (heuristic: line near DOB or top of card)
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    for i, line in enumerate(lines):
        if "DOB" in line or "Year of Birth" in line:
            if i > 0:
                name_line = lines[i - 1].strip()
                parts = name_line.split(" ")
                details["firstname"] = parts[0]
                if len(parts) > 1:
                    details["lastname"] = " ".join(parts[1:])
            break
    if not details["firstname"] and len(lines) > 1:
        # fallback: take second line (usually name line)
        parts = lines[1].split(" ")
        details["firstname"] = parts[0]
        if len(parts) > 1:
            details["lastname"] = " ".join(parts[1:])

    return details

def extract_from_image(image_path):
    img = preprocess_image(image_path)
    text = pytesseract.image_to_string(img, lang="eng")
    return extract_from_text(text)

def extract_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    if not text.strip():
        # Fallback to OCR if no text layer
        images = convert_from_path(pdf_path)
        for img in images:
            text += pytesseract.image_to_string(img, lang="eng") + "\n"

    return extract_from_text(text)

def process_folder(folder_path, output_csv="aadhaar_output.csv"):
    all_data = []
    for file in os.listdir(folder_path):
        try:
            full_path = os.path.join(folder_path, file)
            if os.path.isfile(full_path):
                if file.lower().endswith(".pdf"):
                    details = extract_from_pdf(full_path)
                elif file.lower().endswith((".jpg", ".jpeg", ".png")):
                    details = extract_from_image(full_path)
                    print(details)
                else:
                    continue  # skip unsupported files
                details["source_file"] = file
                all_data.append(details)
        except Exception as e:
            print(f"❌ Error processing {file}: {e}")

    df = pd.DataFrame(all_data)
    df.to_csv(output_csv, index=False)
    print(f"✅ Processed {len(all_data)} files. Data saved to {output_csv}")

# Example usage
if __name__ == "__main__":
    folder = "aadhaar_files"   # folder containing Aadhaar files
    process_folder(folder)