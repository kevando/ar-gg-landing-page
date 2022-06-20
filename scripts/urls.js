

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


export {
  getQueryParam,
  getInviteId
};