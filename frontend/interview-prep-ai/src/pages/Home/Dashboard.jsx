import React, { useEffect, useState, useMemo } from "react";
import {
  LuPlus,
  LuSearch,
  LuLayoutDashboard,
  LuMessageSquare,
  LuSparkles,
  LuRocket,
} from "react-icons/lu";
import { CARD_BG } from "../../utils/data";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import SummaryCard from "../../components/Cards/SummaryCard";
import moment from "moment";
import Modal from "../../components/Modal";
import CreateSessionForm from "./CreateSessionForm";
import DeleteAlertContent from "../../components/DeleteAlertContent";
import Typewriter from "typewriter-effect";

const StatBadge = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-xl px-5 py-4 border border-amber-100 shadow-sm">
    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
      <Icon className="text-amber-700" size={18} />
    </div>
    <div>
      <p className="text-xl font-bold text-slate-800 leading-tight">{value}</p>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
    </div>
  </div>
);

const SessionCardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-xl p-4 border border-amber-100">
    <div className="rounded-lg bg-gray-100 p-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-md shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
    <div className="px-3 pt-4 pb-2 space-y-3">
      <div className="flex gap-2">
        <div className="h-5 bg-gray-100 rounded-full w-24" />
        <div className="h-5 bg-gray-100 rounded-full w-16" />
        <div className="h-5 bg-gray-100 rounded-full w-28" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-4/5" />
    </div>
  </div>
);

const EmptyState = ({ onCreateSession }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-6">
      <LuRocket className="text-amber-600" size={36} />
    </div>{" "}
    <h3 className="text-2xl  text-slate-700 mb-2">
      <Typewriter
        options={{
          strings: ["Start Your First Interview Session"],
          autoStart: true,
          loop: true,
          delay: 75,
          deleteSpeed: 50,
        }}
      />
    </h3>
    <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
      Create a personalized session with AI-generated questions tailored to your
      target role, experience level, and focus areas.
    </p>
    <button
      className="flex items-center gap-2 bg-amber-600 text-white  px-8 py-3 rounded-full hover:bg-amber-700 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg shadow-amber-600/20"
      onClick={onCreateSession}
    >
      <LuPlus size={18} />
      Create Your First Session
    </button>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const totalQuestions = useMemo(
    () => sessions.reduce((sum, s) => sum + (s?.questions?.length || 0), 0),
    [sessions],
  );

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter(
      (s) =>
        s?.role?.toLowerCase().includes(q) ||
        s?.topicsToFocus?.toLowerCase().includes(q) ||
        s?.description?.toLowerCase().includes(q),
    );
  }, [sessions, searchQuery]);

  const fetchAllSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching session data:", error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const deleteSession = async (sessionData) => {
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));

      toast.success("Session Deleted Successfully");
      setOpenDeleteAlert({
        open: false,
        data: null,
      });
      fetchAllSessions();
    } catch (error) {
      console.error("Error deleting session data:", error);
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-6 pb-4 px-4 md:px-8">
        {/* Stats Summary */}
        {!isLoadingSessions && sessions.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
            <StatBadge
              icon={LuLayoutDashboard}
              label="Total Sessions"
              value={sessions.length}
            />
            <StatBadge
              icon={LuMessageSquare}
              label="Total Questions"
              value={totalQuestions}
            />
            <StatBadge
              icon={LuSparkles}
              label="Pinned Questions"
              value={sessions.reduce(
                (sum, s) =>
                  sum + (s?.questions?.filter((q) => q?.isPinned)?.length || 0),
                0,
              )}
            />
          </div>
        )}

        {/* Search Bar */}
        {!isLoadingSessions && sessions.length > 0 && (
          <div className="relative mb-6 max-w-md">
            <LuSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search sessions by role, topic, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent placeholder:text-slate-400 transition-shadow"
            />
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoadingSessions && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6">
            {[1, 2, 3].map((i) => (
              <SessionCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoadingSessions && sessions.length === 0 && (
          <EmptyState onCreateSession={() => setOpenCreateModal(true)} />
        )}

        {/* Session Cards */}
        {!isLoadingSessions && sessions.length > 0 && (
          <>
            {filteredSessions.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-400 text-sm">
                  No sessions match "{searchQuery}"
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-24 md:pb-28">
                {filteredSessions.map((data, index) => (
                  <SummaryCard
                    key={data?._id}
                    colors={CARD_BG[index % CARD_BG.length]}
                    role={data?.role || ""}
                    topicsToFocus={data?.topicsToFocus || ""}
                    experience={data?.experience || "-"}
                    questions={data?.questions?.length || "-"}
                    description={data?.description || ""}
                    lastUpdated={
                      data?.updatedAt
                        ? moment(data.updatedAt).format("Do MMM YYYY")
                        : ""
                    }
                    readinessScore={data?.gapAnalysis?.readinessScore}
                    onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                    onDelete={() => setOpenDeleteAlert({ open: true, data })}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* FAB - only show when there are sessions */}
        {!isLoadingSessions && sessions.length > 0 && (
          <button
            className="h-12 flex items-center justify-center gap-3 bg-amber-600 text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-amber-700 hover:scale-105 transition-all duration-300 cursor-pointer fixed bottom-10 md:bottom-10 right-10 md:right-20 shadow-lg shadow-amber-600/20"
            onClick={() => setOpenCreateModal(true)}
          >
            <LuPlus className="text-sm text-white" />
            Create New Session
          </button>
        )}
      </div>

      <Modal
        isOpen={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
        }}
        hideHeader
      >
        <div>
          <CreateSessionForm />
        </div>
      </Modal>

      <Modal
        isOpen={openDeleteAlert?.open}
        onClose={() => {
          setOpenDeleteAlert({ open: false, data: null });
        }}
        title="Delete Alert"
      >
        <div className="w-[90vw] md:w-[30vw]">
          <DeleteAlertContent
            content="Are you sure you want to delete this session detail?"
            onDelete={() => deleteSession(openDeleteAlert.data)}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
