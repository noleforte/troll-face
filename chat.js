// Trollface Chatbot UI Logic
const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.innerHTML = `<b>${sender}:</b> ${text}`;
    msgDiv.style.margin = '8px 0';
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function appendTrollLaugh() {
    const laugh = document.createElement('div');
    laugh.innerHTML = `<b>Trollface:</b> LOL`;
    laugh.style.opacity = 0;
    laugh.style.transition = 'opacity 0.5s';
    chatWindow.appendChild(laugh);
    setTimeout(() => {
        laugh.style.opacity = 1;
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 100);
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
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
}); 