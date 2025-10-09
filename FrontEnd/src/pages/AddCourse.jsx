import React, { useState } from "react";
import { Plus, Trash2, Home, FileText, CreditCard, Settings, File as FileIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// -------------------- Sidebar --------------------
  const CourseSidebar = ({ activeTab, setActiveTab }) => {
    const tabs = [
      { id: "basic", name: "Basic Info", icon: Home },
      { id: "media", name: "Media", icon: FileIcon }, // changed to FileIcon
      { id: "assessments", name: "Assessments", icon: FileText },
      { id: "pricing", name: "Pricing", icon: CreditCard },
      { id: "settings", name: "Settings", icon: Settings },
    ];

  return (
    <aside className="bg-white shadow-sm w-64 hidden md:block border-r border-gray-200">
      <div className="p-6">
        <nav className="mt-4">
          <ul className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-md transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:bg-blue-50"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.name}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

// -------------------- AddCourse Component --------------------
const AddCourse = () => {
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    instructor: "",
    category: "",
    tags: [],
    thumbnail: null,
    introVideo: null,
    price: "",
    discountPrice: "",
    paymentType: "paid",
    accessType: "lifetime",
    prerequisites: "",
    learningOutcomes: "",
    language: "English",
    difficultyLevel: "Beginner",
    assessments: [],
  });

  const [newTag, setNewTag] = useState("");
  const [activeTab, setActiveTab] = useState("basic");

  const handleInputChange = (field, value) => {
    setCourseData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    const tag = (newTag || "").trim();
    if (!tag) return;
    setCourseData((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), tag].filter((v, i, a) => a.indexOf(v) === i),
    }));
    setNewTag("");
  };

  const removeTag = (tagToRemove) => {
    setCourseData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((tag) => tag !== tagToRemove),
    }));
  };

  // ------------------ ASSESSMENTS ------------------
  const AddAssessment = ({ addAssessment }) => {
    const [type, setType] = useState("Quiz");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleAdd = () => {
      if (!title.trim()) return alert("Title required");
      addAssessment({
        id: Date.now(),
        type,
        title: title.trim(),
        description: description.trim(),
        questions: type === "Quiz" ? [] : undefined,
        file: null,
      });
      setTitle("");
      setDescription("");
      setType("Quiz");
    };

    return (
      <div className="border rounded p-4 space-y-2 mb-4">
        <div className="flex gap-2">
          <select value={type} onChange={(e) => setType(e.target.value)} className="p-2 border rounded">
            <option value="Quiz">Quiz</option>
            <option value="Assignment">Assignment</option>
            <option value="Project">Project</option>
          </select>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1 p-2 border rounded" />
        </div>
        <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" />
        <button onClick={handleAdd} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          + Add Assessment
        </button>
      </div>
    );
  };

  const AssessmentItem = ({ assessment, updateAssessment, removeAssessment }) => {
    const addQuestion = () => {
      const newQ = { id: Date.now(), question: "", options: ["", "", "", ""], answer: "" };
      updateAssessment({ ...assessment, questions: [...(assessment.questions || []), newQ] });
    };

    const updateQuestion = (qId, field, value) => {
      const updatedQs = (assessment.questions || []).map((q) => (q.id === qId ? { ...q, [field]: value } : q));
      updateAssessment({ ...assessment, questions: updatedQs });
    };

    const updateOption = (qId, idx, value) => {
      const updatedQs = (assessment.questions || []).map((q) =>
        q.id === qId ? { ...q, options: q.options.map((opt, i) => (i === idx ? value : opt)) } : q
      );
      updateAssessment({ ...assessment, questions: updatedQs });
    };

    const removeQuestion = (qId) => {
      updateAssessment({ ...assessment, questions: (assessment.questions || []).filter((q) => q.id !== qId) });
    };

    return (
      <div className="border p-4 rounded space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <strong>{assessment.type}:</strong> {assessment.title}
          </div>
          <button onClick={removeAssessment} className="text-red-600 hover:text-red-800">
            ✖
          </button>
        </div>
        {assessment.description && <p className="text-gray-600">{assessment.description}</p>}

        {assessment.type === "Quiz" && (
          <div className="space-y-2">
            <button onClick={addQuestion} className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
              + Add Question
            </button>
            {(assessment.questions || []).map((q) => (
              <div key={q.id} className="border p-2 rounded space-y-1">
                <div className="flex justify-between">
                  <input type="text" placeholder="Question" value={q.question} onChange={(e) => updateQuestion(q.id, "question", e.target.value)} className="w-full p-2 border rounded" />
                  <button onClick={() => removeQuestion(q.id)} className="text-red-600 hover:text-red-800 ml-2">
                    ✖
                  </button>
                </div>
                {q.options.map((opt, idx) => (
                  <input key={idx} type="text" placeholder={`Option ${idx + 1}`} value={opt} onChange={(e) => updateOption(q.id, idx, e.target.value)} className="w-full p-2 border rounded" />
                ))}
                <input type="text" placeholder="Correct Answer" value={q.answer} onChange={(e) => updateQuestion(q.id, "answer", e.target.value)} className="w-full p-2 border rounded mt-1" />
              </div>
            ))}
          </div>
        )}

        {(assessment.type === "Assignment" || assessment.type === "Project") && (
          <div>
            <input type="file" onChange={(e) => updateAssessment({ ...assessment, file: e.target.files[0] })} className="mt-2" />
          </div>
        )}
      </div>
    );
  };

  // -------------------- MEDIA HANDLER --------------------
  const renderMediaUpload = (field, label, accept, aspectClass, descriptionText) => (
    <div>
      <label className="block font-semibold mb-1">{label}</label>
      {courseData[field] ? (
        <div className={`relative w-full ${aspectClass} mx-auto rounded-lg overflow-hidden border`}>
          {accept.startsWith("image") ? (
            <img src={URL.createObjectURL(courseData[field])} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <video src={URL.createObjectURL(courseData[field])} controls className="w-full h-full object-cover" />
          )}
          <button
            type="button"
            onClick={() => handleInputChange(field, null)}
            className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black transition"
          >
            ✖ Remove
          </button>
        </div>
      ) : (
        <label htmlFor={`${field}Upload`} className={`inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg cursor-pointer hover:bg-blue-700 transition`}>
          Upload {label}
          <input id={`${field}Upload`} type="file" accept={accept} onChange={(e) => handleInputChange(field, e.target.files[0])} className="hidden" />
        </label>
      )}
      <p className="text-sm text-gray-500 mt-1">{descriptionText}</p>
    </div>
  );

  // -------------------- SAVE COURSE --------------------
  const handlePublishCourse = async () => {
    if (!courseData.title?.trim()) return alert("Title is required");
    if (!courseData.description?.trim()) return alert("Description is required");
    if (!courseData.category?.trim()) return alert("Category is required");

    try {
      const formData = new FormData();
      formData.append("title", courseData.title);
      formData.append("description", courseData.description);
      formData.append("category", courseData.category);
      formData.append("price", courseData.price || 0);
      formData.append("paymentType", courseData.paymentType);
      formData.append("accessType", courseData.accessType);

      if (courseData.thumbnail) formData.append("thumbnail", courseData.thumbnail);
      if (courseData.introVideo) formData.append("introVideo", courseData.introVideo);

      (courseData.tags || []).forEach((tag) => formData.append("tags[]", tag));

      // debug: list entries (files will show as File objects)
      console.log("FormData to send:");
      for (const pair of formData.entries()) {
        if (typeof File !== "undefined" && pair[1] instanceof File) {
          console.log(pair[0], pair[1].name, pair[1].type, pair[1].size);
        } else {
          console.log(pair[0], pair[1]);
        }
      }

      const response = await fetch("https://guzostudy-1.onrender.com/api/courses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          // NOTE: Do not set Content-Type when sending FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: response.statusText }));
        alert("Error publishing course: " + (err.message || response.statusText));
        return;
      }

      const data = await response.json();
      alert("Course Published: " + (data.title || "Success"));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error publishing course: " + (err.message || "Unknown error"));
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-100">
        <CourseSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
            <p className="text-gray-500 mb-6">Fill in the details below</p>

            {/* BASIC INFO TAB */}
            {activeTab === "basic" && (
              <div className="bg-white rounded-lg shadow p-6 mb-8 space-y-6">
                <input type="text" placeholder="Course Title" value={courseData.title} onChange={(e) => handleInputChange("title", e.target.value)} className="w-full p-2 border rounded" />
                <textarea placeholder="Short Description" value={courseData.description} onChange={(e) => handleInputChange("description", e.target.value)} className="w-full p-2 border rounded" />
                <input type="text" placeholder="Instructor" value={courseData.instructor} onChange={(e) => handleInputChange("instructor", e.target.value)} className="w-full p-2 border rounded" />
                <select value={courseData.category} onChange={(e) => handleInputChange("category", e.target.value)} className="w-full p-2 border rounded bg-white" required>
                  <option value="">Select a category</option>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Marketing">Marketing</option>
                </select>

                <div className="flex gap-2">
                  <input type="text" placeholder="Add a tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} className="flex-1 p-2 border rounded" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} />
                  <button onClick={addTag} className="px-4 py-2 bg-blue-600 text-white rounded">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {courseData.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-200 rounded-full flex items-center gap-2">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="text-red-500">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* MEDIA TAB */}
            {activeTab === "media" && (
              <div className="bg-white rounded-lg shadow p-6 mb-8 space-y-6">
                {renderMediaUpload("introVideo", "Intro Video", "video/*", "max-w-2xl aspect-video", "This video will be your main course.")}
                {renderMediaUpload("thumbnail", "Thumbnail", "image/*", "max-w-4xl aspect-[21/9]", "This thumbnail will appear on the course explore page.")}
              </div>
            )}

            {/* ASSESSMENTS TAB */}
            {activeTab === "assessments" && (
              <div className="bg-white rounded-lg shadow p-6 mb-8 space-y-6">
                <AddAssessment addAssessment={(newA) => setCourseData((prev) => ({ ...prev, assessments: [...(prev.assessments || []), newA] }))} />
                {(courseData.assessments || []).map((a) => (
                  <AssessmentItem
                    key={a.id}
                    assessment={a}
                    updateAssessment={(updated) =>
                      setCourseData((prev) => ({
                        ...prev,
                        assessments: (prev.assessments || []).map((asmt) => (asmt.id === a.id ? updated : asmt)),
                      }))
                    }
                    removeAssessment={() =>
                      setCourseData((prev) => ({
                        ...prev,
                        assessments: (prev.assessments || []).filter((asmt) => asmt.id !== a.id),
                      }))
                    }
                  />
                ))}
              </div>
            )}

            {/* PRICING TAB */}
            {activeTab === "pricing" && (
              <div className="bg-white rounded-lg shadow p-6 mb-8 space-y-4">
                <input type="number" placeholder="Price" value={courseData.price} onChange={(e) => handleInputChange("price", e.target.value)} className="w-full p-2 border rounded" disabled={courseData.paymentType === "free"} />
                <input type="number" placeholder="Discount Price (optional)" value={courseData.discountPrice} onChange={(e) => handleInputChange("discountPrice", e.target.value)} className="w-full p-2 border rounded" disabled={courseData.paymentType === "free"} />
                <select value={courseData.paymentType} onChange={(e) => handleInputChange("paymentType", e.target.value)} className="w-full p-2 border rounded">
                  <option value="paid">Paid</option>
                  <option value="free">Free</option>
                </select>

                {courseData.paymentType === "paid" && (
                  <select value={courseData.accessType} onChange={(e) => handleInputChange("accessType", e.target.value)} className="w-full p-2 border rounded">
                    <option value="lifetime">Lifetime Access</option>
                    <option value="1year">1 Year</option>
                    <option value="6months">6 Months</option>
                  </select>
                )}
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow p-6 mb-8 space-y-4">
                <textarea placeholder="Prerequisites" value={courseData.prerequisites} onChange={(e) => handleInputChange("prerequisites", e.target.value)} className="w-full p-2 border rounded" />
                <textarea placeholder="Learning Outcomes" value={courseData.learningOutcomes} onChange={(e) => handleInputChange("learningOutcomes", e.target.value)} className="w-full p-2 border rounded" />
                <select value={courseData.language} onChange={(e) => handleInputChange("language", e.target.value)} className="w-full p-2 border rounded">
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
                <select value={courseData.difficultyLevel} onChange={(e) => handleInputChange("difficultyLevel", e.target.value)} className="w-full p-2 border rounded">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t mt-6">
              <button onClick={() => alert("Draft saved!")} className="px-6 py-2 border rounded bg-white hover:bg-gray-100">
                Save as Draft
              </button>
              <div className="flex gap-3">
                <button className="px-6 py-2 border rounded bg-gray-200 hover:bg-gray-300">Preview Course</button>
                <button onClick={handlePublishCourse} className="px-6 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700">
                  Publish Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddCourse;