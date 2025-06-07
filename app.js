import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

    // Initialize Gemini AI
    let genAI, chat;
    
    try {
      genAI = new GoogleGenerativeAI("AIzaSyD-Sr-6rnmvLOMn1FxnMxTKp6YHqk3uXPI");
      chat = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }).startChat({
        history: [],
      });
      console.log("Gemini AI initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Gemini AI:", error);
      showError("Failed to initialize AI. Please check your API key.");
    }

    const messagesDiv = document.getElementById("messages");
    const input = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const loading = document.getElementById("loading");

    // Make sendMessage available globally
    window.sendMessage = async function () {
      const userMessage = input.value.trim();
      if (!userMessage || !chat) return;

      // Disable input while processing
      sendBtn.disabled = true;
      input.disabled = true;
      loading.style.display = "block";

      try {
        // Add user message to chat
        appendMessage("You", userMessage, "user");
        input.value = "";

        // Send message to Gemini
        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        const text = response.text();

        // Add Gemini response to chat
        appendMessage("Gemini", text, "gemini");

      } catch (error) {
        console.error("Error sending message:", error);
        showError("Failed to get response from Gemini. Please try again.");
      } finally {
        // Re-enable input
        sendBtn.disabled = false;
        input.disabled = false;
        loading.style.display = "none";
        input.focus();
      }   
    };

    function appendMessage(sender, text, className) {
      const div = document.createElement("div");
      div.className = `bubble ${className}`;
      div.innerHTML = `<strong>${sender}:</strong> ${text}`;
      messagesDiv.appendChild(div);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function showError(message) {
      const div = document.createElement("div");
      div.className = "error";
      div.textContent = message;
      messagesDiv.appendChild(div);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Add Enter key support
    input.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        sendMessage();
      }
    });

    // Focus on input when page loads
    input.focus();