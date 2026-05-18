export const getDeviceId =
  () => {

    let deviceId =
      localStorage.getItem(
        "vivaDeviceId"
      );

    // Generate Device ID
    if (!deviceId) {

      deviceId =
        "DEV-" +
        Math.random()
          .toString(36)
          .substring(2, 10)
          .toUpperCase();

      localStorage.setItem(
        "vivaDeviceId",
        deviceId
      );

    }

    return deviceId;

};