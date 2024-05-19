import { invoke } from "@tauri-apps/api"

invoke('cmd', { args: 'tmp' })
  .then((res) => {
    console.log(res);
  });