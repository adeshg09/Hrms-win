/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create timer component.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 17/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import React, { memo, useEffect, useState } from 'react';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Show the timer by passing seconds
 *
 * @interface TimerProps
 * @property {number} seconds - initial seconds to start timer
 * @property {boolean} resetTimer - if true, reset the timer
 * @property {function} onResetTimer - change the timer reset by passing prop
 * @property {function} onTimerEnd - callback function when timer ends
 */
export interface TimerProps {
  seconds: number;
  resetTimer: boolean;
  onResetTimer: (val: boolean) => void;
  onTimerEnd?: () => void;
}

// ----------------------------------------------------------------------

/**
 * Show the timer by passing seconds
 *
 * @component
 * @param {number} seconds - initial seconds to start timer
 * @param {boolean} resetTimer - if true, reset the timer
 * @param {function} onResetTimer - change the timer reset by passing prop
 * @param {function} onTimerEnd - callback function when timer ends
 */
const Timer = ({
  seconds,
  resetTimer,
  onResetTimer,
  onTimerEnd = () => null
}: TimerProps): JSX.Element => {
  /* States */
  const [remainingSeconds, setRemainingSeconds] = useState(seconds);

  /**
   * converts the seconds to time in HH:mm format
   * @returns {string}
   */
  const handleSecondsToTime = (val: number): string => {
    const min = Math.floor(val / 60)
      .toString()
      .padStart(2, '0');
    const sec = (val - Number(min) * 60).toString().padStart(2, '0');

    return `${min}:${sec}`;
  };

  /* Side-Effects */
  useEffect(() => {
    const myInterval = setInterval(() => {
      if (remainingSeconds > 0) {
        setRemainingSeconds(remainingSeconds - 1);
      }
      if (remainingSeconds === 0) {
        clearInterval(myInterval);
        if (onTimerEnd) {
          onTimerEnd();
        }
      } else {
        setRemainingSeconds(remainingSeconds - 1);
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  useEffect(() => {
    if (resetTimer) {
      setRemainingSeconds(seconds);
      onResetTimer(false);
    }
  }, [resetTimer]);

  /* Output */
  return <>{handleSecondsToTime(remainingSeconds)}</>;
};

export default memo(Timer);
