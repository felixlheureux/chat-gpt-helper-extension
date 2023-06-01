const id_prefix = 'chat-gpt';

const contextMenuActions = [
  {
    id: id_prefix,
    title: 'ChatGPT Helper',
    contexts: ['all'],
  },
  {
    id: `${id_prefix}-summarize`,
    title: 'Summarize',
    contexts: ['all'],
    parentId: id_prefix,
    message: 'summarize',
    question: (content: string) =>
      `Summarize into a bullet point list all the most important content in the lest words possible with loosing information: <<< ${content} >>>?`,
  },
  {
    id: `${id_prefix}-definition`,
    title: 'Definition',
    contexts: ['all'],
    parentId: id_prefix,
    message: 'definition',
    question: (content: string) => `What is the definition of: <<< ${content} >>>?`,
  },
  {
    id: `${id_prefix}-translate`,
    title: 'Translate',
    contexts: ['all'],
    parentId: id_prefix,
  },
  {
    id: `${id_prefix}-translate-english`,
    title: 'English',
    contexts: ['all'],
    parentId: `${id_prefix}-translate`,
    message: 'translate-english',
    question: (content: string) => `Translate this to English: <<< ${content} >>>?`,
  },
  {
    id: `${id_prefix}-translate-french`,
    title: 'French',
    contexts: ['all'],
    parentId: `${id_prefix}-translate`,
    message: 'translate-french',
    question: (content: string) => `Translate this to French: <<< ${content} >>>?`,
  },
];

export default contextMenuActions;
