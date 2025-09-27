import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newReport, setNewReport] = useState({
    type: "Lost",
    title: "",
    description: "",
    image: "",
  });

  const { currentUser, logout } = useAuth();

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

  const handleCreateReport = () => {
    if (newReport.title && newReport.description) {
      const report = {
        id: Date.now(),
        type: newReport.type,
        typeColor:
          newReport.type === "Lost"
            ? "text-blue-600 dark:text-blue-400"
            : "text-green-600 dark:text-green-400",
        title: newReport.title,
        description: newReport.description,
        image:
          newReport.image ||
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
        status: "active",
        buttons: ["Message"],
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorButtons: ["Resolved", "Delete"],
        isResolved: false,
        resolvedAt: null,
      };

      setReports([...reports, report]);
      setNewReport({
        type: "Lost",
        title: "",
        description: "",
        image: "",
      });
      setShowCreateForm(false);
    }
  };

  const handleDeleteReport = (id) => {
    setReports(reports.filter((report) => report.id !== id));
  };

  const handleResolveReport = (id) => {
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
  };

  const handleUnresolveReport = (id) => {
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
  };

  const handleButtonClick = (buttonText, reportId) => {
    if (buttonText === "Delete") {
      handleDeleteReport(reportId);
    } else if (buttonText === "Resolved") {
      handleResolveReport(reportId);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <header className="fixed top-0 left-0 right-0 z-50 p-4 bg-black backdrop-blur-sm border-b border-gray-700">
        <nav className="flex justify-center items-center min-h-[10vh]">
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
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-100">Reports</h2>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 hover:bg-orange-700 px-4 py-3 text-sm font-bold text-white shadow-lg transition-colors"
            >
              <span>+</span>
              <span>Create Report</span>
            </button>
          </div>

          {showCreateForm && (
            <CreateReportForm
              newReport={newReport}
              setNewReport={setNewReport}
              handleCreateReport={handleCreateReport}
              setShowCreateForm={setShowCreateForm}
            />
          )}

          {reports.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <p className="text-gray-400 text-lg">
                No reports yet. Create your first report!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {reports.map((report, index) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  index={index}
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
    </div>
  );
};

const CreateReportForm = ({
  newReport,
  setNewReport,
  handleCreateReport,
  setShowCreateForm,
}) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8 border border-gray-700">
      <h3 className="text-xl font-bold mb-6 text-gray-100">
        Create New Report
      </h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-3 text-gray-300">
            Type
          </label>
          <select
            value={newReport.type}
            onChange={(e) =>
              setNewReport({ ...newReport, type: e.target.value })
            }
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3 text-gray-300">
            Title
          </label>
          <input
            type="text"
            value={newReport.title}
            onChange={(e) =>
              setNewReport({ ...newReport, title: e.target.value })
            }
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Enter item title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3 text-gray-300">
            Description
          </label>
          <textarea
            value={newReport.description}
            onChange={(e) =>
              setNewReport({ ...newReport, description: e.target.value })
            }
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Enter description"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3 text-gray-300">
            Image URL (Optional)
          </label>
          <input
            type="text"
            value={newReport.image}
            onChange={(e) =>
              setNewReport({ ...newReport, image: e.target.value })
            }
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Enter image URL"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleCreateReport}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-bold transition-colors"
          >
            Create Report
          </button>
          <button
            onClick={() => setShowCreateForm(false)}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-gray-300 py-3 px-6 rounded-lg font-bold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const ReportCard = ({
  report,
  index,
  getButtonClass,
  handleButtonClick,
  currentUser,
  handleResolveReport,
  handleUnresolveReport,
}) => {
  const isAuthor = report.authorId === currentUser.id;

  return (
    <div
      className={`bg-gray-800 rounded-xl shadow-lg overflow-hidden border transition-all duration-300 ${
        report.isResolved
          ? "border-green-500/30 hover:border-green-500/50"
          : "border-gray-700 hover:border-gray-600"
      }`}
    >
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
          <p className="text-gray-400 text-sm leading-relaxed">
            {report.description}
          </p>
          <div className="mt-2 space-y-1">
            <p className="text-gray-500 text-xs">By: {report.authorName}</p>
            {report.isResolved && report.resolvedAt && (
              <p className="text-green-500 text-xs">
                Resolved on: {report.resolvedAt}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          {report.buttons.map((buttonText) => (
            <button
              key={buttonText}
              className={getButtonClass(buttonText)}
              onClick={() => handleButtonClick(buttonText, report.id)}
            >
              {buttonText}
            </button>
          ))}

          {isAuthor &&
            report.authorButtons &&
            report.authorButtons.map((buttonText) => (
              <button
                key={buttonText}
                className={getButtonClass(buttonText)}
                onClick={() => handleButtonClick(buttonText, report.id)}
              >
                {buttonText}
              </button>
            ))}

          {isAuthor && report.isResolved && (
            <button
              className="flex-1 text-center font-bold py-2 px-4 rounded-lg text-sm transition-colors bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
              onClick={() => handleUnresolveReport(report.id)}
            >
              Reopen
            </button>
          )}
        </div>
      </div>
      <div
        className="h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url("${report.image}")` }}
      >
        {report.isResolved && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              RESOLVED
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
