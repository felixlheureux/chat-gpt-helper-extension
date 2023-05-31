import { render } from 'preact';
import '../base.css';
import { getUserConfig, Theme } from '../config';
import { detectSystemColorScheme } from '../utils';
import ChatGPTContainer from './ChatGPTContainer';
import './styles.scss';

async function mount() {
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

  container.id = 'chatgpt-summarizer-content-view-root';
  // container.attachShadow({ mode: 'open' });
  document.body.append(container);

  render(<ChatGPTContainer />, container);
}

async function run() {
  mount();
}

run();
