document.addEventListener('DOMContentLoaded', () => {
  const newsTab = document.getElementById('news-tab');
  const aiTab = document.getElementById('ai-tab');
  const newsSection = document.getElementById('news-section');
  const aiSection = document.getElementById('ai-section');
  const newsContainer = document.getElementById('news-container');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const typingIndicator = document.getElementById('typing-indicator');

  // Tab switching
  newsTab.addEventListener('click', () => {
    newsTab.classList.add('active');
    aiTab.classList.remove('active');
    newsSection.classList.add('active');
    aiSection.classList.remove('active');
  });

  aiTab.addEventListener('click', () => {
    aiTab.classList.add('active');
    newsTab.classList.remove('active');
    aiSection.classList.add('active');
    newsSection.classList.remove('active');
  });

  // News fetching
  async function fetchNews() {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      displayNews(data.articles);
    } catch (error) {
      newsContainer.innerHTML = '<p>Error loading news. Please try again later.</p>';
      console.error('Error fetching news:', error);
    }
  }

  function displayNews(articles) {
    if (!articles || articles.length === 0) {
      newsContainer.innerHTML = '<p>No news available.</p>';
      return;
    }
    newsContainer.innerHTML = articles.map(article => `
      <div class="article">
        <h2>${article.title}</h2>
        <p>${article.description || 'No description available.'}</p>
        <p><strong>Source:</strong> ${article.source.name}</p>
        <p><strong>Published:</strong> ${new Date(article.publishedAt).toLocaleString()}</p>
        <a href="${article.url}" target="_blank">Read more</a>
      </div>
    `).join('');
  }

  // AI Chat
  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage('user', message);
    chatInput.value = '';

    // Show typing indicator
    typingIndicator.classList.remove('hidden');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      typingIndicator.classList.add('hidden');
      if (data.reply) {
        addMessage('ai', `<strong>Akin Sokpah:</strong> ${data.reply}`);
      } else {
        addMessage('ai', '<strong>Akin Sokpah:</strong> Sorry, I couldn\'t process that.');
      }
    } catch (error) {
      typingIndicator.classList.add('hidden');
      addMessage('ai', '<strong>Akin Sokpah:</strong> Error connecting to AI service.');
      console.error('Chat error:', error);
    }
  }

  function addMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Initial load
  fetchNews();
  setInterval(fetchNews, 5 * 60 * 1000); // Refresh news every 5 minutes
});
