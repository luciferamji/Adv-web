import Resumable from 'resumablejs';
import { API_BASE_URL } from '../config/api';

interface UploadConfig {
  endpoint: string;
  onProgress?: (progress: number) => void;
  onSuccess?: (response: any) => void;
  onError?: (error: Error) => void;
}

export const createResumableUpload = (file: File, config: UploadConfig) => {
  const resumable = new Resumable({
    target: `${API_BASE_URL}${config.endpoint}`,
    chunkSize: 1 * 1024 * 1024, // 1MB chunks
    simultaneousUploads: 3,
    testChunks: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    query: { type: file.type }
  });

  resumable.addFile(file);

  resumable.on('fileProgress', (file) => {
    config.onProgress?.(file.progress() * 100);
  });

  resumable.on('fileSuccess', (file, response) => {
    config.onSuccess?.(JSON.parse(response));
  });

  resumable.on('fileError', (file, message) => {
    config.onError?.(new Error(message));
  });

  return resumable;
};

export const uploadFiles = async (
  files: File[],
  endpoint: string,
  onProgress?: (progress: number) => void
): Promise<any[]> => {
  const uploads = files.map(
    (file) => {
      return new Promise((resolve, reject) => {
        const upload = createResumableUpload(file, {
          endpoint,
          onProgress,
          onSuccess: resolve,
          onError: reject
        });
        upload.upload();
      });
    }
  );

  return Promise.all(uploads);
};