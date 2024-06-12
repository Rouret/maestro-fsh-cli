export const wrapperTryCatchEEXIST = (
  funcToExe: () => void,
  callBack: () => void = () => {}
): boolean => {
  let isErrored = false;
  try {
    funcToExe();
  } catch (e) {
    //@ts-ignore
    callBack();
    isErrored = true;
  }

  return isErrored;
};
