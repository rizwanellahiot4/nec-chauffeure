import { supabase } from '@/integrations/supabase/client';

const sanitizeFileName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, '-')
    .replace(/-+/g, '-');

export const uploadAdminAsset = async (file: File, folder: 'vehicles' | 'branding') => {
  const extension = file.name.split('.').pop() ?? 'png';
  const fileName = `${folder}/${crypto.randomUUID()}.${sanitizeFileName(extension)}`;

  const { error: uploadError } = await supabase.storage
    .from('admin-assets')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from('admin-assets').getPublicUrl(fileName);
  return data.publicUrl;
};
