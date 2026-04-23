/**
 * SonicJS API Client for Astro
 * Fetches content from Cloudflare Workers CMS
 */

export interface SonicJSPost {
  id: number;
  title: string;
  description: string;
  content: string;
  slug: string;
  publishDate: string;
  updatedDate?: string;
  coverImage?: {
    src: string;
    alt: string;
  };
  tags: string[];
}

export interface SonicJSPage {
  id: number;
  title: string;
  description?: string;
  content: string;
  slug: string;
}

export interface SonicJSResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class SonicJSClient {
  private baseUrl: string;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheTtl: number;

  constructor(baseUrl: string, options: { cacheTtl?: number } = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.cache = new Map();
    this.cacheTtl = options.cacheTtl || 5 * 60 * 1000;
  }

  private getCacheKey(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    const now = Date.now();
    if (now - cached.timestamp > this.cacheTtl) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async fetchApi<T>(endpoint: string): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint);
    const cached = this.getFromCache<T>(cacheKey);
    if (cached) return cached;

    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const json = await response.json() as SonicJSResponse<T>;
    if (!json.success && json.error) throw new Error(`API error: ${json.error}`);

    this.setCache(cacheKey, json);
    return json as T;
  }

  async getPosts(): Promise<SonicJSPost[]> {
    const response = await this.fetchApi<{ posts: SonicJSPost[] }>('/api/posts');
    return response.posts || [];
  }

  async getPost(slug: string): Promise<SonicJSPost | null> {
    const response = await this.fetchApi<{ post: SonicJSPost }>(`/api/posts/${slug}`);
    return response.post || null;
  }

  async getPages(): Promise<SonicJSPage[]> {
    const response = await this.fetchApi<{ pages: SonicJSPage[] }>('/api/pages');
    return response.pages || [];
  }

  async getPage(slug: string): Promise<SonicJSPage | null> {
    const response = await this.fetchApi<{ page: SonicJSPage }>(`/api/pages/${slug}`);
    return response.page || null;
  }

  async getTags(): Promise<string[]> {
    const posts = await this.getPosts();
    const tagSet = new Set<string>();
    for (const post of posts) {
      for (const tag of post.tags || []) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort();
  }

  async getPostsByTag(tag: string): Promise<SonicJSPost[]> {
    const posts = await this.getPosts();
    return posts.filter(post => post.tags?.includes(tag));
  }

  clearCache(): void {
    this.cache.clear();
  }
}

let client: SonicJSClient | null = null;

export function getSonicJSClient(): SonicJSClient {
  if (!client) {
    const apiUrl = process.env.SONICJS_API_URL || 'http://localhost:8787';
    client = new SonicJSClient(apiUrl);
  }
  return client;
}

export function createSonicJSClient(apiUrl?: string): SonicJSClient {
  const url = apiUrl || process.env.SONICJS_API_URL || 'http://localhost:8787';
  return new SonicJSClient(url);
}
