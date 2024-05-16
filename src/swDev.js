export default function swDev() {
  let swUrl = `${process.env.PUBLIC_URL}/serviceWorker.js`;
  return navigator.serviceWorker.register(swUrl);
}
