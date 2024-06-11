const { Script } = require("vm");

const createForm = document.querySelector("#Addform");


createForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const formData = new FormData(createForm);
  const reqBody = Object.fromEntries(formData)
  console.log(reqBody);

  fetch("/loanerform", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(reqBody)
  })
  .then(() => {
    window.location.href = "/home";
  });
});

// This Script.js file contains all the code that makes our loanerForm functional. It allows for the information the user submits to the form to be collected, and posted to the admin side of our SVGFECompositeElement, so that all people who fill out the form are tracked