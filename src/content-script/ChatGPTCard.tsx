import { SearchIcon } from '@primer/octicons-react';
import { useState } from 'preact/hooks';
import { TriggerMode } from '../config';
import ChatGPTQuery from './ChatGPTQuery';

interface Props {
  question: string;
  triggerMode: TriggerMode;
}

function ChatGPTCard(props: Props) {
  const [triggered, setTriggered] = useState(false);

  if (props.triggerMode === TriggerMode.Always) {
    return <ChatGPTQuery question={props.question} />;
  }

  if (triggered) {
    return <ChatGPTQuery question={props.question} />;
  }

  return (
    <p className="icon-and-text cursor-pointer" onClick={() => setTriggered(true)}>
      <SearchIcon size="small" /> Ask ChatGPT for this query
    </p>
  );
}

export default ChatGPTCard;
