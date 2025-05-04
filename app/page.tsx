'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Send, Workflow as WorkflowIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WorkflowPopup } from '@/components/WorkflowPopup';
import { Message, WorkflowData, ToolNodeData } from '@/types';

// Initial workflow data
const initialWorkflow: WorkflowData = {
  nodes: [
    {
      id: '1',
      position: { x: 50, y: 50 },
      type: 'toolNode', // Specify custom node type
      data: {
        name: 'Start Trigger',
        description: 'Initiates the workflow.',
        inputs: [],
        outputs: [{ id: 'out1', name: 'triggerSignal', type: 'signal', value: null, description: 'Workflow start signal' }],
        status: 'idle',
      },
    },
    {
      id: '2',
      position: { x: 300, y: 50 },
      type: 'toolNode', // Specify custom node type
      data: {
        name: 'Search Web',
        description: 'Searches the web for a given query.',
        inputs: [{ id: 'in1', name: 'query', type: 'string', value: 'latest AI news', description: 'Search term' }],
        outputs: [{ id: 'out1', name: 'results', type: 'list', value: null, description: 'List of search results' }],
        status: 'idle',
      },
    },
    {
      id: '3',
      position: { x: 300, y: 250 },
      type: 'toolNode', // Specify custom node type
      data: {
        name: 'Summarize Text',
        description: 'Summarizes the provided text.',
        inputs: [{ id: 'in1', name: 'textToSummarize', type: 'string', value: '', description: 'Text content from search results' }],
        outputs: [{ id: 'out1', name: 'summary', type: 'string', value: null, description: 'Generated summary' }],
        status: 'idle',
      },
    },
    {
      id: '4',
      position: { x: 600, y: 150 },
      type: 'toolNode',
      data: {
        name: 'Display Result',
        description: 'Shows the final output.',
        inputs: [{ id: 'in1', name: 'finalOutput', type: 'string', value: '', description: 'Summary to display' }],
        outputs: [],
        status: 'idle',
      },
    },
  ],
  edges: [

    { id: 'e1-2', source: '1', sourceHandle: 'out1', target: '2', targetHandle: 'in1', animated: true },
    { id: 'e2-3', source: '2', sourceHandle: 'out1', target: '3', targetHandle: 'in1', animated: true },
    { id: 'e3-4', source: '3', sourceHandle: 'out1', target: '4', targetHandle: 'in1', animated: true },
  ],
};

export default function HomePage() {

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'agent', text: 'Hello! How can I help you today?' },
    { id: '2', sender: 'agent', text: 'I can answer questions or build workflows using tools.', workflow: initialWorkflow },
  ]);

  const [inputValue, setInputValue] = useState('');

  const [isWorkflowPopupOpen, setIsWorkflowPopupOpen] = useState(false);

  const [workflowToDisplay, setWorkflowToDisplay] = useState<WorkflowData>(initialWorkflow);

  const [latestWorkflowState, setLatestWorkflowState] = useState<WorkflowData>(initialWorkflow);


  useEffect(() => {
    if (!isWorkflowPopupOpen) {
      setWorkflowToDisplay(latestWorkflowState);
    }
  }, [latestWorkflowState, isWorkflowPopupOpen]);



  const openPopup = useCallback((workflowData: WorkflowData) => {
    setWorkflowToDisplay(workflowData); // Set the workflow to show
    setIsWorkflowPopupOpen(true);      // Open the popup
  }, []); // Empty dependency array as it only uses setters

  // Stable callback function to close the popup
  const closePopup = useCallback(() => {
    setIsWorkflowPopupOpen(false);
  }, []); // Empty dependency array as it only uses setter


  const handleSendMessage = () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return; // Don't send empty messages

    // Create the user message object
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: trimmedInput,
    };

    // --- Simulate Agent Response ---
    // TODO: Replace this section with your actual backend API call and agent logic
    const agentDecidesWorkflow = Math.random() > 0.5; // Randomly decide for demo
    let responseWorkflow: WorkflowData | undefined = undefined;

    if (agentDecidesWorkflow) {
      // Simulate agent creating/updating a workflow based on input
      const updatedNodes = latestWorkflowState.nodes.map(n => {
        if (n.id === '2' && n.data.inputs.length > 0) {
          // Create a deep copy of the node data to modify
          const newData: ToolNodeData = JSON.parse(JSON.stringify(n.data));
          // Update the value of the first input parameter
          newData.inputs[0].value = trimmedInput;
          return { ...n, data: newData }; // Return node with updated data
        }
        return n; // Return unchanged node
      });
      responseWorkflow = { ...latestWorkflowState, nodes: updatedNodes };
      setLatestWorkflowState(responseWorkflow); // Update the latest known state
    }

    // Create the agent response message object
    const agentResponse: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'agent',
      text: agentDecidesWorkflow
          ? `Okay, I've planned a workflow for "${trimmedInput}". You can view/edit it.`
          : `Regarding "${trimmedInput}", here's an answer... (simple Q&A simulation)`,
      workflow: responseWorkflow, // Attach workflow only if one was generated for this response
    };
    // --- End Simulation ---

    // Add messages to the chat and clear input
    setMessages((prev) => [...prev, userMessage, agentResponse]);
    setInputValue('');
  };


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };


  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };


  const handleWorkflowSave = (updatedWorkflow: WorkflowData) => {
    setLatestWorkflowState(updatedWorkflow); // Update the latest known state
    setWorkflowToDisplay(updatedWorkflow);   // Update the display state as well
    closePopup(); // Close the popup


    const updateMessage: Message = {
      id: Date.now().toString(),
      sender: 'agent',
      text: 'Workflow has been updated based on your edits.',
      workflow: updatedWorkflow,
    };
    setMessages((prev) => [...prev, updateMessage]);


  };


  return (
      <div className="flex flex-col h-screen bg-gray-50 font-sans">

        <header className="p-4 border-b bg-white shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">AI Agent Interface</h1>
        </header>


        <ScrollArea className="flex-grow p-4 space-y-4">
          {messages.map((msg) => (
              <div
                  key={msg.id}
                  className={`flex ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow ${
                        msg.sender === 'user'
                            ? 'bg-blue-500 text-white' // User message style
                            : 'bg-white text-gray-800 border' // Agent message style
                    }`}
                >

                  {msg.text}

                  {msg.sender === 'agent' && msg.workflow && (
                      <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                          onClick={() => {
                            openPopup(msg.workflow!);
                          }}
                      >
                        View/Edit Workflow Plan
                        <WorkflowIcon className="ml-1 h-3 w-3" />
                      </Button>
                  )}
                </div>
              </div>
          ))}
        </ScrollArea>


        <div className="p-4 border-t bg-white flex items-center space-x-2">
          <Input
              type="text"
              placeholder="Type your message..."
              className="flex-grow"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              aria-label="Chat input"
          />

          <Button onClick={handleSendMessage} aria-label="Send message">
            <Send className="h-5 w-5" />
          </Button>

          <Button
              variant="outline"
              onClick={() => openPopup(latestWorkflowState)} // Use openPopup with the latest state
              aria-label="Open workflow editor"
              title="Open Workflow Editor"
          >
            <WorkflowIcon className="h-5 w-5" />
          </Button>
        </div>


        <WorkflowPopup
            isOpen={isWorkflowPopupOpen}
            onClose={closePopup}
            workflowData={workflowToDisplay} // Pass the workflow selected for display
            onSave={handleWorkflowSave}      // Pass the save handler
        />
      </div>
  );
}