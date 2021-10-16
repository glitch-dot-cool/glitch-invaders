export const detectMobile = () => {
  let isMobile =
    navigator.userAgent.toLowerCase().indexOf("mobile") !== -1 ||
    navigator.userAgent.toLowerCase().indexOf("iphone") !== -1 ||
    navigator.userAgent.toLowerCase().indexOf("android") !== -1 ||
    navigator.userAgent.toLowerCase().indexOf("windows phone") !== -1;

  return isMobile;
};
