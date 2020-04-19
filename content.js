console.log("copy_search message");

const url_expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
const url_regex = new RegExp(url_expression);

class UI {
  constructor() {
    this.menu = document.createElement("div");
    this.menu.setAttribute(
      "class",
      "copy_search_menu_wrapper copy_search_menu_wrapper_disable"
    );

    this.ul = document.createElement("ul");
    this.menu.insertAdjacentElement("beforeend", this.ul);

    const insert_menu_element = (text) => {
      const element = document.createElement("li");
      element.insertAdjacentText("afterbegin", text);
      this.ul.insertAdjacentElement("beforeend", element);
      return element;
    };

    this.copy = insert_menu_element("copy");
    this.search = insert_menu_element("search");
    this.goto = insert_menu_element("goto...");

    document.body.appendChild(this.menu);
  }

  set_position(selection_position) {
    const relative_position = document.body.parentNode.getBoundingClientRect();
    this.menu.style.top =
      selection_position.top -
      relative_position.top -
      this.menu.offsetHeight -
      2 +
      "px";
    ui.menu.style.left =
      selection_position.left -
      relative_position.left +
      selection_position.width / 2 -
      this.menu.offsetWidth / 2 +
      "px";
  }

  setup_ui() {
    if (selectionString.match(url_regex)) {
      this.goto.style.display = "inline-block";
    }

    this.last = [...ui.ul.children]
      .reverse()
      .find((li) => li.style.display != "none");
    if (this.last) {
      this.last.classList.add("copy_search_menu_last");
    }
  }

  enable_ui() {
    this.menu.classList.remove("copy_search_menu_wrapper_disable");
  }

  reset_ui() {
    this.menu.classList.add("copy_search_menu_wrapper_disable");
    this.goto.style.display = "none";

    if (this.last) {
      this.last.classList.remove("copy_search_menu_last");
    }
  }
}

const debounce = (func, delay) => {
  let timeout = null;
  return (...args) => {
    let context = this;
    const later = () => {
      func.apply(context, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
};

let selectionString = "";

const ui = new UI();

ui.copy.onmousedown = () => {
  navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
    if (result.state == "granted" || result.state == "prompt") {
      navigator.clipboard.writeText(selectionString);
    }
  });
};

ui.search.onmousedown = () => {
  chrome.runtime.sendMessage({
    message: "open_search_tab",
    search_string: selectionString,
  });
};

ui.goto.onmousedown = () => {
  chrome.runtime.sendMessage({
    message: "open_search_tab",
    url: selectionString,
  });
};

document.onmousedown = () => {
  ui.reset_ui();
};

document.onmouseup = debounce(() => {
  const selection = document.getSelection();
  if (selection != "") {
    selectionString = selection.toString();

    ui.setup_ui();
    ui.set_position(selection.getRangeAt(0).getBoundingClientRect());
    ui.enable_ui();
  }
}, 100);
