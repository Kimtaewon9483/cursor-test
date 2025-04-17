import React, { useState, useEffect, useRef } from "react";
// FiChevronLeft, FiChevronRight, FiX, FiUpload, FiImage, FiPlus 아이콘 대신 SVG로 대체합니다
// import {
//   FiChevronLeft,
//   FiChevronRight,
//   FiX,
//   FiUpload,
//   FiImage,
//   FiPlus,
// } from "react-icons/fi";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  caption: string;
  category: string;
  date: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1571210862729-78a52d3779a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    alt: "가족 소풍",
    caption: "봄날의 소풍",
    category: "가족 활동",
    date: "2024년 3월 15일",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1540479859555-17af45c78602?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    alt: "생일 파티",
    caption: "5살 생일 파티",
    category: "기념일",
    date: "2024년 2월 10일",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    alt: "바다 여행",
    caption: "여름 바다 여행",
    category: "여행",
    date: "2024년 7월 22일",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1498&q=80",
    alt: "가족 외식",
    caption: "특별한 저녁 식사",
    category: "가족 활동",
    date: "2024년 4월 5일",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    alt: "캠핑",
    caption: "가을 캠핑",
    category: "여행",
    date: "2023년 10월 15일",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1565992441121-4367c2967103?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1527&q=80",
    alt: "크리스마스",
    caption: "따뜻한 크리스마스",
    category: "기념일",
    date: "2023년 12월 25일",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1581952976147-5a2d15560349?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    alt: "가족 사진",
    caption: "일상의 행복",
    category: "가족 활동",
    date: "2024년 1월 3일",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1597528662465-55ece5734101?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    alt: "공원 소풍",
    caption: "주말 공원 나들이",
    category: "가족 활동",
    date: "2024년 4월 14일",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",
    alt: "자전거 타기",
    caption: "첫 자전거 타기",
    category: "아이 성장",
    date: "2024년 4월 12일",
  },
];

const GalleryPage: React.FC = () => {
  const [filter, setFilter] = useState<string>("전체");
  const categories = ["전체", "가족 활동", "여행", "기념일", "아이 성장"];
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [newImageCaption, setNewImageCaption] = useState<string>("");
  const [newImageCategory, setNewImageCategory] = useState<string>("가족 활동");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredImages =
    filter === "전체"
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);

  const selectedImage =
    selectedImageIndex !== null ? filteredImages[selectedImageIndex] : null;

  // 모달이 열렸을 때 배경 스크롤 방지
  useEffect(() => {
    if (selectedImage || showAddModal) {
      // body에 modal-open 클래스 추가
      document.body.classList.add("modal-open");
    } else {
      // 모달 닫힐 때 초기화
      document.body.classList.remove("modal-open");
    }
  }, [selectedImage, showAddModal]);

  // 이전 이미지로 이동
  const goToPreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  // 다음 이미지로 이동
  const goToNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      selectedImageIndex !== null &&
      selectedImageIndex < filteredImages.length - 1
    ) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImagesArray: string[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          newImagesArray.push(e.target.result.toString());
          setNewImages([...newImages, ...newImagesArray]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 새 사진 추가 폼 제출
  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 구현에서는 API 호출로 사진을 서버에 업로드
    // 여기서는 목업 데이터만 추가
    if (newImages.length > 0) {
      const date = new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      newImages.forEach((src, index) => {
        galleryImages.push({
          id: galleryImages.length + index + 1,
          src,
          alt: newImageCaption || "새 사진",
          caption: newImageCaption || "새 사진",
          category: newImageCategory,
          date,
        });
      });

      // 폼 초기화
      setNewImages([]);
      setNewImageCaption("");
      setShowAddModal(false);
    }
  };

  // 미리보기 이미지 삭제
  const removePreviewImage = (index: number) => {
    const updatedImages = [...newImages];
    updatedImages.splice(index, 1);
    setNewImages(updatedImages);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            우리 가족 사진첩
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            소중한 순간들을 사진으로 기록하고 추억을 되살려보세요
          </p>
        </div>

        {/* 필터 버튼 */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === category
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 갤러리 그리드 */}
        <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer"
              onClick={() => setSelectedImageIndex(index)}
            >
              <div className="h-64 relative">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-semibold">{image.caption}</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                    {image.category}
                  </span>
                  <span className="text-gray-500 text-sm">{image.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 이미지 모달 (슬라이드 기능 추가) */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 modal-container"
            onClick={() => setSelectedImageIndex(null)}
          >
            <div
              className="relative bg-white rounded-lg overflow-hidden gallery-modal-content w-[90vw] max-w-5xl h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg z-10"
                onClick={() => setSelectedImageIndex(null)}
              >
                {/* FiX 대신 SVG로 대체 */}
                <svg
                  className="h-6 w-6 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-2/3 relative flex items-center justify-center bg-black h-full">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="max-w-full max-h-full object-contain"
                  />

                  {/* 인덱스 표시 - 이미지 하단 중앙에 배치 */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full">
                    <p>
                      {selectedImageIndex !== null ? selectedImageIndex + 1 : 0}{" "}
                      / {filteredImages.length}
                    </p>
                  </div>

                  {/* 슬라이드 네비게이션 (이전 버튼) - 이미지 중앙 왼쪽에 배치 */}
                  {selectedImageIndex !== null && selectedImageIndex > 0 && (
                    <button
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10"
                      onClick={goToPreviousImage}
                    >
                      {/* FiChevronLeft 대신 SVG로 대체 */}
                      <svg
                        className="h-6 w-6 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                  )}

                  {/* 슬라이드 네비게이션 (다음 버튼) - 이미지 중앙 오른쪽에 배치 */}
                  {selectedImageIndex !== null &&
                    selectedImageIndex < filteredImages.length - 1 && (
                      <button
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10"
                        onClick={goToNextImage}
                      >
                        {/* FiChevronRight 대신 SVG로 대체 */}
                        <svg
                          className="h-6 w-6 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    )}
                </div>

                <div className="p-6 md:w-1/3 overflow-y-auto">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedImage.caption}
                  </h3>
                  <p className="mt-2 text-gray-500">{selectedImage.date}</p>
                  <div className="mt-4">
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                      {selectedImage.category}
                    </span>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      설명
                    </h4>
                    <p className="mt-2 text-gray-700">
                      {selectedImage.alt}에 대한 추억이 담긴 소중한 사진입니다.
                      가족과 함께한 특별한 순간을 기록했습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 새 사진 추가 모달 */}
        {showAddModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 modal-container"
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="relative max-w-2xl w-full bg-white rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg z-10"
                onClick={() => setShowAddModal(false)}
              >
                {/* FiX 대신 SVG로 대체 */}
                <svg
                  className="h-6 w-6 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  새 사진 추가하기
                </h3>

                <form onSubmit={handleAddImage}>
                  {/* 이미지 업로드 영역 */}
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer mb-6"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                    />

                    {/* FiUpload 대신 SVG로 대체 */}
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">
                      이미지를 업로드하려면 클릭하거나 드래그하세요
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, GIF 파일 지원
                    </p>
                  </div>

                  {/* 미리보기 영역 */}
                  {newImages.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        이미지 미리보기
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {newImages.map((src, index) => (
                          <div key={index} className="relative h-24">
                            <img
                              src={src}
                              alt={`미리보기 ${index + 1}`}
                              className="h-full w-full object-cover rounded"
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                              onClick={() => removePreviewImage(index)}
                            >
                              {/* FiX 대신 SVG로 대체 */}
                              <svg
                                className="h-3 w-3"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 설명 입력 필드 */}
                  <div className="mb-4">
                    <label
                      htmlFor="caption"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      사진 설명
                    </label>
                    <input
                      type="text"
                      id="caption"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="사진에 대한 설명을 입력하세요"
                      value={newImageCaption}
                      onChange={(e) => setNewImageCaption(e.target.value)}
                    />
                  </div>

                  {/* 카테고리 선택 필드 */}
                  <div className="mb-6">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      카테고리
                    </label>
                    <select
                      id="category"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newImageCategory}
                      onChange={(e) => setNewImageCategory(e.target.value)}
                    >
                      {categories
                        .filter((cat) => cat !== "전체")
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* 버튼 그룹 */}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      onClick={() => setShowAddModal(false)}
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={newImages.length === 0}
                    >
                      추가하기
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 업로드 버튼 */}
        <div className="mt-12 text-center">
          <button
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setShowAddModal(true)}
          >
            {/* FiPlus 대신 SVG로 대체 */}
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            새 사진 추가하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
