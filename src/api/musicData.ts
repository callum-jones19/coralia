import { invoke } from "@tauri-apps/api"

export const testApiCall = () => {
  invoke('cmd', { args: 'tmp' })
  .then((res) => {
    console.log(res);
  });
};
