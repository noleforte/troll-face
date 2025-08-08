// Trollface Chatbot UI Logic
const chatWindow = document.getElementById('chat-window');
const chatSection = document.getElementById('chat-section');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

// === Troll placeholder cycling ===
const trollPlaceholders = [
  "Type if you dare...",
  "Still here?",
  "Try not to cry, type instead.",
  "Wanna be roasted?"
];
let trollPlaceholderIdx = 0;
setInterval(() => {
  trollPlaceholderIdx = (trollPlaceholderIdx + 1) % trollPlaceholders.length;
  chatInput.setAttribute('placeholder', trollPlaceholders[trollPlaceholderIdx]);
}, 5000);

function saveChatHistory() {
    const messages = Array.from(chatWindow.children).map(div => div.innerHTML);
    localStorage.setItem('trollChatHistory', JSON.stringify(messages));
}
function loadChatHistory() {
    const history = localStorage.getItem('trollChatHistory');
    if (history) {
        const messages = JSON.parse(history);
        if (messages.length > 0) {
            // Если есть история - сразу показываем основной чат
            showMainChat();
            messages.forEach(html => {
                const msgDiv = document.createElement('div');
                msgDiv.innerHTML = html;
                // Определяем класс по содержимому
                if (html.startsWith('<b>You:')) {
                    msgDiv.className = 'you-msg fade-in';
                } else {
                    msgDiv.className = 'bot-msg fade-in';
                }
                chatWindow.appendChild(msgDiv);
            });
            chatWindow.scrollTop = chatWindow.scrollHeight;
            // Спец. приветствие
            setTimeout(() => appendMessage('Trollface', 'You really came back? I thought I roasted you into oblivion.'), 400);
        } else {
            // Если истории нет - показываем пустое состояние
            updateChatEmptyState();
        }
    } else {
        // Если истории нет - показываем пустое состояние
        updateChatEmptyState();
    }
}

function updateChatEmptyState() {
  const chatWindow = document.getElementById('chat-window');
  const emptyDiv = document.getElementById('chat-empty');
  // Считаем только сообщения в chat-window
  const hasMessages = Array.from(chatWindow.children).some(
    el => el.nodeType === 1 && (el.classList.contains('you-msg') || el.classList.contains('bot-msg'))
  );
  // Показываем chat-empty только если нет сообщений
  if (emptyDiv) {
    emptyDiv.style.display = hasMessages ? 'none' : '';
  }
}

function bindMainChatInputHandlers() {
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  if (chatInput && !chatInput.dataset.bound) {
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
    chatInput.dataset.bound = 'true';
  }
}

function showMainChat() {
  document.getElementById('chat-empty').style.display = 'none';
  document.getElementById('chat-window').style.display = '';
  document.querySelector('.chat-input-row').style.display = '';

  // Навешиваем обработчики только после появления элементов
  bindMainChatInputHandlers();
}

// Анимация загрузки при заходе на сайт
window.addEventListener('DOMContentLoaded', () => {
    const overlay = document.createElement('div');
    overlay.id = 'chat-loading-overlay';
    overlay.style.position = 'absolute';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(30,30,30,0.92)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 10;
    overlay.style.transition = 'opacity 0.7s';
    overlay.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center;">
            <div class="spinner" style="width:48px;height:48px;border:5px solid #fff;border-top:5px solid #232323;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:18px;"></div>
            <span style="font-size:1.3em; color:#fff; font-family:monospace; letter-spacing:1px;">Troll GPT Loading <span id="dots">...</span></span>
        </div>
    `;
    chatSection.style.position = 'relative';
    chatSection.appendChild(overlay);

    // CSS-анимация для спиннера
    const style = document.createElement('style');
    style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`;
    document.head.appendChild(style);

    // Анимация точек
    let dots = 1;
    const dotsSpan = overlay.querySelector('#dots');
    const dotsArr = ['', '.', '..', '...'];
    const dotsInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        dotsSpan.textContent = dotsArr[dots];
    }, 400);

    setTimeout(() => {
        overlay.style.opacity = 0;
        setTimeout(() => {
            overlay.remove();
            style.remove();
            clearInterval(dotsInterval);
        }, 700);
    }, 5000);
    setTimeout(() => {
        loadChatHistory();
    }, 6000);

    // Логика для стартового поля ввода
    const chatInputEmpty = document.getElementById('chat-input-empty');
    const chatSendEmpty = document.getElementById('chat-send-empty');
    function sendFirstMessage() {
      const value = chatInputEmpty.value.trim();
      if (!value) return;
      showMainChat();
      document.getElementById('chat-input').value = value;
      appendMessage('You', value);
      chatInputEmpty.value = '';
    }
    chatSendEmpty.addEventListener('click', sendFirstMessage);
    chatInputEmpty.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendFirstMessage();
      }
    });

    // Удаляю блок Collapsible About (about-toggle/about-content), чтобы не было ошибок обращения к несуществующим элементам.
    updateChatEmptyState();
});

function trollBotEffects() {
    // 1. Shake chat
    if (Math.random() < 0.25) {
        chatSection.classList.add('shake');
        setTimeout(() => chatSection.classList.remove('shake'), 600);
    }
    // 2. Console prank
    if (Math.random() < 0.33) {
        const jokes = [
            "console.warn('U mad, bro?')",
            "console.warn('Skill issue detected!')",
            "console.warn('You fell for it!')",
            "console.warn('404: Your dignity not found')",
            "console.warn('Trolled by Troll GPT!')"
        ];
        // eslint-disable-next-line no-eval
        eval(jokes[Math.floor(Math.random() * jokes.length)]);
    }
}

function bounceScrollToMessage(msgDiv) {
    setTimeout(() => {
        msgDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
        msgDiv.classList.add('bounce');
        setTimeout(() => msgDiv.classList.remove('bounce'), 600);
    }, 120);
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    let isUser = sender === 'You';
    if (isUser) {
        msgDiv.className = 'you-msg fade-in';
        msgDiv.innerHTML = `<b>${sender}:</b> ${text}`;
    } else {
        msgDiv.className = 'bot-msg fade-in';
        msgDiv.innerHTML = `<b><span class="bot-nick">${sender}:</span></b> <span class="bot-text">${text}</span>`;
    }
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    bounceScrollToMessage(msgDiv);
    if (!isUser) trollBotEffects();
    saveChatHistory();
    updateChatEmptyState();
}

function appendTrollLaugh() {
    const laugh = document.createElement('div');
    laugh.className = 'bot-msg fade-in';
    laugh.innerHTML = `<b><span class="bot-nick">Trollface:</span></b> <span class="bot-text">LOL</span>`;
    chatWindow.appendChild(laugh);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    bounceScrollToMessage(laugh);
    trollBotEffects();
    saveChatHistory();
    updateChatEmptyState();
}

async function sendMessage() {
    const userMsg = chatInput.value.trim();
    if (!userMsg) return;
    appendMessage('You', userMsg);
    chatInput.value = '';
    setTimeout(() => {
        if (Math.random() < 0.3) appendTrollLaugh();
    }, 400);
    try {
        const res = await fetch('/api/trollface', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMsg })
        });
        const data = await res.json();
        appendMessage('Trollface', data.reply);
    } catch {
        appendMessage('Trollface', 'Skill issue. Try again later.');
    }
} 