const axios = require('axios');
require('dotenv').config();

// Environment Variables
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const PAGE_ID = process.env.PAGE_ID;
const GRAPH_API_URL = 'https://graph.facebook.com/v12.0';
const KEYWORDS = ['example', 'keyword', 'bot']; // Customize keywords
const INTERVAL = 60000; // 60 seconds

// Function to get recent posts
async function getPosts() {
  try {
    const response = await axios.get(`${GRAPH_API_URL}/${PAGE_ID}/feed`, {
      params: {
        access_token: ACCESS_TOKEN,
        fields: 'id,message',
        limit: 10, // Fetch up to 10 recent posts
      },
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching posts:', error.response?.data || error.message);
    return [];
  }
}

// Function to comment on a post
async function commentOnPost(postId, comment) {
  try {
    const response = await axios.post(`${GRAPH_API_URL}/${postId}/comments`, {
      access_token: ACCESS_TOKEN,
      message: comment,
    });
    console.log(`Commented on post ${postId}: "${comment}"`);
  } catch (error) {
    console.error(`Error commenting on post ${postId}:`, error.response?.data || error.message);
  }
}

// Function to monitor posts and comment based on keywords
async function monitorAndComment() {
  try {
    console.log('Fetching recent posts...');
    const posts = await getPosts();

    for (const post of posts) {
      const postMessage = post.message?.toLowerCase() || '';
      if (KEYWORDS.some((keyword) => postMessage.includes(keyword))) {
        const comment = 'This is an automated comment based on your post!';
        await commentOnPost(post.id, comment);
      }
    }

    console.log('Finished checking posts. Waiting for next cycle...');
  } catch (error) {
    console.error('Error in monitoring function:', error.message);
  }
}

// Run the bot at intervals
setInterval(monitorAndComment, INTERVAL);

// Initial run
monitorAndComment();
