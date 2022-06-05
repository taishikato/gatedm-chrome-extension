/* global chrome */
import { useEffect, useRef, useState } from "react";
import { getUnixTimeStamp } from "./utils/getUnixTimeStamp";
import { getObjectFromLocalStorage } from "./utils/storageUtils";
import { getDmListFromDom } from "./utils/getDmListFromDom";
import { hideUser } from "./utils/hideUser";

const oneWeekSec = 604800;

export type DataFromStorage = {
  followersCount: number;
  createdAt: number;
};

function App() {
  const [users, setUsers] = useState([]);
  const currentTab = useRef<chrome.tabs.Tab>();
  const [threshold, setThreshold] = useState(1000);
  const [callingApi, setCallingApi] = useState(false);

  useEffect(() => {
    const getCurrentTab = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      currentTab.current = tab;
    };

    getCurrentTab();
  }, []);

  const handleClick = async () => {
    chrome.scripting.executeScript(
      {
        target: { tabId: currentTab.current?.id as number },
        func: getDmListFromDom,
      },
      (result) => {
        setUsers(result[0].result);
      }
    );
  };

  const hideUserFromDom = async (username: string) => {
    chrome.scripting.executeScript({
      target: { tabId: currentTab.current?.id as number },
      func: hideUser,
      args: [username],
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setCallingApi(true);
      const current = getUnixTimeStamp();

      for (const user of users) {
        const dataFromStorage: DataFromStorage | undefined =
          await getObjectFromLocalStorage(user);

        // if (
        //   dataFromStorage !== undefined &&
        //   current - dataFromStorage?.createdAt < oneWeekSec
        // ) {
        //   if (dataFromStorage.followersCount < threshold)
        //     await hideUserFromDom(user);
        //   continue;
        // }

        console.log(import.meta.env.VITE_API_URL);

        const result = await fetch(import.meta.env.VITE_API_URL ?? "", {
          method: "POST",
          body: JSON.stringify({ username: user }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());

        chrome.storage.sync.set(
          { [user]: { ...result, createdAt: current } },
          () => {}
        );
        if (result.followersCount < threshold) await hideUserFromDom(user);
      }
      setCallingApi(false);
    };
    if (users.length > 0) fetchUsers();
  }, [users]);

  return (
    <div className="App w-full min-w-[300px] text-center flex flex-col gap-y-3 pt-4 pb-5 bg-slate-900 text-sm px-2">
      <h1 className="text-base font-semibold">Gated DM</h1>
      <div>
        <input
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          type="number"
          className="rounded-full input bg-slate-300 text-slate-800"
        />
      </div>
      <div className="text-slate-100">
        Condition: with more than{" "}
        <span className="font-semibold">{threshold}</span> followers.
      </div>
      <div>
        <button
          onClick={handleClick}
          className={`btn mx-auto bg-slate-300 hover:bg-slate-400 text-slate-800 rounded-full ${
            callingApi ? "loading" : ""
          }`}
        >
          Filter users
        </button>
      </div>
      <p className="text-xs">
        If you still see a user other than the one you assumed, press the button
        again. The reason is that Twitter may add new users if necessary.
      </p>
    </div>
  );
}

export default App;
