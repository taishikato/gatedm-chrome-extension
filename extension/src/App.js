/* global chrome */
import { useEffect, useState } from "react";
import { getUnixTimeStamp } from "./utils/getUnixTimeStamp";
import { getObjectFromLocalStorage } from "./utils/storageUtils";
import { getDmListFromDom } from "./utils/getDmListFromDom";
import { getDomList } from "./utils/getDomList";

function App() {
  const [users, setUsers] = useState([]);

  const handleClick = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: getDmListFromDom,
      },
      (result) => {
        console.log({ result });
        setUsers(result[0].result);
      }
    );
  };

  const deleteUser = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getDomList,
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const current = getUnixTimeStamp();

      for (const user of users) {
        const dataFromStorage = await getObjectFromLocalStorage(user);

        if (dataFromStorage !== undefined) continue;

        const result = await fetch(
          "http://localhost:5001/gated-app/us-central1/getTwitterData",
          {
            method: "POST",
            body: JSON.stringify({ username: user }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((res) => res.json());

        chrome.storage.sync.set(
          { [user]: { ...result, createdAt: current } },
          () => {}
        );
      }
    };
    if (users.length > 0) fetchUsers();
  }, [users]);

  return (
    <div className="App w-full min-w-[300px]">
      <div className="my-10">
        <button
          onClick={handleClick}
          className="mb-3 py-2 px-3 bg-slate-200 font-bold rounded-full text-slate-800 hover:bg-slate-300 mx-auto block"
        >
          Filter users
        </button>
        <button onClick={deleteUser}>Delete a user</button>
      </div>
      <ul>
        {users.map((user) => (
          <li>{user}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
