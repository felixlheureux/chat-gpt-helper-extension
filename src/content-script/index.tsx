import { render } from 'preact';
import '../base.css';
import { getUserConfig, Language, Theme } from '../config';
import { detectSystemColorScheme } from '../utils';
import ChatGPTContainer from './ChatGPTContainer';
import './styles.scss';

async function mount(question: string) {
  const container = document.createElement('div');
  container.className = 'chat-gpt-container';

  const userConfig = await getUserConfig();
  let theme: Theme;
  if (userConfig.theme === Theme.Auto) {
    theme = detectSystemColorScheme();
  } else {
    theme = userConfig.theme;
  }
  if (theme === Theme.Dark) {
    container.classList.add('gpt-dark');
  } else {
    container.classList.add('gpt-light');
  }

  const root = document.createElement('div');
  root.id = 'chatgpt-summarizer-content-view-root';
  root.attachShadow({ mode: 'open' });
  document.body.append(root);

  render(
    <ChatGPTContainer question={question} triggerMode={userConfig.triggerMode || 'always'} />,
    root.shadowRoot!,
  );
}

async function run() {
  const pageContent = document.body
    .getElementsByTagName('main')[0]
    .textContent?.replace(/(\r\n|\n|\r)/gm, '')
    .replace(/\s+/g, ' ');
  console.log('index.tsx #41: ', pageContent);
  if (pageContent) {
    console.debug('Mount ChatGPT');
    const userConfig = await getUserConfig();
    const pageContentWithLanguageOption =
      userConfig.language === Language.Auto
        ? `Summerize this text by making a bullet point list of the most important information and if it's an artice, keep the images and ignore the comments \`\`\`${pageContent}\`\`\``
        : `Summerize this text by making a bullet point list of the most important information and if it's an artice, keep the images and ignore the comments \`\`\`${pageContent}\`\`\`(in ${userConfig.language})`;
    mount(pageContentWithLanguageOption);
  }
}

run();
