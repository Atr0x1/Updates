import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../lib/supabase';
import { Path } from 'react-native-svg';
import { supabaseUrl } from '../constants';

export const getUserImageSrc = imagePath =>{
    if(imagePath){
        return getSupabaseFileUrl(imagePath);
    }else{
        return require('../assets/images/defaultUser.png');
    }
}
export const getSupabaseFileUrl = filePath =>{
    if(filePath){
        return {uri:`${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`}
    }
    return null;
}

export const downloadFile = async(url)=>{
  try {
    const{uri} = await FileSystem.downloadAsync(url, getLocalFilepath(url));
    return uri;
  } catch (error) {
    return null;
  }
}

export const getLocalFilepath = filePath =>{
  let fileName = filePath.split('/').pop();
  return `${FileSystem.documentDirectory}${fileName}`;
}

export const uploadFile = async (folderName, fileUri, isImage = true) => {
    try {
      console.log('Reading file from URI:', fileUri);  // Debugging
  
      // Generate a file name with a timestamp
      let fileName = getFilePath(folderName, isImage);
  
      // Read file as base64 from the file URI
      const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Convert base64 to ArrayBuffer
      let imageData = decode(fileBase64);
  
      // Upload to Supabase
      let { data, error } = await supabase
      .storage
        .from('uploads')
        .upload(fileName, imageData, {
          cacheControl: '3600',
          upsert: false,
          contentType: isImage ? 'image/*' : 'video/*'
        });
  
      // Handle upload error
      if (error) {
        console.log('File upload error:', error);  // Log the error for debugging
        return { success: false, msg: 'Could not upload media' };
      }
  
      
  
      return { success: true, data: data.path };  // Return uploaded image path

    } catch (error) {
      console.log('File upload exception:', error);  // Log any exceptions
      return { success: false, msg: 'Could not upload media' };
    }
  };

  export const getFilePath = (folderName, isImage) => {
    return `${folderName}/${new Date().getTime()}${isImage ? '.png' : '.mp4'}`;
  };