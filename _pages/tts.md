---
permalink: /tts
layout: default
title: TTS
---

 <h1>Text-to-Speech Generator</h1>
  <form id="ttsForm">
    <label for="inputText">Input Text:</label>
    <textarea id="inputText" name="inputText" rows="4" cols="50" required>hello</textarea><br><br>
    
    <label for="voiceName">Voice Name:</label>
    <input type="text" id="voiceName" name="voiceName" required value="Gigi"><br><br>
    
    <button type="submit">Submit</button>
  </form>

  <script>
    document.getElementById('ttsForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const inputText = document.getElementById('inputText').value;
      const voiceName = document.getElementById('voiceName').value;

      const response = await fetch('https://smileycap-bot.herokuapp.com/api/generate-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText, voiceName, volume: 0.4 }),
      });

      if (response.ok) {
        console.log('Request sent successfully!');
      } else {
        console.log('Failed to send request');
      }
    });
  </script>