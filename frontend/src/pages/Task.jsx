import React, { useEffect, useState } from 'react'; 
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Textarea } from '../components/utils/Input';
import Loader from '../components/utils/Loader';
import useFetch from '../hooks/useFetch';
import MainLayout from '../layouts/MainLayout';
import validateManyFields from '../validations';

ChartJS.register(ArcElement, Tooltip, Legend);

const Task = () => {
  const authState = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();
  const { taskId } = useParams();

  const mode = taskId === undefined ? 'add' : 'update';
  const [task, setTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Pending',
    tags: []
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch single task if update mode
  useEffect(() => {
    document.title = mode === 'add' ? 'Add task' : 'Update Task';

    if (mode === 'update') {
      const config = {
        url: `/tasks/${taskId}`,
        method: 'get',
        headers: { Authorization: authState.token }
      };
      fetchData(config, { showSuccessToast: false }).then((data) => {
        setTask(data.task);
        setFormData({
          title: data.task.title,
          description: data.task.description,
          dueDate: data.task.dueDate,
          priority: data.task.priority,
          status: data.task.status,
          tags: data.task.tags
        });
      });
    }
  }, [mode, taskId, authState, fetchData]);

  // Fetch all tasks for the sidebar and chart
  useEffect(() => {
    const config = {
      url: '/tasks',
      method: 'get',
      headers: { Authorization: authState.token }
    };
    fetchData(config, { showSuccessToast: false }).then((data) => {
      setTasks(data.tasks || []);
    });
  }, [authState, fetchData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      tags: task.tags
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateManyFields('task', formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    const config = {
      url: mode === 'add' ? '/tasks' : `/tasks/${taskId}`,
      method: mode === 'add' ? 'post' : 'put',
      data: formData,
      headers: { Authorization: authState.token }
    };
    fetchData(config).then(() => {
      navigate('/');
    });
  };

  const fieldError = (field) => (
    <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? 'block' : 'hidden'}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  );

  // Group tasks by priority
  const groupedTasks = {
    High: [],
    Medium: [],
    Low: []
  };

  tasks.forEach((t) => groupedTasks[t.priority]?.push(t));

  // Chart data for status progress
  const statusCounts = tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Tasks',
        data: [
          statusCounts['Pending'] || 0,
          statusCounts['In Progress'] || 0,
          statusCounts['Completed'] || 0
        ],
        backgroundColor: ['#f87171', '#60a5fa', '#34d399'],
        borderWidth: 1
      }
    ]
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <div className="w-full md:w-1/3 p-4 bg-gray-50 border-r-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Tasks by Priority</h3>
          {['High', 'Medium', 'Low'].map((priority) => (
            <div key={priority} className="mb-4">
              <h4 className="text-md font-semibold text-gray-600 mb-2">{priority}</h4>
              <ul className="pl-4 list-disc text-sm text-gray-600">
                {groupedTasks[priority].length > 0 ? (
                  groupedTasks[priority].map((t) => (
                    <li key={t._id}>{t.title}</li>
                  ))
                ) : (
                  <li className="text-gray-400">No tasks</li>
                )}
              </ul>
            </div>
          ))}

          <div className="mt-8">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Task Status Progress</h4>
            <Doughnut data={chartData} />
          </div>
        </div>

        {/* Form Area */}
        <form className="w-full md:w-2/3 m-auto my-8 max-w-[600px] bg-white p-8 border-2 shadow-lg rounded-lg">
          {loading ? (
            <Loader />
          ) : (
            <>
              <h2 className='text-center mb-6 text-xl font-semibold text-gray-800'>
                {mode === 'add' ? 'Add New Task' : 'Edit Task'}
              </h2>

              {/* Title */}
              <div className="mb-4">
                <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  placeholder="Enter task title"
                  onChange={handleChange}
                  className="block w-full mt-2 px-4 py-2 text-gray-600 rounded-lg border-2 border-gray-200 focus:border-blue-500 transition"
                />
                {fieldError('title')}
              </div>

              {/* Description */}
              <div className="mb-4">
                <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                <Textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  placeholder="Write here..."
                  onChange={handleChange}
                  error={formErrors.description}
                />
              </div>

              {/* Due Date */}
              <div className="mb-4">
                <label htmlFor="dueDate" className="text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="block w-full mt-2 px-4 py-2 text-gray-600 rounded-lg border-2 border-gray-200 focus:border-blue-500 transition"
                />
                {fieldError('dueDate')}
              </div>

              {/* Priority */}
              <div className="mb-4">
                <label htmlFor="priority" className="text-sm font-medium text-gray-700">Priority</label>
                <select
                  name="priority"
                  id="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="block w-full mt-2 px-4 py-2 text-gray-600 rounded-lg border-2 border-gray-200 focus:border-blue-500 transition"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Status */}
              <div className="mb-4">
                <label htmlFor="status" className="text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full mt-2 px-4 py-2 text-gray-600 rounded-lg border-2 border-gray-200 focus:border-blue-500 transition"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <label htmlFor="tags" className="text-sm font-medium text-gray-700">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  value={formData.tags.join(', ')}
                  placeholder="Add tags..."
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value.split(',').map((tag) => tag.trim())
                    })
                  }
                  className="block w-full mt-2 px-4 py-2 text-gray-600 rounded-lg border-2 border-gray-200 focus:border-blue-500 transition"
                />
                {fieldError('tags')}
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition"
                  onClick={handleSubmit}
                >
                  {mode === 'add' ? 'Add Task' : 'Update Task'}
                </button>
                <button
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </button>
                {mode === 'update' && (
                  <button
                    className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </MainLayout>
  );
};

export default Task;
