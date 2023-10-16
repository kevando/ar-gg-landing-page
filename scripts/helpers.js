

function getInviteId() {
  // Grab params from URL
  const [urlPath, inviteId] = window.location.pathname.slice(1).split("/");
  if (urlPath === "i" && typeof inviteId === "string") {
    renderItemByInviteId(inviteId);
  } else {
    console.log("ERROR: What are you doing here?");
  }
}

function getQueryParam(param) {
  const params = new URL(window.location).searchParams;
  return params.get(param);
}

function serializeForm(data) {
  let obj = {};
  for (let [key, value] of data) {
    if (obj[key] !== undefined) {
      if (!Array.isArray(obj[key])) {
        obj[key] = [obj[key]];
      }
      obj[key].push(value);
    } else {
      obj[key] = value;
    }
  }
  return obj;
}


export {
  getQueryParam,
  getInviteId,
  serializeForm
};