import Browser from 'webextension-polyfill';

import { getProviderConfigs, ProviderType } from '../config';
import { ChatGPTProvider, getChatGPTAccessToken, sendMessageFeedback } from './providers/chatgpt';
import { OpenAIProvider } from './providers/openai';
import { Provider } from './types';

const id_prefix = 'chat-gpt';

async function generateAnswers(port: Browser.Runtime.Port, question: string) {
  const providerConfigs = await getProviderConfigs();

  let provider: Provider;
  if (providerConfigs.provider === ProviderType.ChatGPT) {
    const token = await getChatGPTAccessToken();
    provider = new ChatGPTProvider(token);
  } else if (providerConfigs.provider === ProviderType.GPT3) {
    const { apiKey, model } = providerConfigs.configs[ProviderType.GPT3]!;
    provider = new OpenAIProvider(apiKey, model);
  } else {
    throw new Error(`Unknown provider ${providerConfigs.provider}`);
  }

  const controller = new AbortController();
  port.onDisconnect.addListener(() => {
    controller.abort();
    cleanup?.();
  });

  const { cleanup } = await provider.generateAnswer({
    prompt: question,
    signal: controller.signal,
    onEvent(event) {
      if (event.type === 'done') {
        port.postMessage({ event: 'DONE' });
        return;
      }
      port.postMessage(event.data);
    },
  });
}

Browser.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (msg) => {
    console.debug('received msg', msg);
    try {
      await generateAnswers(port, msg.question);
    } catch (err: any) {
      console.error(err);
      port.postMessage({ error: err.message });
    }
  });
});

Browser.runtime.onMessage.addListener(async (message) => {
  if (message.type === 'FEEDBACK') {
    const token = await getChatGPTAccessToken();
    await sendMessageFeedback(token, message.data);
  } else if (message.type === 'OPEN_OPTIONS_PAGE') {
    Browser.runtime.openOptionsPage();
  } else if (message.type === 'GET_ACCESS_TOKEN') {
    return getChatGPTAccessToken();
  }
});

Browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    Browser.runtime.openOptionsPage();
  }
});

const parentMenu = Browser.contextMenus.create({
  id: id_prefix,
  title: 'ChatGPT Helper',
  contexts: ['all'],
});

Browser.contextMenus.create({
  id: `${id_prefix}-summarize`,
  title: 'Summarize',
  contexts: ['all'],
  parentId: parentMenu,
});

Browser.contextMenus.create({
  id: `${id_prefix}-definition`,
  title: 'Definition',
  contexts: ['all'],
  parentId: parentMenu,
});

const translateParentMenu = Browser.contextMenus.create({
  id: `${id_prefix}-translate`,
  title: 'Translate',
  contexts: ['all'],
  parentId: parentMenu,
});

Browser.contextMenus.create({
  id: `${id_prefix}-translate-english`,
  title: 'English',
  contexts: ['all'],
  parentId: translateParentMenu,
});

Browser.contextMenus.create({
  id: `${id_prefix}-translate-french`,
  title: 'French',
  contexts: ['all'],
  parentId: translateParentMenu,
});

Browser.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case `${id_prefix}-summarize`:
      Browser.tabs.sendMessage(tab!.id!, { type: 'question', question: 'summarize' });
      break;
    case `${id_prefix}-definition`:
      Browser.tabs.sendMessage(tab!.id!, { type: 'question', question: 'definition' });
      break;
    case `${id_prefix}-translate-english`:
      Browser.tabs.sendMessage(tab!.id!, { type: 'question', question: 'translate-english' });
      break;
    case `${id_prefix}-translate-french`:
      Browser.tabs.sendMessage(tab!.id!, { type: 'question', question: 'translate-french' });
      break;
    default:
      break;
  }
});
