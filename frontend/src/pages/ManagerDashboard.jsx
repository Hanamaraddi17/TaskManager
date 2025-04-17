import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#aa66cc', '#FF6666', '#00BCD4'];

function ManagerDashboard() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([
    { id: '001', name: 'Alice', role: 'Designer' },
    { id: '002', name: 'Bob', role: 'Backend Dev' },
    { id: '003', name: 'Charlie', role: 'Frontend Dev' },
    { id: '004', name: 'Eve', role: 'Tech Writer' },
    { id: '005', name: 'Leo', role: 'QA Engineer' },
    { id: '006', name: 'Rolex', role: 'Project Manager' },
    { id: '007', name: 'Dilli', role: 'UI Developer' },
    { id: '008', name: 'Vikram', role: 'DevOps' },
    { id: '009', name: 'Arvind', role: 'Security Analyst' }
  ]);

  const [tasks, setTasks] = useState([
    { title: 'Design UI', description: 'Create dashboard UI', assignedTo: 'Alice', status: 'Pending' },
    { title: 'Setup Backend', description: 'Initialize Express server', assignedTo: 'Bob', status: 'Completed' },
    { title: 'API Integration', description: 'Connect frontend with backend', assignedTo: 'Charlie', status: 'Pending' },
    { title: 'Write Docs', description: 'Document the codebase', assignedTo: 'Eve', status: 'Completed' },
    { title: 'Testing', description: 'Write unit tests', assignedTo: 'Leo', status: 'Pending' },
    { title: 'Team Sync', description: 'Organize team meeting', assignedTo: 'Rolex', status: 'Completed' },
    { title: 'Bug Fix', description: 'Resolve UI bugs', assignedTo: 'Dilli', status: 'Pending' },
  ]);

  const [chats, setChats] = useState([
    { sender: 'Alice', message: 'Started working on UI' },
    { sender: 'Bob', message: 'Backend is up!' },
    { sender: 'Eve', message: 'Docs are done.' },
    { sender: 'Admin', message: 'Great work team!' },
    { sender: 'Charlie', message: 'Working on API integration!' },
    { sender: 'Leo', message: 'Tests are in progress.' }
  ]);

  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', status: 'Pending' });
  const [newEmployeeId, setNewEmployeeId] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);

  const handleLogout = () => {
    alert("Logged out!");
    navigate('/');
  };

  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.description || !newTask.assignedTo) return;
    setTasks([...tasks, newTask]);
    setNewTask({ title: '', description: '', assignedTo: '', status: 'Pending' });
  };

  const handleAddEmployee = () => {
    if (newEmployeeId && !employees.some(emp => emp.id === newEmployeeId)) {
      const randomNames = ['John', 'Peter', 'Sam', 'Mike', 'Sophia', 'Emma', 'Olivia', 'Liam', 'Noah'];
      const randomRoles = ['Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'QA Engineer', 'DevOps Engineer', 'Project Manager', 'Technical Writer', 'Security Analyst', 'Scrum Master'];
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
      const randomRole = randomRoles[Math.floor(Math.random() * randomRoles.length)];
      const newEmp = {
        id: newEmployeeId,
        name: randomName,
        role: randomRole
      };
      setEmployees([...employees, newEmp]);
      setNewEmployeeId('');
      setShowEmployeeForm(false);
    }
  };
  

  const handleRemoveEmployee = (name) => {
    setEmployees(employees.filter(emp => emp.name !== name));
    setTasks(tasks.filter(task => task.assignedTo !== name));
  };

  const handleSendChat = () => {
    if (chatMessage.trim()) {
      setChats([...chats, { sender: 'Manager - krishna', message: chatMessage }]);
      setChatMessage('');
    }
  };

  const taskDistribution = employees.map(emp => ({
    name: emp.name,
    value: tasks.filter(task => task.assignedTo === emp.name).length
  })).filter(d => d.value > 0);

  const taskStatusData = [
    { name: 'Completed', value: tasks.filter(t => t.status === 'Completed').length },
    { name: 'Pending', value: tasks.filter(t => t.status === 'Pending').length }
  ];

  const taskPerRole = employees.map(emp => ({
    role: emp.role,
    taskCount: tasks.filter(task => task.assignedTo === emp.name).length
  })).filter(d => d.taskCount > 0);

  const pendingAdminTasks = tasks.filter(task => task.assignedTo === 'Admin' && task.status === 'Pending');

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-800">🌟 Welcome, Krishna - Manager</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {pendingAdminTasks.length > 0 && (
        <div className="bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500 p-4 rounded mb-6 shadow">
          <h2 className="text-lg font-semibold">⚠️ Pending Admin Tasks</h2>
          <ul className="list-disc pl-5">
            {pendingAdminTasks.map((task, idx) => (
              <li key={idx}>{task.title}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-6">
          {/* Employee Management */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold mb-2">👥 Manage Employees</h2>
              
            </div>

            {showEmployeeForm && (
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded mb-4 space-y-2">
                <input
                  type="text"
                  placeholder="Enter Employee ID"
                  value={newEmployeeId}
                  onChange={(e) => setNewEmployeeId(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg w-full"
                />
                <button
                  onClick={handleAddEmployee}
                  className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700"
                >
                  Confirm Add
                </button>
              </div>
            )}

            <ul>
              {employees.map((emp, idx) => (
                <li key={idx} className="border-b py-2 text-gray-700">
                  <div className="flex justify-between items-center">
                    <span>👤 <strong>{emp.name}</strong> — {emp.role}</span>
                    <button onClick={() => handleRemoveEmployee(emp.name)} className="text-red-600 hover:underline">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Team Chats */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">💬 Team Chats</h2>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {chats.map((chat, idx) => (
                <p key={idx}><strong>{chat.sender}:</strong> {chat.message}</p>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              />
              <button onClick={handleSendChat} className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          {/* Assign Task & All Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4">📝 Assign Task</h2>
              <form onSubmit={handleAssignTask} className="grid gap-4">
                <input
                  type="text"
                  placeholder="Task Title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <textarea
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  className="p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Assign to...</option>
                  {employees.map((emp, idx) => (
                    <option key={idx} value={emp.name}>{emp.name}</option>
                  ))}
                  <option value="Admin">Admin</option>
                </select>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Assign Task
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg overflow-y-auto max-h-[400px]">
              <h2 className="text-2xl font-bold mb-4">📋 All Tasks</h2>
              {tasks.map((task, idx) => (
                <div key={idx} className="border-b py-3">
                  <p className="font-semibold text-lg">{task.title} — <span className="text-indigo-600">{task.assignedTo}</span></p>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <span className={`text-xs inline-block mt-1 px-2 py-1 rounded-full ${task.status === 'Completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">📊 Task Distribution</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PieChart width={300} height={250}>
                <Pie data={taskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>

              <PieChart width={300} height={250}>
                <Pie data={taskStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  <Cell fill="#00C49F" />
                  <Cell fill="#FF8042" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">📌 Tasks per Role</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={taskPerRole} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="role" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="taskCount" fill="#8884d8" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
