import { create } from 'zustand';
import { persist } from 'zustand/middleware';


type State = {
  isScrollable: boolean,
};

type Action = {
  setIsScrollable: (isEnableScroll: boolean) => void,
};

const useScroll = create(
  (persist<State & Action>(
    (set) => ({
      isScrollable: true,
      setIsScrollable: (isEnableScroll) => {
        set({
          isScrollable: isEnableScroll,
        });
      },
    }),
    {
      name: 'scrollSettings',
    }
  ))
);

export default useScroll;