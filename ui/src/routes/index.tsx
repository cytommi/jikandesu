import {
  component$,
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
import { TimerContext } from "./TimerContext";

export type Interval = { minutes: number };

export interface ClockStore {
  currentTime: Date;
  alarm: Date | undefined;
  interval: Interval | undefined;
}

export default component$(() => {
  const timerState = useStore<ClockStore>(() => {
    const curTime = new Date();
    return {
      currentTime: curTime,
      interval: undefined,
      alarm: undefined,
      // alarm: new Date(curTime.setSeconds(curTime.getSeconds() + 3)),
    };
  });

  useContextProvider(TimerContext, timerState);

  useClientEffect$(async () => {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
    }
  }, {});

  useClientEffect$(async ({ track }) => {
    track(() => timerState.interval);

    const timer = setInterval(() => {
      timerState.currentTime = new Date();
      if (
        timerState.alarm != null &&
        timerState.interval != null &&
        timerState.currentTime >= timerState.alarm
      ) {
        sendNotification({
          title: "JIKANDESU",
          body: `It has been ${timerState.interval.minutes} minutes! Takes a break!`,
        });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  });

  return (
    <div>
      <SetTimerForm />
    </div>
  );
});
