import { component$, useContext } from "@builder.io/qwik";
import { TimerContext } from "../../routes/TimerContext";
import { Interval } from "../../routes/index";

export const SetTimerForm = component$(() => {
  const timerState = useContext(TimerContext);

  const intervalOptions: Interval[] = [
    { minutes: 0.1 },
    { minutes: 30 },
    { minutes: 45 },
    { minutes: 60 },
    { minutes: 75 },
    { minutes: 90 },
  ];

  let timeLeft = "";
  if (timerState.alarm && timerState.interval) {
    const secondsLeft =
      (timerState.alarm.getTime() - timerState.currentTime.getTime()) / 1000;

    if (secondsLeft < 0) {
      timeLeft = `0 seconds`;
    } else if (secondsLeft < 60) {
      timeLeft = `${Math.floor(secondsLeft)} seconds`;
    } else {
      timeLeft = `${Math.floor(secondsLeft / 60)} minutes`;
    }
  }

  return (
    <>
      <h1>
        {timerState.interval && timerState.alarm
          ? `${timeLeft} remaining`
          : "Pick a sprint interval"}
      </h1>
      <ul>
        {intervalOptions.map((interval) => (
          <li>
            <button
              onclick$={() => {
                const curTime = new Date();
                const alarmTime = new Date(
                  new Date().setSeconds(
                    curTime.getSeconds() + interval.minutes * 60
                  )
                );
                timerState.currentTime = curTime;
                timerState.alarm = alarmTime;
                timerState.interval = interval;
              }}
            >
              {interval.minutes} mins
            </button>
          </li>
        ))}
      </ul>
    </>
  );
});
