const URL = `https://picsum.photos/v2/list?limit=50`;

export const getAllImagesList = async () => {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Images list:", error);
    return null;
  }
};
