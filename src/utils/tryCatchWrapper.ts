export default function tryCatchWrapper(cb: () => void) {
  try {
    cb();
  } catch (e) {
    console.error(e);
  }
}
