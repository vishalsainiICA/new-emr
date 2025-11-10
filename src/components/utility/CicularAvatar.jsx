
export function CircularAvatar() {

    return <div
        style={{
            width: '40px',
            height: '40px',
            border: "1px solid black",
            borderRadius: '50px',
            backgroundColor: 'lightgrey',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}
    >
        <h2>E</h2>
    </div>

}


import axios from "axios";

export async function extractTextFromImage(file) {
    const formData = new FormData();
    formData.append("apikey", "K87595561088957"); // 🔑 your OCR.Space key
    formData.append("language", "eng");
    formData.append("file", file);

    const response = await axios.post("https://api.ocr.space/Parse/Image", formData, {
        headers: { ...formData.getHeaders },
        maxBodyLength: Infinity,
    });

    const data = response.data;
    if (data?.ParsedResults?.length > 0) {
        let text = data.ParsedResults[0].ParsedText || "";
        text = text
            .replace(/'/g, "`")
            .replace(/\n/g, "; ")
            .replace(/\r/g, "")
            .replace(/\t/g, " ");
        return text;
    }
    return "";
}

export function parseAadhaarText(text) {
    const nameMatch = text.match(/([A-Z][a-z]+\s[A-Z][a-z]+)/);
    const dobMatch = text.match(/DOB[:\s-]*(\d{2}\/\d{2}\/\d{4})/i);
    const genderMatch = text.match(/\b(MALE|FEMALE|TRANSGENDER)\b/i);
    const aadhaarMatch = text.match(/\b\d{4}\s\d{4}\s\d{4}\b/);

    // Extract the address portion (everything after 'Address:' or similar)
    const addressMatch = text.match(/Address[:\s-]*(.*)/i);

    let address = addressMatch ? addressMatch[1].replace(/\s+/g, " ").trim() : "";

    // Extract PIN Code (6-digit)
    const pinMatch = text.match(/\b\d{6}\b/);
    const pinCode = pinMatch ? pinMatch[0] : "";

    // Extract State (basic pattern to catch Rajasthan, Maharashtra, etc.)
    const stateMatch = text.match(
        /\b(Andhra Pradesh|Arunachal Pradesh|Assam|Bihar|Chhattisgarh|Goa|Gujarat|Haryana|Himachal Pradesh|Jharkhand|Karnataka|Kerala|Madhya Pradesh|Maharashtra|Manipur|Meghalaya|Mizoram|Nagaland|Odisha|Punjab|Rajasthan|Sikkim|Tamil Nadu|Telangana|Tripura|Uttar Pradesh|Uttarakhand|West Bengal|Delhi|Puducherry|Chandigarh|Jammu and Kashmir)\b/i
    );
    const state = stateMatch ? stateMatch[0] : "";

    // Try to extract City (just before state or pin)
    let city = "";
    if (state && text.includes(state)) {
        const cityPart = text.split(state)[0];
        const cityMatch = cityPart.match(/([A-Za-z]+)[,\s;]*$/);
        city = cityMatch ? cityMatch[1] : "";
    }

    return {
        name: nameMatch ? nameMatch[1] : "",
        DOB: dobMatch ? dobMatch[1] : "",
        gender: genderMatch ? genderMatch[1].toUpperCase() : "",
        aadhaarNumber: aadhaarMatch ? aadhaarMatch[0] : "",
        address,
        city,
        state,
        pinCode,
    };
}


export const CurrentStep = ({ currentStep, totalSteps }) => {
    // calculate progress in %
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div style={{ margin: "10px 0" }}>
            {/* Step text */}
            <p style={{ fontWeight: "500", marginBottom: "6px" }}>
                Step {currentStep} of {totalSteps}
            </p>

            {/* Progress Bar */}
            <div
                style={{
                    height: "8px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "4px",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: `${progress}%`,
                        backgroundColor: "#007bff",
                        height: "100%",
                        transition: "width 0.3s ease",
                    }}
                ></div>
            </div>
        </div>
    );
};
export const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"
];


export const dummyDepartments = [
    { image: new URL('../../assets/DepartmentsImages/cardiology.png', import.meta.url).href, name: "Cardiology" },
    { image: new URL('../../assets/DepartmentsImages/audiologist.png', import.meta.url).href, name: "ENT" },
    { image: new URL('../../assets/DepartmentsImages/medical.png', import.meta.url).href, name: "Radiology" },
    { image: new URL('../../assets/DepartmentsImages/arthritis.png', import.meta.url).href, name: "Orthopedics" },
    { image: new URL('../../assets/DepartmentsImages/pediatrics.png', import.meta.url).href, name: "Pediatrics" },
    { image: new URL('../../assets/DepartmentsImages/anesthesia.png', import.meta.url).href, name: "General Surgery" },
    { image: new URL('../../assets/DepartmentsImages/skin.png', import.meta.url).href, name: "Dermatology" },
    { image: new URL('../../assets/DepartmentsImages/neurology.png', import.meta.url).href, name: "Neurology" },
];

