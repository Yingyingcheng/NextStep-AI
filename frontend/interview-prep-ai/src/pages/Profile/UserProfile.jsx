import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuPen,
  LuMail,
  LuPlus,
  LuTrash2,
  LuUpload,
  LuFileText,
  LuBriefcase,
  LuGraduationCap,
  LuLink,
  LuWrench,
  LuFolderOpen,
  LuGithub,
  LuLinkedin,
  LuGlobe,
} from "react-icons/lu";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import Input from "../../components/Inputs/Input";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";

const EMPTY_EDUCATION = {
  school: "",
  degree: "",
  fieldOfStudy: "",
  startDate: "",
  endDate: "",
  description: "",
};

const EMPTY_WORK = {
  company: "",
  title: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
};

const EMPTY_PROJECT = { name: "", description: "", url: "" };

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
};

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon className="text-amber-700" size={18} />
    <h3 className="text-lg font-semibold text-slate-600">{title}</h3>
  </div>
);

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border border-amber-100 p-4 sm:p-6 md:p-8 ${className}`}
  >
    {children}
  </div>
);

const UserProfile = () => {
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fullName, setFullName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  const [resumeFile, setResumeFile] = useState(null);
  const [education, setEducation] = useState(
    user?.education?.length
      ? user.education.map((e) => ({
          ...e,
          startDate: formatDate(e.startDate),
          endDate: formatDate(e.endDate),
        }))
      : [],
  );
  const [workExperience, setWorkExperience] = useState(
    user?.workExperience?.length
      ? user.workExperience.map((w) => ({
          ...w,
          startDate: formatDate(w.startDate),
          endDate: formatDate(w.endDate),
        }))
      : [],
  );
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [projects, setProjects] = useState(user?.projects || []);
  const [contact, setContact] = useState({
    linkedin: user?.contact?.linkedin || "",
    github: user?.contact?.github || "",
    website: user?.contact?.website || "",
  });

  const updateListItem = (list, setList, index, field, value) => {
    const updated = [...list];
    updated[index] = { ...updated[index], [field]: value };
    setList(updated);
  };

  const removeListItem = (list, setList, index) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput("");
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      let profileImageUrl;
      let resumeUrl;

      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      if (resumeFile) {
        const formData = new FormData();
        formData.append("resume", resumeFile);
        const resumeRes = await axiosInstance.post(
          API_PATHS.PROFILE.UPLOAD_RESUME,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        resumeUrl = resumeRes.data.resumeUrl;
      }

      const response = await axiosInstance.put(
        API_PATHS.PROFILE.UPDATE_PROFILE,
        {
          name: fullName,
          ...(profileImageUrl !== undefined && { profileImageUrl }),
          ...(resumeUrl !== undefined && { resumeUrl }),
          education: education.filter((e) => e.school.trim()),
          workExperience: workExperience.filter(
            (w) => w.company.trim() && w.title.trim(),
          ),
          skills,
          projects: projects.filter((p) => p.name.trim()),
          contact,
        },
      );

      updateUser(response.data);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setProfilePic(null);
      setPreview(null);
      setResumeFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFullName(user?.name || "");
    setProfilePic(null);
    setPreview(null);
    setResumeFile(null);
    setEducation(
      user?.education?.length
        ? user.education.map((e) => ({
            ...e,
            startDate: formatDate(e.startDate),
            endDate: formatDate(e.endDate),
          }))
        : [],
    );
    setWorkExperience(
      user?.workExperience?.length
        ? user.workExperience.map((w) => ({
            ...w,
            startDate: formatDate(w.startDate),
            endDate: formatDate(w.endDate),
          }))
        : [],
    );
    setSkills(user?.skills || []);
    setProjects(user?.projects || []);
    setContact({
      linkedin: user?.contact?.linkedin || "",
      github: user?.contact?.github || "",
      website: user?.contact?.website || "",
    });
    setIsEditing(false);
  };

  const getViewableResumeUrl = (url) => {
    if (!url) return url;
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-6 md:pt-10 pb-10 px-4 md:px-8 font-mono">
        <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
          {/* ===== LEFT COLUMN: Profile header card ===== */}
          <div className="w-full md:w-1/3 md:sticky md:top-28 md:self-start space-y-6">
            <div className=" bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
              <div className="h-24 bg-[#e5cea1]" />
              <div className="px-4 sm:px-6 md:px-8 -mt-12">
                {isEditing ? (
                  <ProfilePhotoSelector
                    image={profilePic}
                    setImage={setProfilePic}
                    preview={preview}
                    setPreview={setPreview}
                    currentImageUrl={user?.profileImageUrl}
                  />
                ) : (
                  <div className="flex justify-center mb-6">
                    {user?.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-white shadow-md">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="px-4 sm:px-6 md:px-8 pb-6 md:pb-8">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      value={fullName}
                      onChange={({ target }) => setFullName(target.value)}
                      label="Full Name"
                      placeholder="Your name"
                      type="text"
                    />
                    <div>
                      <label className="text-[13px] text-slate-500">
                        Email Address
                      </label>
                      <div className="input-box flex items-center gap-2 text-slate-400">
                        <LuMail />
                        <span className="text-sm">{user?.email}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-amber-100">
                      <SectionHeader icon={LuLink} title="Contact & Links" />
                      <div className="space-y-3">
                        <Input
                          label="LinkedIn"
                          placeholder="https://linkedin.com/in/..."
                          type="text"
                          value={contact.linkedin}
                          onChange={(e) =>
                            setContact({ ...contact, linkedin: e.target.value })
                          }
                        />
                        <Input
                          label="GitHub"
                          placeholder="https://github.com/..."
                          type="text"
                          value={contact.github}
                          onChange={(e) =>
                            setContact({ ...contact, github: e.target.value })
                          }
                        />
                        <Input
                          label="Website"
                          placeholder="https://yoursite.com"
                          type="text"
                          value={contact.website}
                          onChange={(e) =>
                            setContact({ ...contact, website: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <h2 className="text-xl leading-tight font-semibold text-slate-600">
                      {user?.name}
                    </h2>
                    <p className="text-sm leading-tight text-slate-600 mt-1">
                      {user?.email}
                    </p>

                    {(contact.linkedin ||
                      contact.github ||
                      contact.website) && (
                      <div className="mt-4 pt-4 border-t border-amber-100 space-y-2 text-left">
                        {contact.linkedin && (
                          <a
                            href={contact.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors text-sm truncate"
                          >
                            <LuLinkedin size={16} className="shrink-0" />
                            <span className="truncate">{contact.linkedin}</span>
                          </a>
                        )}
                        {contact.github && (
                          <a
                            href={contact.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors text-sm truncate"
                          >
                            <LuGithub size={16} className="shrink-0" />
                            <span className="truncate">{contact.github}</span>
                          </a>
                        )}
                        {contact.website && (
                          <a
                            href={contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors text-sm truncate"
                          >
                            <LuGlobe size={16} className="shrink-0" />
                            <span className="truncate">{contact.website}</span>
                          </a>
                        )}
                      </div>
                    )}

                    <button
                      className="mt-6 inline-flex items-center gap-2 bg-[#dccaa7] text-white text-sm px-6 py-2.5 rounded-md hover:bg-[#dccaa7]/50 hover:text-slate-500 transition-colors cursor-pointer"
                      onClick={() => setIsEditing(true)}
                    >
                      <LuPen className="text-sm" />
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Resume */}
            <Card>
              <SectionHeader icon={LuFileText} title="Resume" />
              {isEditing ? (
                <div>
                  <label className="flex items-center gap-2 cursor-pointer text-sm border border-dashed border-amber-300 rounded-lg p-4 hover:bg-amber-50 transition-colors">
                    <LuUpload className="text-amber-600" />
                    <span className="text-slate-600">
                      {resumeFile
                        ? resumeFile.name
                        : "Upload PDF, DOC, or DOCX"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                    />
                  </label>
                  {user?.resumeUrl && !resumeFile && (
                    <a
                      href={getViewableResumeUrl(user.resumeUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-amber-600 hover:underline text-sm mt-2"
                    >
                      <LuFileText size={14} /> View current resume
                    </a>
                  )}
                </div>
              ) : user?.resumeUrl ? (
                <a
                  href={getViewableResumeUrl(user.resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-600 hover:underline text-sm"
                >
                  <LuFileText size={14} /> View Resume
                </a>
              ) : (
                <p className="text-sm text-slate-400">
                  No resume uploaded yet.
                </p>
              )}
            </Card>
            {/* Skills */}
            <Card>
              <SectionHeader icon={LuWrench} title="Skills" />
              {isEditing ? (
                <div>
                  <div className="flex gap-2 mb-3 items-center">
                    <input
                      type="text"
                      className="input-box flex-1 text-sm"
                      placeholder="Type skills and press Add"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddSkill())
                      }
                    />
                    <button
                      onClick={handleAddSkill}
                      className="bg-[#dccaa7] text-white text-sm font-semibold px-4 py-3 rounded-lg hover:bg-[#dccaa7]/80 transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-sm px-3 py-1 rounded-full border border-amber-200"
                      >
                        {skill}
                        <button
                          onClick={() =>
                            setSkills(skills.filter((_, idx) => idx !== i))
                          }
                          className="hover:text-red-500 cursor-pointer"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-amber-50 text-amber-800 text-sm px-3 py-1 rounded-full border border-amber-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No skills added yet.</p>
              )}
            </Card>
          </div>
          {/* ===== RIGHT COLUMN: All detail sections ===== */}
          <div className="w-full md:w-2/3 space-y-6">
            {/* Education */}
            <Card>
              <SectionHeader icon={LuGraduationCap} title="Education" />
              {isEditing ? (
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <div
                      key={i}
                      className="border border-slate-200 rounded-lg p-4 space-y-3 relative"
                    >
                      <button
                        onClick={() =>
                          removeListItem(education, setEducation, i)
                        }
                        className="absolute top-3 right-3 text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        <LuTrash2 size={16} />
                      </button>
                      <Input
                        label="School *"
                        placeholder="University name"
                        type="text"
                        value={edu.school}
                        onChange={(e) =>
                          updateListItem(
                            education,
                            setEducation,
                            i,
                            "school",
                            e.target.value,
                          )
                        }
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          label="Degree"
                          placeholder="B.S., M.S., etc."
                          type="text"
                          value={edu.degree}
                          onChange={(e) =>
                            updateListItem(
                              education,
                              setEducation,
                              i,
                              "degree",
                              e.target.value,
                            )
                          }
                        />
                        <Input
                          label="Field of Study"
                          placeholder="Computer Science"
                          type="text"
                          value={edu.fieldOfStudy}
                          onChange={(e) =>
                            updateListItem(
                              education,
                              setEducation,
                              i,
                              "fieldOfStudy",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[13px] text-slate-800">
                            Start Date
                          </label>
                          <input
                            type="date"
                            className="input-box w-full text-sm"
                            value={edu.startDate}
                            onChange={(e) =>
                              updateListItem(
                                education,
                                setEducation,
                                i,
                                "startDate",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="text-[13px] text-slate-800">
                            End Date
                          </label>
                          <input
                            type="date"
                            className="input-box w-full text-sm"
                            value={edu.endDate}
                            onChange={(e) =>
                              updateListItem(
                                education,
                                setEducation,
                                i,
                                "endDate",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[13px] text-slate-800">
                          Description
                        </label>
                        <textarea
                          className="input-box w-full text-sm resize-none"
                          rows={2}
                          placeholder="Activities, honors, etc."
                          value={edu.description}
                          onChange={(e) =>
                            updateListItem(
                              education,
                              setEducation,
                              i,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setEducation([...education, { ...EMPTY_EDUCATION }])
                    }
                    className="inline-flex items-center gap-1 text-amber-600 text-sm font-semibold hover:underline cursor-pointer"
                  >
                    <LuPlus size={14} /> Add Education
                  </button>
                </div>
              ) : education.length > 0 ? (
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <div key={i} className="border-l-2 border-amber-300 pl-4">
                      <p className="font-semibold text-black">{edu.school}</p>
                      <p className="text-sm text-slate-600">
                        {[edu.degree, edu.fieldOfStudy]
                          .filter(Boolean)
                          .join(" in ")}
                      </p>
                      {(edu.startDate || edu.endDate) && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {formatDate(edu.startDate)} —{" "}
                          {formatDate(edu.endDate) || "Present"}
                        </p>
                      )}
                      {edu.description && (
                        <p className="text-sm text-slate-500 mt-1">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No education added yet.
                </p>
              )}
            </Card>

            {/* Work Experience */}
            <Card>
              <SectionHeader icon={LuBriefcase} title="Work Experience" />
              {isEditing ? (
                <div className="space-y-4">
                  {workExperience.map((work, i) => (
                    <div
                      key={i}
                      className="border border-slate-200 rounded-lg p-4 space-y-3 relative"
                    >
                      <button
                        onClick={() =>
                          removeListItem(workExperience, setWorkExperience, i)
                        }
                        className="absolute top-3 right-3 text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        <LuTrash2 size={16} />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          label="Company *"
                          placeholder="Company name"
                          type="text"
                          value={work.company}
                          onChange={(e) =>
                            updateListItem(
                              workExperience,
                              setWorkExperience,
                              i,
                              "company",
                              e.target.value,
                            )
                          }
                        />
                        <Input
                          label="Title *"
                          placeholder="Job title"
                          type="text"
                          value={work.title}
                          onChange={(e) =>
                            updateListItem(
                              workExperience,
                              setWorkExperience,
                              i,
                              "title",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <Input
                        label="Location"
                        placeholder="City, State"
                        type="text"
                        value={work.location}
                        onChange={(e) =>
                          updateListItem(
                            workExperience,
                            setWorkExperience,
                            i,
                            "location",
                            e.target.value,
                          )
                        }
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[13px] text-slate-800">
                            Start Date
                          </label>
                          <input
                            type="date"
                            className="input-box w-full text-sm"
                            value={work.startDate}
                            onChange={(e) =>
                              updateListItem(
                                workExperience,
                                setWorkExperience,
                                i,
                                "startDate",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="text-[13px] text-slate-800">
                            End Date
                          </label>
                          <input
                            type="date"
                            className="input-box w-full text-sm"
                            value={work.current ? "" : work.endDate}
                            disabled={work.current}
                            onChange={(e) =>
                              updateListItem(
                                workExperience,
                                setWorkExperience,
                                i,
                                "endDate",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={work.current}
                          onChange={(e) =>
                            updateListItem(
                              workExperience,
                              setWorkExperience,
                              i,
                              "current",
                              e.target.checked,
                            )
                          }
                          className="accent-amber-600"
                        />
                        I currently work here
                      </label>
                      <div>
                        <label className="text-[13px] text-slate-800">
                          Description
                        </label>
                        <textarea
                          className="input-box w-full text-sm resize-none"
                          rows={2}
                          placeholder="Key responsibilities & achievements"
                          value={work.description}
                          onChange={(e) =>
                            updateListItem(
                              workExperience,
                              setWorkExperience,
                              i,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setWorkExperience([...workExperience, { ...EMPTY_WORK }])
                    }
                    className="inline-flex items-center gap-1 text-amber-600 text-sm font-semibold hover:underline cursor-pointer"
                  >
                    <LuPlus size={14} /> Add Work Experience
                  </button>
                </div>
              ) : workExperience.length > 0 ? (
                <div className="space-y-4">
                  {workExperience.map((work, i) => (
                    <div key={i} className="border-l-2 border-amber-300 pl-4">
                      <p className="font-semibold text-black">{work.title}</p>
                      <p className="text-sm text-slate-600">
                        {work.company}
                        {work.location ? ` · ${work.location}` : ""}
                      </p>
                      {(work.startDate || work.endDate || work.current) && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {formatDate(work.startDate)} —{" "}
                          {work.current ? "Present" : formatDate(work.endDate)}
                        </p>
                      )}
                      {work.description && (
                        <p className="text-sm text-slate-500 mt-1">
                          {work.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No work experience added yet.
                </p>
              )}
            </Card>

            {/* Projects */}
            <Card>
              <SectionHeader icon={LuFolderOpen} title="Projects" />
              {isEditing ? (
                <div className="space-y-4">
                  {projects.map((proj, i) => (
                    <div
                      key={i}
                      className="border border-slate-200 rounded-lg p-4 space-y-3 relative"
                    >
                      <button
                        onClick={() => removeListItem(projects, setProjects, i)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        <LuTrash2 size={16} />
                      </button>
                      <Input
                        label="Project Name *"
                        placeholder="My Awesome Project"
                        type="text"
                        value={proj.name}
                        onChange={(e) =>
                          updateListItem(
                            projects,
                            setProjects,
                            i,
                            "name",
                            e.target.value,
                          )
                        }
                      />
                      <Input
                        label="URL"
                        placeholder="https://github.com/..."
                        type="text"
                        value={proj.url}
                        onChange={(e) =>
                          updateListItem(
                            projects,
                            setProjects,
                            i,
                            "url",
                            e.target.value,
                          )
                        }
                      />
                      <div>
                        <label className="text-[13px] text-slate-800">
                          Description
                        </label>
                        <textarea
                          className="input-box w-full text-sm resize-none"
                          rows={2}
                          placeholder="What does this project do?"
                          value={proj.description}
                          onChange={(e) =>
                            updateListItem(
                              projects,
                              setProjects,
                              i,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setProjects([...projects, { ...EMPTY_PROJECT }])
                    }
                    className="inline-flex items-center gap-1 text-amber-600 text-sm font-semibold hover:underline cursor-pointer"
                  >
                    <LuPlus size={14} /> Add Project
                  </button>
                </div>
              ) : projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map((proj, i) => (
                    <div key={i} className="border-l-2 border-amber-300 pl-4">
                      <p className="font-semibold text-black">{proj.name}</p>
                      {proj.url && (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-600 hover:underline text-sm break-all"
                        >
                          {proj.url}
                        </a>
                      )}
                      {proj.description && (
                        <p className="text-sm text-slate-500 mt-1">
                          {proj.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No projects added yet.</p>
              )}
            </Card>

            {/* Save / Cancel buttons (sticky at bottom when editing) */}
            {isEditing && (
              <div className="max-w-2xl mx-auto mt-6">
                <div className="flex gap-3">
                  <button
                    className="flex-1 bg-[#dccaa7] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#dccaa7]/80 transition-colors cursor-pointer disabled:opacity-50"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    className="flex-1 bg-[#dccaa7] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#dccaa7]/80 transition-colors cursor-pointer"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
