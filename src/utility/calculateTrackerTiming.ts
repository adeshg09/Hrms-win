/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the heper functions related to crop image.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 21/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------
/* Imports */
import moment from 'moment';

/* Relative Imports */
import {
  TrackerDetailModel,
  TrackerModel,
  UserProjectTrackerModel
} from 'models/company';

// ----------------------------------------------------------------------

// Helper function to calculate time difference in minutes between two "HH:mm:ss" strings
function calculateTimeDifference(start: string, end: string): number {
  const startTime = moment(start, 'HH:mm:ss');
  const endTime = moment(end, 'HH:mm:ss');
  return endTime.diff(startTime, 'minutes');
}

// Function to convert minutes to HH:mm
function convertMinutesToHHmm(minutes: number): string {
  return moment.utc().startOf('day').add(minutes, 'minutes').format('HH:mm');
}

export default function calculateTrackerTiming(
  trackerUsers: Array<UserProjectTrackerModel>
): Array<UserProjectTrackerModel> {
  trackerUsers.forEach((trackerUser: UserProjectTrackerModel) => {
    const { trackers } = trackerUser;
    let totalWorkingTimeMinutes: number = 0;
    let totalIdleTimeMinutes: number = 0;

    trackers.forEach((tracker: TrackerModel) => {
      const { trackerDetail } = tracker;
      const workingTimeMinutes = calculateTimeDifference(
        trackerDetail[0].capture_time,
        trackerDetail[trackerDetail.length - 1].capture_time
      );
      let idleTimeMinutes: number = 0;
      let previousCaptureTime: string | null = null;
      trackerDetail.forEach(
        (trackerItem: TrackerDetailModel, tdIndex: number) => {
          if (tdIndex === 0) {
            previousCaptureTime = trackerItem.capture_time;
            return;
          }

          if (
            trackerItem.key_count === 0 &&
            trackerItem.click_count === 0 &&
            previousCaptureTime
          ) {
            const timeDiff = calculateTimeDifference(
              previousCaptureTime,
              trackerItem.capture_time
            );
            idleTimeMinutes += timeDiff;
          }
          previousCaptureTime = trackerItem.capture_time;
        }
      );
      tracker.workingTime = convertMinutesToHHmm(workingTimeMinutes);
      tracker.idealTime = convertMinutesToHHmm(idleTimeMinutes);

      totalWorkingTimeMinutes += workingTimeMinutes;
      totalIdleTimeMinutes += idleTimeMinutes;
    });
    trackerUser.totalWorkingTime = convertMinutesToHHmm(
      totalWorkingTimeMinutes
    );
    trackerUser.totalIdealTime = convertMinutesToHHmm(totalIdleTimeMinutes);
  });

  return trackerUsers;
}
