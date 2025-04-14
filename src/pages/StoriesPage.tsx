import React, { useState } from "react";

interface StoryItem {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  likes: number;
  comments: CommentItem[];
}

interface CommentItem {
  id: number;
  text: string;
  author: string;
  date: string;
}

const StoriesPage: React.FC = () => {
  const [stories, setStories] = useState<StoryItem[]>([
    {
      id: 1,
      title: "첫 번째 가족 여행",
      content: `지난 주말, 우리 가족은 처음으로 함께 제주도로 여행을 다녀왔습니다. 
      아이들은 비행기를 처음 타봐서 정말 신났고, 제주도의 아름다운 바다와 자연을 보며 많은 추억을 만들었습니다.
      특히 성산일출봉에서 본 일출은 정말 잊을 수 없는 순간이었습니다. 앞으로도 이런 소중한 시간을 많이 가지려고 합니다.`,
      author: "아빠",
      date: "2024년 3월 15일",
      likes: 4,
      comments: [
        {
          id: 1,
          text: "정말 좋은 추억이 되었어요! 다음에는 설악산으로 가보는 것도 좋을 것 같아요.",
          author: "엄마",
          date: "2024년 3월 16일",
        },
        {
          id: 2,
          text: "바다가 정말 예뻤어요! 또 가고 싶어요~",
          author: "딸",
          date: "2024년 3월 16일",
        },
      ],
    },
    {
      id: 2,
      title: "아들의 첫 요리 도전",
      content: `오늘 우리 아들이 처음으로 요리에 도전했습니다. 파스타를 만들었는데, 처음치고는 정말 맛있게 잘 만들었어요.
      식재료를 손질하는 것부터 익히는 것까지 모두 열심히 노력하는 모습이 인상적이었습니다.
      요리하는 동안 행복해 보이는 아들의 모습을 보니 저도 덩달아 행복했습니다. 다음에는 더 다양한 요리에 도전해볼 예정입니다.`,
      author: "엄마",
      date: "2024년 4월 2일",
      likes: 5,
      comments: [
        {
          id: 3,
          text: "정말 맛있었어요! 다음에는 피자도 만들어볼게요.",
          author: "아들",
          date: "2024년 4월 2일",
        },
      ],
    },
    {
      id: 3,
      title: "딸의 첫 발표회",
      content: `오늘은 딸의 첫 바이올린 발표회가 있었습니다. 3개월 동안 열심히 준비한 결과, 멋진 무대를 선보였습니다.
      비록 작은 실수가 있었지만, 끝까지 포기하지 않고 연주를 마친 딸이 너무 자랑스러웠습니다.
      발표회가 끝나고 딸의 얼굴에 피어난 뿌듯한 미소는 오랫동안 기억에 남을 것 같습니다.
      앞으로도 딸의 꿈을 응원하고 지원해주려고 합니다.`,
      author: "엄마",
      date: "2024년 4월 10일",
      likes: 7,
      comments: [
        {
          id: 4,
          text: "정말 감동적인 무대였어요. 우리 딸 최고!",
          author: "아빠",
          date: "2024년 4월 10일",
        },
        {
          id: 5,
          text: "다음에는 더 잘할 수 있을 거예요. 계속 응원할게요!",
          author: "할머니",
          date: "2024년 4월 11일",
        },
      ],
    },
  ]);

  // 댓글 표시 상태를 관리하는 상태 추가
  const [visibleComments, setVisibleComments] = useState<
    Record<number, boolean>
  >({});

  // 댓글 표시/숨기기 토글 함수
  const toggleComments = (storyId: number) => {
    setVisibleComments((prev) => ({
      ...prev,
      [storyId]: !prev[storyId],
    }));
  };

  const [newComment, setNewComment] = useState<{
    storyId: number | null;
    text: string;
  }>({
    storyId: null,
    text: "",
  });

  const [newStory, setNewStory] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  });

  const [isAddingStory, setIsAddingStory] = useState(false);

  // 좋아요 증가 함수
  const handleLike = (id: number) => {
    setStories(
      stories.map((story) =>
        story.id === id ? { ...story, likes: story.likes + 1 } : story
      )
    );
  };

  // 댓글 추가 함수
  const handleAddComment = (storyId: number) => {
    if (newComment.text.trim() === "") return;

    setStories(
      stories.map((story) =>
        story.id === storyId
          ? {
              ...story,
              comments: [
                ...story.comments,
                {
                  id: Date.now(),
                  text: newComment.text,
                  author: "나",
                  date: new Date().toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }),
                },
              ],
            }
          : story
      )
    );
    setNewComment({ storyId: null, text: "" });
  };

  // 새 이야기 추가 함수
  const handleAddStory = () => {
    if (newStory.title.trim() === "" || newStory.content.trim() === "") return;

    const newStoryItem: StoryItem = {
      id: Date.now(),
      title: newStory.title,
      content: newStory.content,
      author: "나",
      date: new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      likes: 0,
      comments: [],
    };

    setStories([newStoryItem, ...stories]);
    setNewStory({ title: "", content: "" });
    setIsAddingStory(false);
  };

  // 삭제 확인을 위한 상태 추가
  const [storyToDelete, setStoryToDelete] = useState<number | null>(null);

  // 삭제 함수
  const handleDeleteStory = (id: number) => {
    setStories(stories.filter((story) => story.id !== id));
    setStoryToDelete(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            우리 가족 이야기
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            소소한 일상부터 특별한 순간까지, 우리 가족의 이야기를 기록해보세요
          </p>
        </div>

        {/* 글쓰기 버튼 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsAddingStory(true)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="mr-2 -ml-1 w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            새 이야기 작성하기
          </button>
        </div>

        {/* 스토리 목록 */}
        <div className="mt-12 space-y-10">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {story.title}
                  </h2>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500 mr-4">
                      {story.date} | {story.author}
                    </div>
                    <button
                      onClick={() => setStoryToDelete(story.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="삭제"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-4 text-gray-700 whitespace-pre-line">
                  {story.content}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => handleLike(story.id)}
                    className="flex items-center text-gray-600 hover:text-indigo-600"
                  >
                    <svg
                      className="h-5 w-5 mr-1"
                      fill={story.likes > 0 ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{story.likes} 좋아요</span>
                  </button>
                  <button
                    onClick={() => toggleComments(story.id)}
                    className="flex items-center text-gray-600 hover:text-indigo-600 border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <span>댓글 {story.comments.length}개</span>
                  </button>
                </div>
              </div>

              {/* 댓글 섹션 - 애니메이션 추가 */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  visibleComments[story.id]
                    ? "max-h-[2000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-gray-50 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    댓글
                  </h3>
                  <div className="space-y-4">
                    {story.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">
                              {comment.author.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {comment.author}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {comment.date}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 댓글 입력 폼 */}
                  <div className="mt-6">
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            나
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                          <input
                            type="text"
                            placeholder="댓글을 남겨보세요..."
                            className="flex-1 px-4 py-2 focus:outline-none"
                            value={
                              newComment.storyId === story.id
                                ? newComment.text
                                : ""
                            }
                            onChange={(e) =>
                              setNewComment({
                                storyId: story.id,
                                text: e.target.value,
                              })
                            }
                            onFocus={() =>
                              setNewComment({
                                ...newComment,
                                storyId: story.id,
                              })
                            }
                          />
                          <button
                            className="px-4 py-2 bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none"
                            onClick={() => handleAddComment(story.id)}
                          >
                            게시
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 새 이야기 작성 모달 */}
      {isAddingStory && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsAddingStory(false)}
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    새 이야기 작성
                  </h3>
                  <div className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="story-title"
                          className="block text-sm font-medium text-gray-700"
                        >
                          제목
                        </label>
                        <input
                          type="text"
                          name="story-title"
                          id="story-title"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="제목을 입력하세요"
                          value={newStory.title}
                          onChange={(e) =>
                            setNewStory({ ...newStory, title: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="story-content"
                          className="block text-sm font-medium text-gray-700"
                        >
                          내용
                        </label>
                        <textarea
                          id="story-content"
                          name="story-content"
                          rows={6}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="이야기를 들려주세요..."
                          value={newStory.content}
                          onChange={(e) =>
                            setNewStory({
                              ...newStory,
                              content: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={handleAddStory}
                >
                  게시하기
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:text-sm"
                  onClick={() => setIsAddingStory(false)}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {storyToDelete && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setStoryToDelete(null)}
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    이야기 삭제
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      정말로 이 이야기를 삭제하시겠습니까? 이 작업은 되돌릴 수
                      없습니다.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleDeleteStory(storyToDelete)}
                >
                  삭제
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setStoryToDelete(null)}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesPage;
