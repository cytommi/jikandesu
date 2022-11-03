import {
  component$,
  createContext,
  useClientEffect$,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import { SetTimerForm } from "../components/forms/SetTimerForm";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";

interface ClockStore {
  currentTime: Date;
  alarm: Date;
}

export const timerContext = createContext("pomodoro-timer");

export default component$(() => {
  const timerState = useStore<ClockStore>(() => {
    const curTime = new Date();
    return {
      currentTime: curTime,
      alarm: new Date(curTime.setSeconds(curTime.getSeconds() + 3)),
    };
  });

  useContextProvider(timerContext, timerState);

  useClientEffect$(async () => {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
    }
  }, {});

  useClientEffect$(async () => {
    const timer = setInterval(() => {
      timerState.currentTime = new Date();
      console.log({ timerState });
      if (timerState.currentTime >= timerState?.alarm) {
        sendNotification({ title: "JIKANDESU", body: "KYUUUUUUUKEIIIIIIII" });
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  });

  return (
    <div>
      <h1>Current time: {timerState.currentTime.toTimeString()}</h1>
      <SetTimerForm />
    </div>
  );
});
