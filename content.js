const chatContainer = document.querySelector('._1_hE2');

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length > 0) {
      const newMessage = mutation.addedNodes[0].innerText;
      translateMessage(newMessage, (translatedText) => {
        mutation.addedNodes[0].innerText = translatedText;
      });
    }
  });
});



function translateMessage(message, callback) {
    // Fetch user's preferred language from Chrome storage
    chrome.storage.sync.get(['preferredLanguage'], (result) => {
      const targetLanguage = result.preferredLanguage || 'en'; // Default to English if no preference
      
      // Call a translation API (you can use Google Translate, Microsoft Translator, etc.)
      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(message)}&langpair=en|${targetLanguage}`;
      
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const translatedText = data.responseData.translatedText;
          callback(translatedText);
        })
        .catch(error => {
          console.error('Translation error:', error);
          callback(message); // Return original message in case of an error
        });
    });
  }

  const inputBox = document.querySelector('._2_1wd'); // WhatsApp message input box

  inputBox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const originalMessage = inputBox.innerText;
      
      translateMessage(originalMessage, (translatedText) => {
        inputBox.innerText = translatedText;
        inputBox.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event to send the message
      });
    }
  });
  