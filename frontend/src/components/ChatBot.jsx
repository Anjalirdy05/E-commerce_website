import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      // Frontend-only mock response
      const lower = userMessage.toLowerCase();
      let reply = "I'm here to help!";
      if (lower.includes('order')) reply = 'You can view your orders in the Orders page. New checkouts create local orders stored in your browser.';
      else if (lower.includes('cart')) reply = 'Cart is saved locally. Go to Cart to edit quantities or remove items.';
      else if (lower.includes('wishlist')) reply = 'Wishlist is saved locally. Tap the heart on a product to add or remove it.';
      else if (lower.includes('payment')) reply = 'Payments are simulated in this demo. Placing an order will store it locally.';
      else if (lower.includes('images') || lower.includes('photo')) reply = 'Product images are local placeholders under /images. You can replace them with your own files in public/images.';
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 luxury-gradient rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50"
          data-testid="chatbot-open-btn"
        >
          <MessageCircle size={28} className="text-white" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] glass-effect rounded-2xl shadow-2xl flex flex-col z-50" data-testid="chatbot-widget">
          <div className="luxury-gradient p-4 rounded-t-2xl flex justify-between items-center">
            <h3 className="text-white font-semibold text-lg">AI Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              data-testid="chatbot-close-btn"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3" data-testid="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                data-testid={`chat-message-${msg.role}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'luxury-gradient text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-[#8b4513]"
                data-testid="chatbot-input"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="btn-luxury w-10 h-10 p-0 flex items-center justify-center disabled:opacity-50"
                data-testid="chatbot-send-btn"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;