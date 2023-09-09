import '../app.css';
import GetData from '../components/GetData.svelte';


const target = document.getElementById('app');

async function render() {
  const {apiKey} = await chrome.storage.sync.get({apiKey: ""});
  new GetData({target, props: {apiKey}});
}

document.addEventListener('DOMContentLoaded', render);