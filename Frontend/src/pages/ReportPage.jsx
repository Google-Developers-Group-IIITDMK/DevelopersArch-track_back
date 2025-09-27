import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { itemsAPI, messageAPI } from "../services/api";

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [newReport, setNewReport] = useState({
    type: "lost",
    title: "",
    description: "",
    location: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [error, setError] = useState("");

  const { currentUser, logout } = useAuth();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setFetchLoading(true);
      const data = await itemsAPI.getItems();

      const transformedReports = data.map((item) => ({
        id: item._id,
        type: item.type.charAt(0).toUpperCase() + item.type.slice(1),
        typeColor:
          item.type === "lost"
            ? "text-blue-600 dark:text-blue-400"
            : "text-green-600 dark:text-green-400",
        title: item.title,
        description: item.description,
        location: item.location,
        image:
          item.image ||
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
        authorId: item.user._id,
        authorName: item.user.name,
        isResolved: false,
        resolvedAt: null,
        createdAt: item.createdAt,
        messageCount: 0, // Initialize message count
      }));

      setReports(transformedReports);
    } catch (err) {
      setError("Failed to fetch reports: " + err.message);
      console.error("Error fetching reports:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchMessages = async (reportId) => {
    try {
      const data = await messagesAPI.getMessages(reportId);
      setMessages((prev) => ({
        ...prev,
        [reportId]: data,
      }));
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleSendMessage = async (reportId) => {
    if (!newMessage.trim()) return;

    try {
      setMessageLoading(true);
      const response = await messagesAPI.sendMessage(reportId, {
        message: newMessage,
        isPublic: true,
      });

      setMessages((prev) => ({
        ...prev,
        [reportId]: [...(prev[reportId] || []), response.message],
      }));

      setNewMessage("");

      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId
            ? { ...report, messageCount: (report.messageCount || 0) + 1 }
            : report
        )
      );
    } catch (err) {
      setError("Failed to send message: " + err.message);
    } finally {
      setMessageLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId, reportId) => {
    try {
      await messagesAPI.deleteMessage(messageId);

      setMessages((prev) => ({
        ...prev,
        [reportId]: prev[reportId].filter((msg) => msg._id !== messageId),
      }));

      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId
            ? {
                ...report,
                messageCount: Math.max(0, (report.messageCount || 0) - 1),
              }
            : report
        )
      );
    } catch (err) {
      setError("Failed to delete message: " + err.message);
    }
  };

  const openMessagePanel = (report) => {
    setSelectedReport(report);
    if (!messages[report.id]) {
      fetchMessages(report.id);
    }
  };

  const closeMessagePanel = () => {
    setSelectedReport(null);
  };

  const getButtonClass = (buttonText) => {
    const baseClass =
      "flex-1 text-center font-bold py-2 px-4 rounded-lg text-sm transition-colors";

    switch (buttonText) {
      case "Message":
        return `${baseClass} bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400`;
      case "Resolved":
        return `${baseClass} bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400`;
      case "Delete":
        return `${baseClass} bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400`;
      default:
        return baseClass;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setNewReport({ ...newReport, image: file });
    }
  };

  const handleCreateReport = async () => {
    if (!newReport.title || !newReport.description || !newReport.location) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("title", newReport.title);
      formData.append("description", newReport.description);
      formData.append("location", newReport.location);
      formData.append("type", newReport.type);

      if (newReport.image) {
        formData.append("image", newReport.image);
      }

      const response = await itemsAPI.createItem(formData);

      await fetchReports();

      setNewReport({
        type: "lost",
        title: "",
        description: "",
        location: "",
        image: null,
      });
      setShowCreateForm(false);

      alert("Report created successfully!");
    } catch (err) {
      setError("Failed to create report: " + err.message);
      console.error("Error creating report:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      await itemsAPI.deleteItem(id);
      setReports(reports.filter((report) => report.id !== id));
      alert("Report deleted successfully!");
    } catch (err) {
      setError("Failed to delete report: " + err.message);
      console.error("Error deleting report:", err);
    }
  };

  const handleResolveReport = async (id) => {
    try {
      setReports(
        reports.map((report) =>
          report.id === id
            ? {
                ...report,
                status: "resolved",
                isResolved: true,
                resolvedAt: new Date().toLocaleDateString(),
                authorButtons: report.authorButtons.filter(
                  (btn) => btn !== "Resolved"
                ),
              }
            : report
        )
      );
      alert("Report marked as resolved!");
    } catch (err) {
      setError("Failed to resolve report: " + err.message);
      console.error("Error resolving report:", err);
    }
  };

  const handleUnresolveReport = async (id) => {
    try {
      setReports(
        reports.map((report) =>
          report.id === id
            ? {
                ...report,
                status: "active",
                isResolved: false,
                resolvedAt: null,
                authorButtons: [...report.authorButtons, "Resolved"],
              }
            : report
        )
      );
      alert("Report reopened!");
    } catch (err) {
      setError("Failed to reopen report: " + err.message);
      console.error("Error reopening report:", err);
    }
  };

  const handleButtonClick = async (buttonText, reportId) => {
    if (buttonText === "Delete") {
      handleDeleteReport(reportId);
    } else if (buttonText === "Resolved") {
      handleResolveReport(reportId);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <header className="fixed top-0 left-0 right-0 z-50 p-4 bg-black backdrop-blur-sm border-b border-gray-700">
        <nav className="flex justify-between items-center min-h-[10vh]">
          <div className="flex">
            <Link
              to="/"
              className="relative text-lg text-gray-300 px-5 py-2 mx-2 transition-all duration-500 hover:text-cyan-400"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="relative text-lg text-gray-300 px-5 py-2 mx-2 transition-all duration-500 hover:text-cyan-400"
            >
              About
            </Link>
            <Link
              to="/reports"
              className="relative text-lg text-cyan-400 px-5 py-2 mx-2 transition-all duration-500 hover:text-cyan-300"
            >
              Reports
            </Link>
          </div>
          {currentUser && (
            <div className="flex items-center gap-4">
              <span className="text-gray-300">Welcome, {currentUser.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </header>

      <main className="pt-24 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-100">Reports</h2>
            <button
              onClick={() => setShowCreateForm(true)}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 hover:bg-orange-700 px-4 py-3 text-sm font-bold text-white shadow-lg transition-colors disabled:opacity-50"
            >
              <span>+</span>
              <span>{loading ? "Loading..." : "Create Report"}</span>
            </button>
          </div>

          {showCreateForm && (
            <CreateReportForm
              newReport={newReport}
              setNewReport={setNewReport}
              handleCreateReport={handleCreateReport}
              setShowCreateForm={setShowCreateForm}
              handleFileChange={handleFileChange}
              loading={loading}
            />
          )}

          {fetchLoading ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">⏳</div>
              <p className="text-gray-400 text-lg">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <p className="text-gray-400 text-lg">
                No reports yet. Create your first report!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  getButtonClass={getButtonClass}
                  handleButtonClick={handleButtonClick}
                  currentUser={currentUser}
                  handleResolveReport={handleResolveReport}
                  handleUnresolveReport={handleUnresolveReport}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      {selectedReport && (
        <MessagePanel
          report={selectedReport}
          messages={messages[selectedReport.id] || []}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={handleSendMessage}
          onDeleteMessage={handleDeleteMessage}
          onClose={closeMessagePanel}
          currentUser={currentUser}
          loading={messageLoading}
        />
      )}
    </div>
  );
};

const CreateReportForm = ({
  newReport,
  setNewReport,
  handleCreateReport,
  setShowCreateForm,
  handleFileChange,
  loading,
}) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8 border border-gray-700">
      <h3 className="text-xl font-bold mb-6 text-gray-100">
        Create New Report
      </h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-3 text-gray-300">
            Type *
          </label>
          <select
            value={newReport.type}
            onChange={(e) =>
              setNewReport({ ...newReport, type: e.target.value })
            }
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            disabled={loading}
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3 text-gray-300">
            Title *
          </label>
          <input
            type="text"
            value={newReport.title}
            onChange={(e) =>
              setNewReport({ ...newReport, title: e.target.value })
            }
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Enter item title"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3 text-gray-300">
            Location *
          </label>
          <input
            type="text"
            value={newReport.location}
            onChange={(e) =>
              setNewReport({ ...newReport, location: e.target.value })
            }
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Where was it lost/found?"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3 text-gray-300">
            Description *
          </label>
          <textarea
            value={newReport.description}
            onChange={(e) =>
              setNewReport({ ...newReport, description: e.target.value })
            }
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Enter description"
            rows="4"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3 text-gray-300">
            Image (Optional)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              disabled={loading}
            />
            {newReport.image && (
              <div className="flex-shrink-0">
                <img
                  src={URL.createObjectURL(newReport.image)}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded"
                />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Supported formats: JPG, JPEG, PNG. Max size: 5MB
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleCreateReport}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Report"}
          </button>
          <button
            onClick={() => setShowCreateForm(false)}
            disabled={loading}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-gray-300 py-3 px-6 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const ReportCard = ({ report, onMessageClick, currentUser, messageCount }) => {
  const isAuthor = report.authorId === currentUser.id;

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300">
      <div className="p-6 flex flex-col h-full">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${report.typeColor} inline-block`}
              >
                {report.type}
              </span>
              {report.isResolved && (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                  Resolved
                </span>
              )}
            </div>
            {isAuthor && (
              <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">
                Your Report
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-100 mb-3">
            {report.title}
          </h3>
          <p className="text-gray-400 text-sm mb-2">{report.location}</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            {report.description}
          </p>
          <div className="mt-2 space-y-1">
            <p className="text-gray-500 text-xs">By: {report.authorName}</p>
            <p className="text-blue-400 text-xs">Messages: {messageCount}</p>
            {report.isResolved && report.resolvedAt && (
              <p className="text-green-500 text-xs">
                Resolved on: {report.resolvedAt}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => onMessageClick(report)}
            className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-center font-bold py-2 px-4 rounded-lg text-sm transition-colors"
          >
            💬 Message
          </button>
          {isAuthor && (
            <button className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-center font-bold py-2 px-4 rounded-lg text-sm transition-colors">
              Delete
            </button>
          )}
        </div>
      </div>
      <div
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url("${report.image}")` }}
      />
    </div>
  );
};

const MessagePanel = ({
  report,
  messages,
  newMessage,
  setNewMessage,
  onSendMessage,
  onDeleteMessage,
  onClose,
  currentUser,
  loading,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-100">
              Messages for: {report.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-400 text-sm">Type: {report.type}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center">
              No messages yet. Be the first to comment!
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`p-3 rounded-lg ${
                  msg.user._id === currentUser.id
                    ? "bg-blue-500/20"
                    : "bg-gray-700/50"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm text-blue-400">
                    {msg.user.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-200 text-sm">{msg.message}</p>
                {msg.user._id === currentUser.id && (
                  <button
                    onClick={() => onDeleteMessage(msg._id, report.id)}
                    className="text-xs text-red-400 hover:text-red-300 mt-1"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              onKeyPress={(e) => e.key === "Enter" && onSendMessage(report.id)}
            />
            <button
              onClick={() => onSendMessage(report.id)}
              disabled={loading || !newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
