import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';
import ChatWindow from '../pages/ChatWindow'

const priorityColors = {
  High: 'bg-red-600 text-white',
  Medium: 'bg-yellow-500 text-black',
  Low: 'bg-green-500 text-white',
};

const Tasks = () => {
  const authState = useSelector((state) => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [sorted, setSorted] = useState(false);
  const [fetchData, { loading }] = useFetch();

  const fetchTasks = useCallback(() => {
    const config = {
      url: '/tasks',
      method: 'get',
      headers: { Authorization: authState.token },
    };
    fetchData(config, { showSuccessToast: false }).then((data) =>
      setTasks(data.tasks)
    );
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  const handleDelete = (id) => {
    const config = {
      url: `/tasks/${id}`,
      method: 'delete',
      headers: { Authorization: authState.token },
    };
    fetchData(config).then(() => fetchTasks());
  };

  const handleSort = () => {
    setSorted(!sorted);
  };

  const calculateDaysLeft = (dueDate) => {
    const currentDate = new Date();
    const dueDateObj = new Date(dueDate);
    const timeDiff = dueDateObj - currentDate;
    const daysLeft = Math.floor(timeDiff / (1000 * 3600 * 24));
    return daysLeft;
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const displayedTasks = sorted
    ? [...filteredTasks].sort((a, b) => {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
    : filteredTasks;

  return (
    <div className="my-6 mx-auto max-w-4xl p-6 bg-gray-100 rounded-lg shadow-md">
      {tasks.length > 0 && (
        <>
          <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Your Tasks</h2>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={handleSort}
            >
              {sorted ? 'Reset Order' : 'Sort by Priority'}
            </button>
          </div>
        </>
      )}

      {loading ? (
        <Loader />
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <span className="text-lg text-gray-500">No tasks found</span>
          <Link
            to="/tasks/add"
            className="mt-4 bg-blue-600 text-white hover:bg-blue-700 font-medium rounded-lg px-6 py-2"
          >
            + Add new task
          </Link>
        </div>
      ) : (
        displayedTasks.map((task, index) => (
          <div
            key={task._id}
            className="bg-white my-5 p-6 text-gray-700 rounded-lg shadow-lg border border-gray-200 transition hover:shadow-xl"
          >
            {/* Task Header */}
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <span className="text-lg font-semibold text-gray-800">Task #{index + 1}</span>
              <div className="flex items-center">
                <span
                  className={`px-4 py-1 text-sm font-semibold rounded-full ${priorityColors[task.priority]}`}
                >
                  {task.priority}
                </span>
              </div>
            </div>

            {/* Task Content */}
            <div className="text-lg font-bold text-gray-900">{task.title}</div>
            <p className="mt-1 text-md text-gray-600">{task.description}</p>

            {/* Task Info */}
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <p>
                <span className="font-medium">Due Date:</span>{' '}
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Status:</span> {task.status}
              </p>
              <p>
                <span className="font-medium">Tags:</span>{' '}
                {task.tags.length > 0 ? task.tags.join(', ') : 'None'}
              </p>
              <p className="text-gray-500">
                <span className="font-medium">Days Left:</span> {calculateDaysLeft(task.dueDate)} days
              </p>
            </div>

            {/* Task Actions */}
            <ChatWindow/>
            <div className="mt-5 flex items-center justify-end gap-4">
              <Tooltip text="Edit Task" position="top">
                <Link
                  to={`/tasks/${task._id}`}
                  className="text-green-600 hover:text-green-700 transition"
                >
                  <i className="fa-solid fa-pen text-xl"></i>
                </Link>
              </Tooltip>
              <Tooltip text="Delete Task" position="top">
                <span
                  className="text-red-500 hover:text-red-700 cursor-pointer transition"
                  onClick={() => handleDelete(task._id)}
                >
                  <i className="fa-solid fa-trash text-xl"></i>
                </span>
              </Tooltip>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Tasks;
