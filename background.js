chrome.runtime.onMessage.addListener((request, sender, _) => {
  if (request.message === "open_search_tab") {
    let url =
      request.search_string === undefined
        ? request.url
        : "https://www.google.com/search?q=" + request.search_string;

    chrome.tabs.create({
      index: sender.tab.index + 1,
      url: url,
    });
  }
});
