<script lang="ts">
    import { onMount } from "svelte";
  
    let apiKey:string = "<API Token>";
    let isGpt4:boolean = false
    let message: string = null;
  
    onMount(() => {
        chrome.storage.sync.get("apiKey", (data) => {
          apiKey = data.apiKey;
        });
    });
  
    const handleSave = () => {
        chrome.storage.sync.set({ apiKey }).then(() => {
         message = "Updated!";

        setTimeout(() => {
            message = null;
        }, 2000);
    });
    };
  </script>
  
  
  <div class="flex flex-col py-[3%] px-[2%] bg-blue-50 h-screen">
    <h2 class="mb-5">Options Page</h2>
    {#if message}
      <span class="font-bold text-blue-800">{message}</span>
    {/if}
  
    <form on:submit|preventDefault={handleSave} class="flex flex-col gap-4">
      <div class="flex items-center gap-2 w-full">
        <label for="api-token" class="text-lg font-bold text-gray-700">
          API Token
        </label>
        <input
          type="password"
          id="api-token"
          name="api-token"
          class="border border-gray-300 rounded-md p-2 flex-1"
          bind:value={apiKey}
        />
      </div>

  
      <button
        class="w-full bg-blue-500 text-white text-base font-bold py-2 px-4 rounded"
        type="submit"
      >
        Save
      </button>
    </form>
  </div>
  