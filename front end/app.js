// Available Models

const MODELS = [
  {
    id: 'mav',
    name: 'MAV',
    version: 'MAV',
    badge: 'Local',
    desc: 'Your local MAV AI assistant powered by Ollama.'
  }
];

// Application State

const state = {
  conversations: [],
  activeChatId: null,
  currentModel: 'mav',
  pendingImages: [],
  isGenerating: false,
  abortController: null,
  isRecording: false,
  speechRecognition: null,
  theme: localStorage.getItem('mav_theme') || 'dark',
  settings: {
    apiKey: '',
    simSpeed: localStorage.getItem('mav_sim_speed') || 'normal',
    systemPrompt: localStorage.getItem('mav_sys_prompt') ||
      'You are MAV, a helpful personal AI assistant.'
  }
};

// DOM Elements
const elements = {
  sidebar: document.getElementById('sidebar'),
  sidebarOverlay: document.getElementById('sidebar-overlay'),
  toggleSidebarBtn: document.getElementById('toggle-sidebar-btn'),
  mobileSidebarOpen: document.getElementById('mobile-sidebar-open'),
  desktopSidebarOpen: document.getElementById('desktop-sidebar-open'),
  newChatBtn: document.getElementById('new-chat-btn'),
  searchChatsInput: document.getElementById('search-chats-input'),
  chatHistoryContainer: document.getElementById('chat-history-container'),
  
  modelDropdownTrigger: document.getElementById('model-dropdown-trigger'),
  modelDropdownMenu: document.getElementById('model-dropdown-menu'),
  currentModelDisplay: document.getElementById('current-model-display'),
  currentModelTag: document.getElementById('current-model-tag'),
  quickBadgeText: document.getElementById('quick-badge-text'),
  modelListOptions: document.getElementById('model-list-options'),
  
  messagesContainer: document.getElementById('messages-container'),
  messagesStream: document.getElementById('messages-stream'),
  welcomeScreen: document.getElementById('welcome-screen'),
  
  promptTextarea: document.getElementById('prompt-textarea'),
  inputContainerBox: document.getElementById('input-container-box'),
  dragDropOverlay: document.getElementById('drag-drop-overlay'),
  sendMessageBtn: document.getElementById('send-message-btn'),
  sendIcon: document.getElementById('send-icon'),
  stopIcon: document.getElementById('stop-icon'),
  
  photoFileInput: document.getElementById('photo-file-input'),
  attachPhotoBtn: document.getElementById('attach-photo-btn'),
  imagePreviewsStrip: document.getElementById('image-previews-strip'),
  
  voiceMicBtn: document.getElementById('voice-mic-btn'),
  micPulseRing: document.getElementById('mic-pulse-ring'),
  voiceRecordingBanner: document.getElementById('voice-recording-banner'),
  cancelVoiceBtn: document.getElementById('cancel-voice-btn'),
  
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  themeIcon: document.getElementById('theme-icon'),
  themeLabel: document.getElementById('theme-label'),
  
  openSettingsBtn: document.getElementById('open-settings-btn'),
  settingsModal: document.getElementById('settings-modal'),
  closeSettingsBtn: document.getElementById('close-settings-btn'),
  saveSettingsBtn: document.getElementById('save-settings-btn'),
  apiKeyInput: document.getElementById('api-key-input'),
  simSpeedSelect: document.getElementById('sim-speed-select'),
  systemPromptInput: document.getElementById('system-prompt-input'),
  clearAllDataBtn: document.getElementById('clear-all-data-btn'),
  
  exportChatBtn: document.getElementById('export-chat-btn'),
  clearChatBtn: document.getElementById('clear-chat-btn'),
  
  imageLightbox: document.getElementById('image-lightbox'),
  lightboxImg: document.getElementById('lightbox-img'),
  closeLightboxBtn: document.getElementById('close-lightbox-btn')
};
function speakMAV(text) {
  if (!("speechSynthesis" in window)) {
    console.log("Speech synthesis is not supported.");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  const voices = window.speechSynthesis.getVoices();

  const voice =
    voices.find(v => v.lang.startsWith("en-IN")) ||
    voices.find(v => v.lang.startsWith("en-US")) ||
    voices.find(v => v.lang.startsWith("en-GB"));

  if (voice) {
    utterance.voice = voice;
  }

  window.speechSynthesis.speak(utterance);
}


function init() {
  applyTheme(state.theme);
  loadConversationsFromStorage();
  renderModelDropdown();
  updateModelUI(state.currentModel);
  initSpeechRecognition();
  bindEvents();

  if (state.conversations.length > 0) {
    selectConversation(state.conversations[0].id);
  } else {
    createNewConversation();
  }

  lucide.createIcons();
}
function init() {
  applyTheme(state.theme);
  loadConversationsFromStorage();
  renderModelDropdown();
  updateModelUI(state.currentModel);
  initSpeechRecognition();
  bindEvents();

  if (state.conversations.length > 0) {
    selectConversation(state.conversations[0].id);
  } else {
    createNewConversation();
  }

  lucide.createIcons();
}

function applyTheme(theme) {
  state.theme = theme;
  localStorage.setItem('chatgpt_theme', theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    elements.themeIcon.setAttribute('data-lucide', 'moon');
    elements.themeLabel.textContent = 'Dark Mode';
  } else {
    document.documentElement.classList.remove('dark');
    elements.themeIcon.setAttribute('data-lucide', 'sun');
    elements.themeLabel.textContent = 'Light Mode';
  }
  lucide.createIcons();
}

function toggleTheme() {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
}

function renderModelDropdown() {
  elements.modelListOptions.innerHTML = MODELS.map(model => `
    <button class="model-option w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${model.id === state.currentModel ? 'bg-zinc-800 border border-zinc-700' : 'hover:bg-zinc-800/60'}" data-model-id="${model.id}">
      <div class="mt-0.5 w-6 h-6 rounded-lg bg-zinc-700/50 flex items-center justify-center text-xs font-semibold text-brand-500">
        <i data-lucide="cpu" class="w-3.5 h-3.5"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-zinc-100">${model.name} ${model.version}</span>
          <span class="text-[10px] text-zinc-400 bg-zinc-700/50 px-1.5 py-0.5 rounded font-mono">${model.badge}</span>
        </div>
        <p class="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">${model.desc}</p>
      </div>
    </button>
  `).join('');

  elements.modelListOptions.querySelectorAll('.model-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const modelId = btn.getAttribute('data-model-id');
      selectModel(modelId);
      elements.modelDropdownMenu.classList.add('hidden');
    });
  });

  lucide.createIcons();
}

function selectModel(modelId) {
  state.currentModel = modelId;
  const activeChat = getActiveConversation();
  if (activeChat) {
    activeChat.model = modelId;
    saveConversationsToStorage();
  }
  updateModelUI(modelId);
  renderModelDropdown();
}

function updateModelUI(modelId) {
  const model = MODELS.find(m => m.id === modelId) || MODELS[0];
  elements.currentModelDisplay.innerHTML = `
    <span class="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
    ${model.name}
  `;
  elements.currentModelTag.textContent = model.version;
  elements.quickBadgeText.textContent = model.version;
}

function loadConversationsFromStorage() {
  try {
    const raw = localStorage.getItem('chatgpt_conversations');
    if (raw) {
      state.conversations = JSON.parse(raw);
    }
  } catch (err) {
    state.conversations = [];
  }
}

function saveConversationsToStorage() {
  try {
    localStorage.setItem('chatgpt_conversations', JSON.stringify(state.conversations));
  } catch (err) {}
}

function getActiveConversation() {
  return state.conversations.find(c => c.id === state.activeChatId);
}

function selectConversation(id) {
  const chat = state.conversations.find(c => c.id === id);

  if (!chat) return;

  state.activeChatId = id;
  state.currentModel = chat.model || 'mav';

  updateModelUI(state.currentModel);
  renderChatHistory();
  renderMessages();

  elements.promptTextarea.focus();
}

async function createNewConversation() {
  try {
    const response = await fetch('http://127.0.0.1:8000/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`MAV API error (${response.status})`);
    }

    const serverChat = await response.json();

    const newChat = {
      id: serverChat.id,
      title: serverChat.title || 'New chat',
      model: state.currentModel,
      createdAt: Date.parse(serverChat.created_at) || Date.now(),
      updatedAt: Date.parse(serverChat.updated_at) || Date.now(),
      messages: serverChat.messages || []
    };

    state.conversations.unshift(newChat);
    state.activeChatId = newChat.id;

    saveConversationsToStorage();
    renderChatHistory();
    renderMessages();

    elements.promptTextarea.focus();
    closeMobileSidebar();

  } catch (err) {
    console.error('Failed to create MAV conversation:', err);

    /*
     * Fallback so the UI still works if the API
     * isn't available.
     */
    const newChat = {
      id: 'chat_' + Date.now(),
      title: 'New chat',
      model: state.currentModel,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    };

    state.conversations.unshift(newChat);
    state.activeChatId = newChat.id;

    saveConversationsToStorage();
    renderChatHistory();
    renderMessages();

    elements.promptTextarea.focus();
    closeMobileSidebar();
  }
}

function renameConversation(id, newTitle) {
  const chat = state.conversations.find(c => c.id === id);
  if (chat && newTitle && newTitle.trim()) {
    chat.title = newTitle.trim();
    chat.updatedAt = Date.now();
    saveConversationsToStorage();
    renderChatHistory();
  }
}

function deleteConversation(id, e) {
  if (e) e.stopPropagation();
  state.conversations = state.conversations.filter(c => c.id !== id);
  saveConversationsToStorage();

  if (state.activeChatId === id) {
    if (state.conversations.length > 0) {
      selectConversation(state.conversations[0].id);
    } else {
      createNewConversation();
    }
  } else {
    renderChatHistory();
  }
}

function clearCurrentMessages() {
  const chat = getActiveConversation();
  if (chat) {
    chat.messages = [];
    chat.updatedAt = Date.now();
    saveConversationsToStorage();
    renderMessages();
  }
}

function renderChatHistory(filterQuery = '') {
  const container = elements.chatHistoryContainer;
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;

  const filtered = state.conversations.filter(c => {
    if (!filterQuery) return true;
    return c.title.toLowerCase().includes(filterQuery.toLowerCase());
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="text-center py-6 text-xs text-zinc-500">No conversations found</div>`;
    return;
  }

  const groups = { today: [], yesterday: [], previous7Days: [], older: [] };

  filtered.forEach(chat => {
    const diff = now - chat.updatedAt;
    if (diff < ONE_DAY) groups.today.push(chat);
    else if (diff < 2 * ONE_DAY) groups.yesterday.push(chat);
    else if (diff < 7 * ONE_DAY) groups.previous7Days.push(chat);
    else groups.older.push(chat);
  });

  let html = '';
  const renderGroup = (title, chats) => {
    if (chats.length === 0) return '';
    return `
      <div>
        <div class="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-2 py-1">${title}</div>
        <div class="space-y-0.5 mt-1">
          ${chats.map(c => `
            <div 
              class="chat-history-item group relative flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${c.id === state.activeChatId ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}"
              data-chat-id="${c.id}"
            >
              <div class="flex items-center gap-2 truncate flex-1 pr-2">
                <i data-lucide="message-square" class="w-3.5 h-3.5 shrink-0 opacity-70"></i>
                <span class="truncate chat-title-span">${escapeHtml(c.title)}</span>
              </div>
              <div class="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0">
                <button class="rename-chat-btn p-1 hover:text-white rounded hover:bg-zinc-700" title="Rename" data-chat-id="${c.id}">
                  <i data-lucide="edit-3" class="w-3 h-3"></i>
                </button>
                <button class="delete-chat-btn p-1 hover:text-red-400 rounded hover:bg-zinc-700" title="Delete" data-chat-id="${c.id}">
                  <i data-lucide="trash-2" class="w-3 h-3"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };

  html += renderGroup('Today', groups.today);
  html += renderGroup('Yesterday', groups.yesterday);
  html += renderGroup('Previous 7 Days', groups.previous7Days);
  html += renderGroup('Older', groups.older);

  container.innerHTML = html;

  container.querySelectorAll('.chat-history-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.rename-chat-btn') || e.target.closest('.delete-chat-btn')) return;
      selectConversation(item.getAttribute('data-chat-id'));
    });
  });

  container.querySelectorAll('.rename-chat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const chatId = btn.getAttribute('data-chat-id');
      const chat = state.conversations.find(c => c.id === chatId);
      if (!chat) return;
      const newTitle = prompt('Rename conversation:', chat.title);
      if (newTitle !== null) renameConversation(chatId, newTitle);
    });
  });

  container.querySelectorAll('.delete-chat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const chatId = btn.getAttribute('data-chat-id');
      if (confirm('Delete this conversation?')) deleteConversation(chatId, e);
    });
  });

  lucide.createIcons();
}

function renderMessages() {
  const chat = getActiveConversation();
  const stream = elements.messagesStream;

  if (!chat || chat.messages.length === 0) {
    stream.innerHTML = '';
    stream.appendChild(elements.welcomeScreen);
    elements.welcomeScreen.classList.remove('hidden');
    return;
  }

  elements.welcomeScreen.classList.add('hidden');
  stream.innerHTML = '';

  chat.messages.forEach((msg, index) => {
    const msgEl = createMessageElement(msg, index === chat.messages.length - 1 && state.isGenerating);
    stream.appendChild(msgEl);
  });

  scrollToBottom();
  lucide.createIcons();
}

function createMessageElement(msg, isCurrentlyStreaming = false) {
  const isUser = msg.role === 'user';
  const wrapper = document.createElement('div');
  wrapper.className = `flex gap-4 message-row animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`;

  if (isUser) {
    let imagesHtml = '';
    if (msg.images && msg.images.length > 0) {
      imagesHtml = `
        <div class="flex flex-wrap gap-2 mb-2">
          ${msg.images.map(img => `
            <img src="${img.dataUrl}" alt="${escapeHtml(img.name || 'Photo')}" class="w-24 h-24 rounded-xl object-cover border border-zinc-700 shadow-sm cursor-pointer hover:opacity-90 transition-opacity chat-thumbnail" onclick="openLightbox('${img.dataUrl}')">
          `).join('')}
        </div>
      `;
    }

    wrapper.innerHTML = `
      <div class="max-w-[85%] md:max-w-[75%] flex flex-col items-end">
        ${imagesHtml}
        <div class="user-bubble bg-chat-bubbleDark text-zinc-100 px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm break-words whitespace-pre-wrap shadow-sm">
          ${escapeHtml(msg.content)}
        </div>
      </div>
    `;
  } else {
    const model = MODELS.find(m => m.id === (msg.model || state.currentModel)) || MODELS[0];
    const parsedMarkdown = renderMarkdownContent(msg.content);

    wrapper.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center font-bold text-white text-xs shrink-0 mt-0.5 shadow-md shadow-brand-500/10">
        <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
      </div>
      <div class="flex-1 min-w-0 max-w-[92%]">
        <div class="flex items-center gap-2 mb-1 text-[11px] text-zinc-400">
          <span class="font-medium text-zinc-300">${model.name} ${model.version}</span>
          <span>•</span>
          <span>${formatTime(msg.timestamp || Date.now())}</span>
        </div>
        <div class="assistant-bubble markdown-body text-zinc-200 text-sm ${isCurrentlyStreaming ? 'streaming-cursor' : ''}">
          ${parsedMarkdown}
        </div>
        ${!isCurrentlyStreaming ? `
          <div class="flex items-center gap-2 mt-3 pt-1 text-zinc-400 text-xs">
            <button class="copy-response-btn hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors" title="Copy response">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i>
            </button>
            <button class="speak-response-btn hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors" title="Read aloud">
              <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
            </button>
            <button class="regenerate-btn hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors" title="Regenerate">
              <i data-lucide="rotate-cw" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        ` : ''}
      </div>
    `;

    const copyBtn = wrapper.querySelector('.copy-response-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(msg.content);
        copyBtn.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5 text-green-400"></i>';
        lucide.createIcons();
        setTimeout(() => {
          copyBtn.innerHTML = '<i data-lucide="copy" class="w-3.5 h-3.5"></i>';
          lucide.createIcons();
        }, 1500);
      });
    }

    const speakBtn = wrapper.querySelector('.speak-response-btn');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => speakText(msg.content, speakBtn));
    }

    const regenBtn = wrapper.querySelector('.regenerate-btn');
    if (regenBtn) {
      regenBtn.addEventListener('click', () => regenerateLastResponse());
    }
  }

  setupCodeCopyButtons(wrapper);
  return wrapper;
}

function renderMarkdownContent(content) {
  if (!content) return '';
  const renderer = new marked.Renderer();
  renderer.code = function({ text, lang }) {
    const validLang = !!(lang && hljs.getLanguage(lang)) ? lang : 'plaintext';
    let highlighted;
    try {
      highlighted = hljs.highlight(text, { language: validLang }).value;
    } catch (e) {
      highlighted = escapeHtml(text);
    }

    return `
      <div class="code-block-wrapper">
        <div class="code-header-bar">
          <span>${validLang}</span>
          <button class="code-copy-btn" data-code="${encodeURIComponent(text)}">
            <i data-lucide="copy" class="w-3 h-3"></i>
            <span>Copy code</span>
          </button>
        </div>
        <pre><code class="hljs ${validLang}">${highlighted}</code></pre>
      </div>
    `;
  };

  marked.setOptions({ renderer: renderer, gfm: true, breaks: true });
  return marked.parse(content);
}

function setupCodeCopyButtons(container) {
  container.querySelectorAll('.code-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = decodeURIComponent(btn.getAttribute('data-code'));
      navigator.clipboard.writeText(code);
      const span = btn.querySelector('span');
      const oldText = span.textContent;
      span.textContent = 'Copied!';
      btn.classList.add('text-green-400');
      setTimeout(() => {
        span.textContent = oldText;
        btn.classList.remove('text-green-400');
      }, 2000);
    });
  });
}

function scrollToBottom() {
  elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
}

async function handleSendMessage() {
  const text = elements.promptTextarea.value.trim();
  const images = [...state.pendingImages];

  if ((!text && images.length === 0) || state.isGenerating) return;

  const chat = getActiveConversation();
  if (!chat) return;

  if (state.isRecording) stopSpeechRecognition();

  const userMessage = {
    id: 'msg_' + Date.now(),
    role: 'user',
    content: text,
    images: images,
    timestamp: Date.now()
  };

  chat.messages.push(userMessage);
  chat.updatedAt = Date.now();

  if (chat.messages.filter(m => m.role === 'user').length === 1) {
    chat.title = text
      ? (text.slice(0, 30) + (text.length > 30 ? '...' : ''))
      : 'Vision Analysis';
  }

  elements.promptTextarea.value = '';
  elements.promptTextarea.style.height = 'auto';
  clearPendingImages();
  updateSendButtonState();
  saveConversationsToStorage();
  renderChatHistory();
  renderMessages();

  const assistantMessage = {
    id: 'msg_' + (Date.now() + 1),
    role: 'assistant',
    model: 'MAV',
    content: '',
    timestamp: Date.now()
  };

  chat.messages.push(assistantMessage);
  state.isGenerating = true;
  updateSendButtonState();
  renderMessages();

  try {
    /*
     * Send the frontend conversation ID to MAV.
     *
     * The frontend chat object already has an ID.
     * We use that ID so the backend can keep the
     * same conversation in conversations.json.
     */
    const response = await fetch('http://127.0.0.1:8000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: text,
        chat_id: chat.id
      })
    });

    if (!response.ok) {
      throw new Error(`MAV API error (${response.status})`);
    }

    const data = await response.json();
    speakMAV(data.response);
    
    

    /*
     * The backend may return a newly-created chat ID.
     * Keep the frontend synchronized with it.
     */
    if (data.chat_id && chat.id !== data.chat_id) {
      chat.id = data.chat_id;
    }

    assistantMessage.content =
      data.response || 'MAV returned an empty response.';

    chat.updatedAt = Date.now();

  } catch (err) {
    assistantMessage.content =
      `⚠️ **MAV connection error**\n\n${err.message}\n\n` +
      `Make sure the MAV API is running on ` +
      `http://127.0.0.1:8000`;
  }

  state.isGenerating = false;
  updateSendButtonState();
  saveConversationsToStorage();
  renderChatHistory();
  renderMessages();
}

async function simulateStreamingResponse(chat, assistantMessage, userMessage) {
  const userPrompt = (userMessage.content || '').toLowerCase();
  const hasImages = userMessage.images && userMessage.images.length > 0;
  const activeModel = MODELS.find(m => m.id === state.currentModel) || MODELS[0];

  let simulatedResponse = '';

  if (hasImages) {
    simulatedResponse = `### 🔍 Visual Analysis with **${activeModel.version}**\n\n` +
      `I've analyzed the **${userMessage.images.length} photo(s)** you provided:\n\n` +
      `- **Visual Composition**: The uploaded image is high resolution with clear contrast and subjects.\n` +
      `- **Context & Key Elements**: Identified visual components, layout architecture, and color palette.\n` +
      `- **Extracted Information**: All key objects and metadata have been processed into the multimodal pipeline.\n\n` +
      (userMessage.content ? `To answer your question (*"${userMessage.content}"*):\n\nBased on what is depicted in the photo, the elements align directly with your query. Let me know if you would like me to crop, extract text (OCR), or detect specific visual details!` : `How can I help you inspect, describe, or transform this image?`);
  } else if (userPrompt.includes('code') || userPrompt.includes('python') || userPrompt.includes('script') || userPrompt.includes('function') || userPrompt.includes('javascript') || userPrompt.includes('scraper')) {
    simulatedResponse = `Here is a complete, production-ready implementation tailored to your request:\n\n` +
      `\`\`\`python\n` +
      `import requests\n` +
      `import time\n` +
      `from typing import Optional, Dict, Any\n\n` +
      `class WebWorker:\n` +
      `    """Worker implementation with automated retries and error handling."""\n` +
      `    def __init__(self, base_url: str, timeout: int = 10):\n` +
      `        self.base_url = base_url\n` +
      `        self.timeout = timeout\n` +
      `        self.session = requests.Session()\n\n` +
      `    def fetch_data(self, endpoint: str, max_retries: int = 3) -> Optional[Dict[str, Any]]:\n` +
      `        url = f"{self.base_url}/{endpoint.lstrip('/')}"\n` +
      `        for attempt in range(1, max_retries + 1):\n` +
      `            try:\n` +
      `                response = self.session.get(url, timeout=self.timeout)\n` +
      `                response.raise_for_status()\n` +
      `                return response.json()\n` +
      `            except requests.RequestException as err:\n` +
      `                print(f"[Attempt {attempt}/{max_retries}] Error fetching {url}: {err}")\n` +
      `                if attempt < max_retries:\n` +
      `                    time.sleep(2 ** attempt)  # Exponential backoff\n` +
      `        return None\n\n` +
      `# Example execution\n` +
      `if __name__ == "__main__":\n` +
      `    client = WebWorker("https://api.github.com")\n` +
      `    data = client.fetch_data("zen")\n` +
      `    print("Status Result:", data)\n` +
      `\`\`\`\n\n` +
      `### Key Features:\n` +
      `1. **Exponential Backoff**: Prevents server flooding upon temporary failure.\n` +
      `2. **Type Hinting**: Clean type annotations for high code maintainability.\n` +
      `3. **Session Re-use**: Optimizes connection pooling with \`requests.Session()\`.`;
  } else if (userPrompt.includes('quantum') || userPrompt.includes('explain')) {
    simulatedResponse = `### Understanding Quantum Computing\n\n` +
      `Classical computers store information in **bits** that represent either a \`0\` or a \`1\`.\n` +
      `Quantum computers use **qubits**, which leverage quantum mechanics principles:\n\n` +
      `1. **Superposition**: A qubit can represent both \`0\` and \`1\` simultaneously until measured.\n` +
      `2. **Entanglement**: Qubits can become linked such that the state of one instantly informs another, regardless of distance.\n` +
      `3. **Interference**: Used to cancel out wrong answers and amplify correct computational paths.\n\n` +
      `> Quantum computing does not replace classical machines for ordinary tasks; rather, it excels at specific problem spaces like **molecular simulation**, **cryptography**, and **optimization**!`;
  } else {
    simulatedResponse = `Hello! I'm **${activeModel.name}** (*${activeModel.version}*).\n\n` +
      `Thank you for your message:\n` +
      `> "${userMessage.content}"\n\n` +
      `Here are a few ways we can proceed:\n` +
      `- **Elaborate**: I can dive deeper into any specific aspect of this topic.\n` +
      `- **Draft & Create**: Need an outline, code, email, or summary? Just ask.\n` +
      `- **Visual or Voice**: You can attach photos using the paperclip or speak directly using the microphone button below!\n\n` +
      `What would you like to explore next?`;
  }

  const delayMap = { fast: 12, normal: 25, instant: 0 };
  const delay = delayMap[state.settings.simSpeed] ?? 25;

  const stream = elements.messagesStream;
  const msgElements = stream.querySelectorAll('.message-row');
  const lastMsgEl = msgElements[msgElements.length - 1];
  const bubble = lastMsgEl.querySelector('.assistant-bubble');

  for (let i = 0; i < simulatedResponse.length; i++) {
    if (!state.isGenerating) break;
    assistantMessage.content += simulatedResponse[i];
    if (i % 3 === 0 || i === simulatedResponse.length - 1) {
      bubble.innerHTML = renderMarkdownContent(assistantMessage.content);
      scrollToBottom();
    }
    if (delay > 0) {
      await new Promise(res => setTimeout(res, delay));
    }
  }

  bubble.classList.remove('streaming-cursor');
}

async function streamFromRealAPI(chat, assistantMessage) {
  state.abortController = new AbortController();
  const activeModel = state.currentModel.startsWith('gpt') ? state.currentModel : 'gpt-4o';

  try {
    const formattedMessages = [
      { role: 'system', content: state.settings.systemPrompt },
      ...chat.messages.slice(0, -1).map(m => {
        if (m.images && m.images.length > 0) {
          const contentParts = [{ type: 'text', text: m.content || 'Attached images' }];
          m.images.forEach(img => {
            contentParts.push({
              type: 'image_url',
              image_url: { url: img.dataUrl }
            });
          });
          return { role: m.role, content: contentParts };
        }
        return { role: m.role, content: m.content };
      })
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.settings.apiKey}`
      },
      body: JSON.stringify({
        model: activeModel,
        messages: formattedMessages,
        stream: true
      }),
      signal: state.abortController.signal
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `API error (${response.status})`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    const stream = elements.messagesStream;
    const msgElements = stream.querySelectorAll('.message-row');
    const lastMsgEl = msgElements[msgElements.length - 1];
    const bubble = lastMsgEl.querySelector('.assistant-bubble');

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      const lines = chunkValue.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const data = JSON.parse(line.slice(6));
            const delta = data.choices[0]?.delta?.content || '';
            assistantMessage.content += delta;
            bubble.innerHTML = renderMarkdownContent(assistantMessage.content);
            scrollToBottom();
          } catch (e) {}
        }
      }
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      assistantMessage.content = `⚠️ **Error calling API**: ${err.message}\n\n*Check your API key in Settings.*`;
      renderMessages();
    }
  }
}

function stopGenerating() {
  state.isGenerating = false;
  if (state.abortController) {
    state.abortController.abort();
    state.abortController = null;
  }
  updateSendButtonState();
  renderMessages();
}

function regenerateLastResponse() {
  const chat = getActiveConversation();
  if (!chat || chat.messages.length < 2 || state.isGenerating) return;

  if (chat.messages[chat.messages.length - 1].role === 'assistant') {
    chat.messages.pop();
  }

  const lastUserMsg = chat.messages[chat.messages.length - 1];
  if (!lastUserMsg) return;

  const assistantMessage = {
    id: 'msg_' + Date.now(),
    role: 'assistant',
    model: state.currentModel,
    content: '',
    timestamp: Date.now()
  };

  chat.messages.push(assistantMessage);
  state.isGenerating = true;
  updateSendButtonState();
  renderMessages();

  if (state.settings.apiKey) {
    streamFromRealAPI(chat, assistantMessage).then(() => {
      state.isGenerating = false;
      updateSendButtonState();
      saveConversationsToStorage();
      renderMessages();
    });
  } else {
    simulateStreamingResponse(chat, assistantMessage, lastUserMsg).then(() => {
      state.isGenerating = false;
      updateSendButtonState();
      saveConversationsToStorage();
      renderMessages();
    });
  }
}

function handlePhotoFiles(files) {
  if (!files || files.length === 0) return;

  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      state.pendingImages.push({
        id: 'img_' + Math.random().toString(36).substr(2, 9),
        dataUrl: e.target.result,
        name: file.name,
        size: file.size
      });
      renderPendingImagePreviews();
      updateSendButtonState();
    };
    reader.readAsDataURL(file);
  });
}

function renderPendingImagePreviews() {
  const strip = elements.imagePreviewsStrip;
  if (state.pendingImages.length === 0) {
    strip.classList.add('hidden');
    strip.innerHTML = '';
    return;
  }

  strip.classList.remove('hidden');
  strip.innerHTML = state.pendingImages.map(img => `
    <div class="preview-thumb-container">
      <img src="${img.dataUrl}" alt="${escapeHtml(img.name)}">
      <button class="preview-thumb-remove" onclick="removePendingImage('${img.id}')" title="Remove photo">
        <i data-lucide="x" class="w-2.5 h-2.5"></i>
      </button>
    </div>
  `).join('');

  lucide.createIcons();
}

window.removePendingImage = function(id) {
  state.pendingImages = state.pendingImages.filter(img => img.id !== id);
  renderPendingImagePreviews();
  updateSendButtonState();
};

function clearPendingImages() {
  state.pendingImages = [];
  renderPendingImagePreviews();
}

window.openLightbox = function(dataUrl) {
  elements.lightboxImg.src = dataUrl;
  elements.imageLightbox.classList.remove('hidden');
};

function closeLightbox() {
  elements.imageLightbox.classList.add('hidden');
  elements.lightboxImg.src = '';
}

function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      state.isRecording = true;
      elements.voiceRecordingBanner.classList.remove('hidden');
      elements.micPulseRing.classList.remove('hidden');
      elements.voiceMicBtn.classList.add('text-red-500', 'bg-red-500/10');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
      }

      if (finalTranscript) {
        const cur = elements.promptTextarea.value;
        elements.promptTextarea.value = (cur ? cur + ' ' : '') + finalTranscript.trim();
        adjustTextareaHeight();
        updateSendButtonState();
      }
    };

    recognition.onerror = () => stopSpeechRecognition();
    recognition.onend = () => stopSpeechRecognition();
    state.speechRecognition = recognition;
  } catch (err) {}
}

function toggleSpeechRecognition() {
  if (!state.speechRecognition) {
    alert('Voice input is not supported by your browser. Please use Chrome or Edge.');
    return;
  }
  if (state.isRecording) stopSpeechRecognition();
  else {
    try { state.speechRecognition.start(); } catch (e) {}
  }
}

function stopSpeechRecognition() {
  state.isRecording = false;
  elements.voiceRecordingBanner.classList.add('hidden');
  elements.micPulseRing.classList.add('hidden');
  elements.voiceMicBtn.classList.remove('text-red-500', 'bg-red-500/10');
  if (state.speechRecognition) {
    try { state.speechRecognition.stop(); } catch (e) {}
  }
}

function speakText(text, btnElement) {
  if (!('speechSynthesis' in window)) return;
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    if (btnElement) btnElement.classList.remove('text-brand-500');
    return;
  }

  const cleanText = text.replace(/[#*`_~\[\]]/g, '').replace(/```[\s\S]*?```/g, 'Code block omitted.');
  const utterance = new SpeechSynthesisUtterance(cleanText);
  if (btnElement) {
    btnElement.classList.add('text-brand-500');
    utterance.onend = () => btnElement.classList.remove('text-brand-500');
    utterance.onerror = () => btnElement.classList.remove('text-brand-500');
  }
  window.speechSynthesis.speak(utterance);
}

function updateSendButtonState() {
  const hasText = elements.promptTextarea.value.trim().length > 0;
  const hasImages = state.pendingImages.length > 0;

  if (state.isGenerating) {
    elements.sendMessageBtn.disabled = false;
    elements.sendIcon.classList.add('hidden');
    elements.stopIcon.classList.remove('hidden');
    elements.sendMessageBtn.title = 'Stop generating';
  } else {
    elements.sendIcon.classList.remove('hidden');
    elements.stopIcon.classList.add('hidden');
    elements.sendMessageBtn.title = 'Send message';
    elements.sendMessageBtn.disabled = !(hasText || hasImages);
  }
}

function adjustTextareaHeight() {
  const ta = elements.promptTextarea;
  ta.style.height = 'auto';
  ta.style.height = Math.min(ta.scrollHeight, 180) + 'px';
}

function closeMobileSidebar() {
  elements.sidebar.classList.add('-translate-x-full');
  elements.sidebarOverlay.classList.add('hidden');
}

function openMobileSidebar() {
  elements.sidebar.classList.remove('-translate-x-full');
  elements.sidebarOverlay.classList.remove('hidden');
}

function exportChat() {
  const chat = getActiveConversation();
  if (!chat || chat.messages.length === 0) return;

  let markdown = `# ${chat.title}\n*Model: ${chat.model} | Exported: ${new Date().toLocaleString()}*\n\n---\n\n`;
  chat.messages.forEach(m => {
    markdown += `### ${m.role === 'user' ? 'User' : 'Assistant'} (${formatTime(m.timestamp)})\n\n${m.content}\n\n`;
  });

  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${chat.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

function bindEvents() {
  elements.mobileSidebarOpen.addEventListener('click', openMobileSidebar);
  elements.sidebarOverlay.addEventListener('click', closeMobileSidebar);
  elements.toggleSidebarBtn.addEventListener('click', () => {
    if (window.innerWidth >= 768) {
      elements.sidebar.classList.toggle('md:hidden');
      elements.desktopSidebarOpen.classList.toggle('hidden');
    } else {
      closeMobileSidebar();
    }
  });
  elements.desktopSidebarOpen.addEventListener('click', () => {
    elements.sidebar.classList.remove('md:hidden');
    elements.desktopSidebarOpen.classList.add('hidden');
  });

  elements.newChatBtn.addEventListener('click', createNewConversation);
  elements.searchChatsInput.addEventListener('input', (e) => renderChatHistory(e.target.value));

  elements.modelDropdownTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    elements.modelDropdownMenu.classList.toggle('hidden');
  });
  document.addEventListener('click', (e) => {
    if (!elements.modelSelectorContainer.contains(e.target)) {
      elements.modelDropdownMenu.classList.add('hidden');
    }
  });

  elements.promptTextarea.addEventListener('input', () => {
    adjustTextareaHeight();
    updateSendButtonState();
  });

  elements.promptTextarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  elements.sendMessageBtn.addEventListener('click', () => {
    if (state.isGenerating) stopGenerating();
    else handleSendMessage();
  });

  elements.attachPhotoBtn.addEventListener('click', () => elements.photoFileInput.click());
  elements.photoFileInput.addEventListener('change', (e) => {
    handlePhotoFiles(e.target.files);
    elements.photoFileInput.value = '';
  });

  const inputContainer = elements.inputContainerBox;
  const overlay = elements.dragDropOverlay;

  ['dragenter', 'dragover'].forEach(eventName => {
    inputContainer.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      overlay.classList.remove('hidden');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    inputContainer.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      overlay.classList.add('hidden');
    });
  });

  inputContainer.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files) handlePhotoFiles(e.dataTransfer.files);
  });

  elements.voiceMicBtn.addEventListener('click', toggleSpeechRecognition);
  elements.cancelVoiceBtn.addEventListener('click', stopSpeechRecognition);

  document.querySelectorAll('.suggestion-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('span.font-medium').textContent.trim();
      const desc = card.querySelector('span.text-zinc-500').textContent.trim();
      elements.promptTextarea.value = `${title}: ${desc}`;
      adjustTextareaHeight();
      updateSendButtonState();
      elements.promptTextarea.focus();
    });
  });

  elements.exportChatBtn.addEventListener('click', exportChat);
  elements.clearChatBtn.addEventListener('click', () => {
    if (confirm('Clear all messages in this conversation?')) clearCurrentMessages();
  });

  elements.themeToggleBtn.addEventListener('click', toggleTheme);

  elements.openSettingsBtn.addEventListener('click', () => {
    elements.apiKeyInput.value = state.settings.apiKey;
    elements.simSpeedSelect.value = state.settings.simSpeed;
    elements.systemPromptInput.value = state.settings.systemPrompt;
    elements.settingsModal.classList.remove('hidden');
  });

  elements.closeSettingsBtn.addEventListener('click', () => elements.settingsModal.classList.add('hidden'));

  elements.saveSettingsBtn.addEventListener('click', () => {
    state.settings.apiKey = elements.apiKeyInput.value.trim();
    state.settings.simSpeed = elements.simSpeedSelect.value;
    state.settings.systemPrompt = elements.systemPromptInput.value.trim() || 'You are ChatGPT, a helpful AI assistant.';

    localStorage.setItem('chatgpt_api_key', state.settings.apiKey);
    localStorage.setItem('chatgpt_sim_speed', state.settings.simSpeed);
    localStorage.setItem('chatgpt_sys_prompt', state.settings.systemPrompt);
    elements.settingsModal.classList.add('hidden');
  });

  elements.clearAllDataBtn.addEventListener('click', () => {
    if (confirm('Clear all conversation history and reset settings?')) {
      localStorage.clear();
      location.reload();
    }
  });

  elements.closeLightboxBtn.addEventListener('click', closeLightbox);
  elements.imageLightbox.addEventListener('click', (e) => {
    if (e.target === elements.imageLightbox) closeLightbox();
  });
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

elements.modelSelectorContainer = document.getElementById('model-selector-container');
window.addEventListener('DOMContentLoaded', init);