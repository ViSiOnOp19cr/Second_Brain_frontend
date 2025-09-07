import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { ContentCard } from "../components/ContentCard";
import { CreateContent } from "../components/CreateContent";
import { Modal } from "../components/Modal";
import { useContent } from "../hooks/useContent";
import { Plusicon } from "../assets/Plusicon";
import { useNavigate } from "react-router-dom";

export const Dashborad = () => {
  const navigate = useNavigate();
  const { content, loading, fetchContent, error } = useContent();
  const [localContent, setLocalContent] = useState<typeof content>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);
  
  // Update localContent when content changes
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const filteredContent = localContent.filter((item) => {
    let tags: string[] = [];
    if (item.tags && Array.isArray(item.tags)) {
      if (item.tags.length > 0) {
        if (typeof item.tags[0] === "string") {
          tags = item.tags as string[];
        } else {
          tags = (item.tags as { tag?: { title?: string }; title?: string }[])
            .map((tagItem: { tag?: { title?: string }; title?: string }) => {
              if (
                typeof tagItem === "object" &&
                "tag" in tagItem &&
                tagItem.tag &&
                "title" in tagItem.tag
              ) {
                return tagItem.tag.title!;
              }
              if (typeof tagItem === "object" && "title" in tagItem) {
                return tagItem.title!;
              }
              return "";
            })
            .filter((title) => title !== "");
        }
      }
    }

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tags.some((tagTitle) =>
        tagTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesType =
      typeFilter === "all" ||
      item.type.toLowerCase() === typeFilter.toLowerCase();
    const isRecent =
      currentFilter === "recent" && item.createdAt
        ? new Date(item.createdAt) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        : true;

    return (
      matchesSearch && matchesType && (currentFilter === "all" || isRecent)
    );
  });

  const handleFilterChange = (filter: string) => {
    if (["youtube", "twitter", "article", "document"].includes(filter)) {
      setTypeFilter(filter);
      setCurrentFilter("all");
    } else {
      setCurrentFilter(filter);
      if (filter === "all" || filter === "recent") {
        setTypeFilter("all");
      }
    }
  };

  const handleContentCreated = () => {
    setShowCreateModal(false);
    fetchContent();
  };

  const handleContentDeleted = (id: number) => {
    // Update the local content list by filtering out the deleted item
    const updatedContent = localContent.filter(item => item.id !== id);
    setLocalContent(updatedContent);
  };

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar
        onAddNew={() => setShowCreateModal(true)}
        onFilterChange={handleFilterChange}
        currentFilter={typeFilter !== "all" ? typeFilter : currentFilter}
      />

      <div className="flex-1 ml-64 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Your Second Brain
            </h1>
            <p className="text-gray-400">
              Store and organize your important links in one place
            </p>
          </div>
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors lg:hidden"
              >
                <Plusicon />
                Add Link
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setTypeFilter("all");
                  setCurrentFilter("all");
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  typeFilter === "all" && currentFilter === "all"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange("youtube")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  typeFilter === "youtube"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                YouTube
              </button>
              <button
                onClick={() => handleFilterChange("twitter")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  typeFilter === "twitter"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                Twitter/X
              </button>
              <button
                onClick={() => handleFilterChange("article")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  typeFilter === "article"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                Articles
              </button>
              <button
                onClick={() => handleFilterChange("document")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  typeFilter === "document"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                Document
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400">Loading content...</div>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-400 mb-4">
                {searchQuery
                  ? "No content found matching your search."
                  : "No content yet. Start by adding your first link!"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plusicon />
                  Add Your First Link
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
              {filteredContent.map((item) => {
                let tagsForCard: { title: string }[] = [];
                if (
                  item.tags &&
                  Array.isArray(item.tags) &&
                  item.tags.length > 0
                ) {
                  if (typeof item.tags[0] === "string") {
                    tagsForCard = (item.tags as string[]).map((tag) => ({
                      title: tag,
                    }));
                  } else {
                    tagsForCard = (
                      item.tags as {
                        tag?: { title?: string };
                        title?: string;
                      }[]
                    )
                      .map((tagItem) => {
                        if (
                          "tag" in tagItem &&
                          tagItem.tag &&
                          "title" in tagItem.tag
                        ) {
                          return { title: tagItem.tag.title! };
                        }
                        if ("title" in tagItem) {
                          return { title: tagItem.title! };
                        }
                        return { title: "" };
                      })
                      .filter((tag) => tag.title !== "");
                  }
                }

                return (
                  <ContentCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    type={item.type}
                    link={item.link}
                    tags={tagsForCard}
                    createdAt={item.createdAt || new Date().toISOString()}
                    onDelete={handleContentDeleted}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Content"
      >
        <CreateContent onSuccess={handleContentCreated} />
      </Modal>
    </div>
  );
};
