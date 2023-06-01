import { XIcon } from '@primer/octicons-react';
import { useEffect, useState } from 'react';
import Browser from 'webextension-polyfill';
import contextMenuActions from '../features/contextMenuActions';
import ChatGPTQuery from './ChatGPTQuery';

function ChatGPTContainer() {
  const [question, setQuestion] = useState('');

  useEffect(() => {
    Browser.runtime.onMessage.addListener((message) => {
      if (message.type === 'question') {
        const content = window.getSelection()?.toString();
        if (!content) {
          return;
        }
        contextMenuActions.forEach((action) => {
          if (action.message === message.message && action.question) {
            setQuestion(action.question(content));
          }
        });
      }
    });
  }, []);

  if (!question) {
    return null;
  }

  return (
    <div className="chat-gpt-card">
      <div
        onClick={() => setQuestion('')}
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          marginRight: '0.5rem',
        }}>
        <XIcon />
      </div>
      <ChatGPTQuery question={question} />
    </div>
  );
}

export default ChatGPTContainer;
