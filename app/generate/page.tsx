'use client';

import { useState } from 'react';

export default function GenerateImagePage() {
  const [inputData, setInputData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!inputData.trim()) {
      setError('데이터를 입력해주세요');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // JSON 파싱 시도
      let requestBody;
      try {
        requestBody = JSON.parse(inputData);
      } catch (parseError) {
        // JSON이 아니면 단순 텍스트 프롬프트로 처리
        requestBody = { prompt: inputData };
      }

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '이미지 생성에 실패했습니다');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          이미지 생성 테스트
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label htmlFor="inputData" className="block text-sm font-medium text-gray-700 mb-2">
            입력 데이터
          </label>
          <p className="text-xs text-gray-500 mb-3">
            단순 텍스트 또는 큐레이션 JSON 데이터를 입력하세요.
            JSON 형식인 경우 제품 이미지 URL들을 함께 활용하여 이미지를 생성합니다.
          </p>
          <textarea
            id="inputData"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder={`단순 텍스트 또는 JSON 형식:\n{\n  "nanobanana_image_prompt": "A high-end beauty advertisement...",\n  "curation_result": {\n    "recommended_products": [\n      { "name": "제품명", "image_url": "https://..." }\n    ]\n  }\n}`}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 font-mono text-sm"
            rows={12}
            disabled={loading}
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out"
          >
            {loading ? '생성 중...' : '이미지 생성'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">오류</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">결과</h2>

            {result.text && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 text-gray-800">텍스트 응답:</h3>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{result.text}</p>
              </div>
            )}

            {result.images && result.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-800">생성된 이미지:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.images.map((image: any, index: number) => (
                    <div key={index} className="relative">
                      <img
                        src={`data:${image.mimeType};base64,${image.data}`}
                        alt={`Generated image ${index + 1}`}
                        className="w-full rounded-lg shadow-md"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <details className="mt-6">
              <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                전체 응답 데이터 보기
              </summary>
              <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96 mt-2">
                <pre className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
