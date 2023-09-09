// Replace this with the text you're searching for
const searchStrings = ["privacy policy", "terms of service"];
const regex = new RegExp(searchStrings.join('|'), 'i');

const matches = document.body.innerText.match(regex);

if (matches) {
  console.log("found key words")
  chrome.runtime.sendMessage({action: 'notification'});
} else {
  console.log(`Did not find the text`);
}