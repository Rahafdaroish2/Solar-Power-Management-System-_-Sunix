import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { api } from '../../api/client';
import { AppError } from '../../utils/errors';
import { validate, attachmentSchema } from '../../validation/schemas';
const normalize = (asset) =>
  validate(attachmentSchema, {
    uri: asset.uri,
    name: asset.name || asset.fileName || 'photo.jpg',
    mimeType: asset.mimeType || 'image/jpeg',
    size: asset.size ?? asset.fileSize,
  });
export const fileService = {
  async image({ camera = false } = {}) {
    const permission = camera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted)
      throw new AppError('Permission is required to select an image.', {
        code: 'PERMISSION',
      });
    const result = camera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 0.8,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.8,
        });
    return result.canceled ? null : normalize(result.assets[0]);
  },
  async document() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    });
    return result.canceled ? null : normalize(result.assets[0]);
  },
  async upload(attachment, { signal } = {}) {
    const file = validate(attachmentSchema, attachment);
    const body = new FormData();
    body.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    });
    try {
      const result = await api('/uploads', { method: 'POST', body, signal });
      if (typeof result?.id !== 'string' || !result.id)
        throw new AppError('Invalid upload response.', { code: 'UPLOAD' });
      return result;
    } catch (error) {
      if (['AUTHENTICATION', 'CANCELLED', 'CONFIGURATION'].includes(error.code))
        throw error;
      throw new AppError('File upload failed.', {
        code: 'UPLOAD',
        cause: error,
      });
    }
  },
};
