<script lang="ts">
  import type { Message } from "src/types/message.type";

  export let apiKey: String;

  

  let aiContent: String = '';
  let title: String = ''
  let totalLength: String = '';
  let aiLength: String = ''
  

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.html) {
      
      if(message.html === "FailedActiveTab") {
        title = "Failed to get the active tab try clicking the page and the button again";
        return;
      }

      if (!apiKey) {
        title = "No apikey has been added please go to the options to make sure this is added";
        return;
      }



      let htmlContent: string = message.html
        .replace(/<header[\s\S]*?<\/header>|<nav[\s\S]*?<\/nav>|<script[\s\S]*?<\/script>|<footer[\s\S]*$|\s{2,}|\n/g, ' ')
        .replace(/(<([^>]+)>)/gi, "")
        .replace(/\s{2,}|\n/g, ' ');

        totalLength = `Total length: ${htmlContent.length} characters`;

        let sections: string[] = htmlContent.match(/.{1,8000}/g);

        let titleMessage: Message[] = [
          {
              "role": "system",
              "content": "You are a helpful assistant, "
                + "A message will be sent to you from a webpage containing a section of the terms and conditions,"
                + " or privacy policy of that website."
                + " You will provide a one line title."
                + " If the text is not a terms of service or privcy policy please indiate this."
            },
            {
              "role": "user",
              "content": "" + sections[0]
            }
        ]

        let response = await doCompletion(titleMessage, apiKey);

        title = (await response.json()).choices[0].message.content;

        aiContent = "";
        for (const [i,section] of sections.entries()) {
          let message: Message[] = [
          {
              "role": "system",
              "content": "You are a helpful assistant, "
                + "A message will be sent to you from a webpage containing a section of the terms and conditions,"
                + " or privacy policy of that website."
                + " You will provide a summary in one sentence of that text that can be understood easily,"
                + " you will also identify any parts of the policy that will be of concern for an average person."
                + " If you have no conerns with a section you will write \"no concerns\"."
                + " additionally your response will be in html format using the tailwind framework as if written within a <div> element"
            },
            {
              "role": "user",
              "content": `Section ${i + 1}: ` + section
            }
        ];

        let response = await doCompletion(message, apiKey);

        aiContent = aiContent + `<h2 class="italic">Section ${i + 1}:</h2><p class="text-xs text-blue-900">Starting from ...${section.substring(0,100)}...</i></p><br/> <div>${(await response.json()).choices[0].message.content}</div> <br/><br/>`;
      }
      aiLength = `Reduced length: ${aiContent.length} characters`
        
    }
    
  });

  function getHtml() {
    chrome.runtime.sendMessage({ action: "getHtml" });
  }

  async function doCompletion(message: Message[], apiKey: String) {
      return fetch("https://api.openai.com/v1/chat/completions",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": message
          }),
        });
  }
</script>

<button on:click={getHtml} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Summerise Page</button>
<br/><br/>
<h1>{title}</h1>
<p class="text-xs text-blue-900">{totalLength}</p>
<p class="text-xs text-blue-900">{aiLength}</p>
<br/><br/>
<div>{@html aiContent}</div>