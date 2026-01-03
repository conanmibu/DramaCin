import type { ApiResponse, DramaDetail, SearchResponse } from '../types/drama';

const BASE_URL = 'https://api.sansekai.my.id/api';

export async function fetchTheaters(): Promise<ApiResponse> {
  const response = await fetch(`${BASE_URL}/netshort/theaters`);
  if (!response.ok) {
    throw new Error('Failed to fetch theaters');
  }
  return response.json();
}

export async function fetchAllEpisodes(shortPlayId: string): Promise<DramaDetail> {
  const response = await fetch(`${BASE_URL}/netshort/allepisode?shortPlayId=${shortPlayId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch episodes');
  }
  const data = await response.json();
  return data;
}

export async function searchDramas(query: string): Promise<SearchResponse> {
  const response = await fetch(`${BASE_URL}/netshort/search?query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search dramas');
  }
  return response.json();
}

export async function fetchForYou(page: number = 1): Promise<ApiResponse> {
  const response = await fetch(`${BASE_URL}/netshort/foryou?page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch for you');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}

export async function fetchCategoryDramas(groupId: string): Promise<ApiResponse> {
  const response = await fetch(`${BASE_URL}/netshort/category?groupId=${groupId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch category dramas');
  }
  return response.json();
}

export async function fetchSubtitles(shortPlayId: string, episodeId: string) {
  const response = await fetch(`${BASE_URL}/netshort/subtitle?shortPlayId=${shortPlayId}&episodeId=${episodeId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch subtitles');
  }
  return response.json();
}
