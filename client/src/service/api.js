
// fetch post data
export const fetchPostData = async (date) => {
  const apiUrl = `http://localhost:5000/posts/`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    console.log(data);
    return data;

  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
