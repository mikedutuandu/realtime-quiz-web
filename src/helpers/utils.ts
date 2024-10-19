import { toast } from 'react-toastify'
import _ from 'lodash'
import { sha256 } from 'js-sha256';

export const alert = {
  success: (msg: string) => {
    toast.success(msg, {
      position: 'top-right',
      autoClose: 1500,
    })
  },
  error: (msg: string) => {
    toast.error(
      _.truncate(msg, {
        length: 1000,
      }),
      {
        position: 'top-right',
        autoClose: 1500,
      },
    )
  },
}

// Add this new function
export const generateUniqueId = (name: string): string => {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 15);
  const combinedString = `${name}-${timestamp}-${random}`;
  return sha256(combinedString).substring(0, 16); // Use first 16 characters of the hash
};
