export const fetchChats = async () => {
    const res = await fetch('http://localhost:5000/api/chat');
    return res.json();
  };
  
  export const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/api/tasks');
    return res.json();
  };
  
  export const fetchEmployees = async () => {
    const res = await fetch('http://localhost:5000/api/user/employees');
    return res.json();
  };
  
  export const assignTask = async (task) => {
    const res = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    return res.json();
  };

  export const sendChatMessage = async (message) => {
    const res = await fetch('http://localhost:5000/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    return res.json();
  };
  
  