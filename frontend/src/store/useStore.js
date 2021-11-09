import { useContext } from "react";
import Context from "./Context";

function useStore() {
  const store = useContext(Context);
  return store;
}

export default useStore;
