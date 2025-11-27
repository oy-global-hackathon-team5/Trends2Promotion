import {
  VertexAI,
  HarmCategory,
  HarmBlockThreshold,
  type Part,
} from '@google-cloud/vertexai';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

type RecommendedProduct = {
  image_url?: string | null;
};

type DownloadedImage = {
  mimeType: string;
  base64Data: string;
};

type InlineImage = {
  mimeType: string;
  data: string;
};

type Chunk =
  | {
      text: string;
      fullTextSoFar: string;
    }
  | {
      image: InlineImage;
    };

// 이미지 다운로드 함수
async function downloadImage(url: string) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(30000), // 30초 타임아웃
    });

    if (!response.ok) {
      throw new Error(`Failed to download image: HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error(`URL does not point to an image. Content-Type: ${contentType}`);
    }

    // 파일 크기 체크 (10MB 제한)
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
      throw new Error('Image size exceeds 10MB limit');
    }

    const buffer = await response.arrayBuffer();

    // 실제 크기 체크
    if (buffer.byteLength > 10 * 1024 * 1024) {
      throw new Error('Image size exceeds 10MB limit');
    }

    const base64 = Buffer.from(buffer).toString('base64');

    return {
      mimeType: contentType,
      base64Data: base64,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to download ${url}: ${error.message}`);
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 두 가지 입력 형식 지원: 1) 단순 텍스트 프롬프트, 2) 큐레이션 JSON
    let prompt: string;
    let imageUrls: string[] = [];

    if (typeof body === 'string' || body.prompt) {
      // 기존 방식: 단순 텍스트 프롬프트
      prompt = typeof body === 'string' ? body : body.prompt;
    } else if (body.nanobanana_image_prompt || body.curation_result) {
      // 새로운 방식: 큐레이션 JSON
      prompt = body.nanobanana_image_prompt;

      if (body.curation_result?.recommended_products) {
        const recommendedProducts = body.curation_result
          .recommended_products as RecommendedProduct[];
        imageUrls = recommendedProducts
          .map((product) => product.image_url ?? null)
          .filter((url): url is string => typeof url === 'string' && url.length > 0); // 빈 URL 제거
      }
    } else {
      prompt = body.prompt || '';
    }

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // 이미지 다운로드
    const downloadedImages: DownloadedImage[] = [];
    if (imageUrls.length > 0) {
      console.log(`Downloading ${imageUrls.length} images...`);

      for (const url of imageUrls) {
        try {
          const imageData = await downloadImage(url);
          downloadedImages.push(imageData);
          console.log(`Successfully downloaded: ${url}`);
        } catch (error) {
          // 하나라도 실패하면 전체 요청 실패
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(`Failed to download image: ${url}`, errorMessage);
          return NextResponse.json(
            {
              error: 'Failed to download one or more images',
              details: errorMessage,
              failedUrl: url
            },
            { status: 400 }
          );
        }
      }
    }

    // Google Cloud credentials 설정
    // 환경 변수에서 JSON을 읽거나, 로컬 파일 시스템에서 파일을 찾습니다
    let credentials: Record<string, unknown> | undefined;

    // 환경 변수에서 JSON을 읽는 경우 (우선순위)
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

    if (credentialsJson) {
      try {
        // 환경 변수에서 JSON을 파싱
        credentials = JSON.parse(credentialsJson);
        console.log('Credentials loaded from environment variable');
        console.log('Project ID:', credentials?.project_id);
      } catch (error) {
        console.error('Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:', error);
        return NextResponse.json(
          { error: 'Invalid Google Cloud credentials JSON in environment variable', details: error instanceof Error ? error.message : String(error) },
          { status: 500 }
        );
      }
    } else {
      // 로컬 개발 환경: 파일 시스템에서 읽기 (기존 방식)
      const credentialsDir = path.join(process.cwd(), 'app');

      if (fs.existsSync(credentialsDir)) {
        const files = fs.readdirSync(credentialsDir);
        const credentialsFile = files.find((file: string) =>
          file.startsWith('global-hackathon') && file.endsWith('.json')
        );

        if (credentialsFile) {
          const credentialsPath = path.join(credentialsDir, credentialsFile);
          try {
            const fileContent = fs.readFileSync(credentialsPath, 'utf-8');
            credentials = JSON.parse(fileContent);
            console.log('Credentials loaded from file:', credentialsPath);
          } catch (error) {
            console.error('Failed to read credentials file:', error);
            return NextResponse.json(
              { error: 'Failed to read credentials file', details: error instanceof Error ? error.message : String(error) },
              { status: 500 }
            );
          }
        }
      }
    }

    // credentials가 없으면 에러 반환
    if (!credentials) {
      return NextResponse.json(
        {
          error: 'Google Cloud credentials not found',
          message: 'Set GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable or place credentials file in app directory.'
        },
        { status: 500 }
      );
    }

    // Initialize Vertex AI with your Cloud project and location
    const projectId = process.env.GOOGLE_CLOUD_PROJECT || (credentials?.project_id as string | undefined) || 'global-hackathon-479205';
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

    console.log('Initializing VertexAI with:', { project: projectId, location });

    // VertexAI에 credentials를 직접 전달
    const vertexAI = new VertexAI({
      project: projectId,
      location: location,
      googleAuthOptions: {
        credentials: credentials as any,
      },
    });

    const model = 'gemini-2.5-flash-image';

    const generativeModel = vertexAI.preview.getGenerativeModel({
      model: model,
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 1,
        topP: 0.95,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        }
      ],
    });

    // Multimodal input 구성: 텍스트 프롬프트 + 다운로드한 이미지들
    const parts: Part[] = [{ text: prompt }];

    for (const imageData of downloadedImages) {
      parts.push({
        inlineData: {
          mimeType: imageData.mimeType,
          data: imageData.base64Data
        }
      });
    }

    const request_data = {
      contents: [{ role: 'user', parts: parts }],
    };

    const streamingResp = await generativeModel.generateContentStream(request_data);

    const chunks: Chunk[] = [];
    let fullText = '';
    const images: InlineImage[] = [];

    for await (const chunk of streamingResp.stream) {
      if (chunk.candidates && chunk.candidates[0]?.content?.parts) {
        for (const part of chunk.candidates[0].content.parts) {
          if (part.text) {
            fullText += part.text;
            chunks.push({
              text: part.text,
              fullTextSoFar: fullText
            });
          }
          // Check for inline data (images)
          if (part.inlineData) {
            images.push({
              mimeType: part.inlineData.mimeType,
              data: part.inlineData.data
            });
            chunks.push({
              image: {
                mimeType: part.inlineData.mimeType,
                data: part.inlineData.data
              }
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      text: fullText,
      images: images,
      chunks: chunks
    });

  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', details: String(error) },
      { status: 500 }
    );
  }
}
