import { ref } from 'vue';

export default function useHeader() {
  const headers = ref({
    Authorization: `Bearer ${localStorage.getItem('swdwikiAccessToken')}`,
  });
  return {
    headers,
  };
}
