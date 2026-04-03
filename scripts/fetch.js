// Read and parse JSON file
// Reference: Google Gemini
export async function fetchJSON(filepath) {
    try {
        const response = await fetch(filepath);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json(); 
    } catch (error) {
        console.error(`Failed to fetch data from ${filepath}:`, error);
        return null;
    }
}