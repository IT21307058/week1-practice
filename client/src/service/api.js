const { getToken } = require('../helper/token');


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

export const deletePost = async (postId) => {
  const token = getToken();
  console.log("Deleting post with ID:", postId);
  const response = await fetch(`http://localhost:5000/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  if (!response.ok) throw new Error('Failed to delete post');
  return response.json();
};

export const createPost = async (formData) => {
  const token = getToken();

  const response = await fetch('http://localhost:5000/posts/upload', {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  if (!response.ok) throw new Error('Failed to create post');
  return response.json();
};