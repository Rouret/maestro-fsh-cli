export const wrapperTryCatchEEXIST = (
  funcToExe: () => void,
  callBack: () => void
) => {
  try {
    funcToExe();
  } catch (e) {
    //@ts-ignore
    if (e.code !== undefined && e.code === "EEXIST") {
      callBack();
    } else {
      console.error(e);
    }
  }
};
