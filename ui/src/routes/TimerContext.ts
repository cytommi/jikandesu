import { createContext } from "@builder.io/qwik";
import { ClockStore } from ".";

export const TimerContext = createContext<ClockStore>("pomodoro-timer");
