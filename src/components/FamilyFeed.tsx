import React from "react";

interface FeedItem {
  id: number;
  title: string;
  date: string;
  content: string;
  image: string;
  author: string;
}

const dummyFeedItems: FeedItem[] = [
  {
    id: 1,
    title: "주말 가족 피크닉",
    date: "2024년 4월 14일",
    content:
      "오늘은 근처 공원에서 가족 피크닉을 즐겼어요. 아이들이 정말 신나게 놀았답니다!",
    image:
      "https://images.unsplash.com/photo-1597528662465-55ece5734101?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    author: "엄마",
  },
  {
    id: 2,
    title: "첫 자전거 타기",
    date: "2024년 4월 12일",
    content:
      "오늘 우리 딸이 처음으로 보조 바퀴 없이 자전거를 탔어요! 너무 자랑스럽네요.",
    image:
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",
    author: "아빠",
  },
  {
    id: 3,
    title: "할머니 댁 방문",
    date: "2024년 4월 8일",
    content:
      "주말에 할머니 댁에 다녀왔어요. 할머니가 정성스럽게 준비해주신 음식이 너무 맛있었습니다.",
    image:
      "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",
    author: "아들",
  },
];

const FamilyFeed: React.FC = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            우리 가족의 일상
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            일상의 소소한 행복을 기록해보세요
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {dummyFeedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover md:w-48"
                    src={item.image}
                    alt={item.title}
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="ml-0 md:ml-4">
                      <div className="text-sm text-gray-500">
                        {item.date} | 작성자: {item.author}
                      </div>
                      <h3 className="mt-1 text-xl font-semibold text-gray-900">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <div className="mt-4 text-base text-gray-500">
                    {item.content}
                  </div>
                  <div className="mt-6">
                    <a
                      href="#"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      자세히 보기
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
          >
            더 많은 일상 보기
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FamilyFeed;
