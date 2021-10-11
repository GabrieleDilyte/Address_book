var addressList = [];

function createElement(type, textContent) {
  const element = document.createElement(type);

  element.textContent = textContent;
  return element;
}

function createInputElement(type, value) {
  const element = document.createElement("input");

  element.type = type;
  element.value = value;
  return element;
}

function createAddress(name, phone, email, index, favorite) {
  const addressCard = createElement("div");
  const nameValue = createElement("h2", name);
  const phoneValue = createElement("p", "📱 " + phone);
  const emailValue = createElement("p", "📧 " + email);
  const deleteButton = createElement("button", "Delete");
  const updateButton = createElement("button", "Update");
  const favoriteButton = createElement("button");

  if (favorite) {
    favoriteButton.textContent = "🧡";
  } else {
    favoriteButton.textContent = "🤍";
  }

  addressCard.append(
    nameValue,
    phoneValue,
    emailValue,
    deleteButton,
    updateButton,
    favoriteButton
  );
  document.querySelector("#addressBook").appendChild(addressCard);

  deleteButton.addEventListener("click", () => {
    addressCard.remove();
    addressList.splice(index, 1);
    localStorage.setItem("addressListStorage", JSON.stringify(addressList));
  });

  updateButton.addEventListener("click", () => {
    addressCard.innerHTML = null;

    const nameInput = createInputElement("text", addressList[index].name);
    const phoneInput = createInputElement("tel", addressList[index].phone);
    const emailInput = createInputElement("email", addressList[index].email);
    const saveButton = createElement("button", "Save");

    addressCard.append(nameInput, phoneInput, emailInput, saveButton);

    saveButton.addEventListener("click", () => {
      addressCard.innerHTML = null;
      nameValue.textContent = nameInput.value;
      phoneValue.textContent = "📱 " + phoneInput.value;
      emailValue.textContent = "📧 " + emailInput.value;

      addressCard.append(
        nameValue,
        phoneValue,
        emailValue,
        deleteButton,
        updateButton,
        favoriteButton
      );

      addressList[index].name = nameInput.value;
      addressList[index].phone = phoneInput.value;
      addressList[index].email = emailInput.value;
      localStorage.setItem("addressListStorage", JSON.stringify(addressList));
    });
  });

  favoriteButton.addEventListener("click", (element) => {
    if (favorite) {
      element.target.textContent = "🤍";
      favorite = false;
    } else {
      element.target.textContent = "🧡";
      favorite = true;
    }
    addressList[index].favorite = favorite;
    localStorage.setItem("addressListStorage", JSON.stringify(addressList));
  });
}

function updateAddressList(arrayList) {
  document.querySelector("#addressBook").innerHTML = null;

  arrayList.forEach((element, index) => {
    createAddress(
      element.name,
      element.phone,
      element.email,
      index,
      element.favorite
    );
  });
}

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("addressListStorage")) {
    addressList = JSON.parse(localStorage.getItem("addressListStorage"));
    updateAddressList(addressList);
  }
});

document.querySelector("#addAddress").addEventListener("click", () => {
  const nameInput = document.querySelector("#name").value;
  const phoneInput = document.querySelector("#phone").value;
  const emailInput = document.querySelector("#email").value;

  if (nameInput) {
    addressList.push({
      name: nameInput,
      phone: phoneInput,
      email: emailInput,
      favorite: false,
    });
    localStorage.setItem("addressListStorage", JSON.stringify(addressList));
    updateAddressList(addressList);
  }
});

document.querySelector("#search").addEventListener("click", (element) => {
  const searchInput = document.querySelector("#searchInput").value;

  if (searchInput && element.target.id === "searchButton") {
    const filteredList = addressList.filter((element) => {
      return element.name === searchInput;
    });
    updateAddressList(filteredList);
  } else if (
    (element.target.id === "searchButton" && !searchInput) ||
    element.target.id === "clearButton"
  ) {
    updateAddressList(addressList);
  }
});
