import { XIcon } from '@primer/octicons-react';
import { useEffect, useState } from 'react';
import Browser from 'webextension-polyfill';
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
        switch (message.question) {
          case 'summarize':
            setQuestion(
              `Summarize this text into a bullet point list of the most inportant information. <<< ${content} >>>`,
            );
            break;
          case 'definition':
            setQuestion(`What is the definition of <<< ${content} >>>`);
            break;
          case 'translate-english':
            setQuestion(`Translate <<< ${content} >>> into English`);
            break;
          case 'translate-french':
            setQuestion(`Translate <<< ${content} >>> into French`);
            break;
          default:
            setQuestion('');
            break;
        }
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
