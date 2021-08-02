/* eslint-env browser */
const submitBtn = document.getElementById('submit');
const fileInput = document.getElementById('file');
const fileOutput = document.getElementById('fileoutput');

fileInput.addEventListener('change', () => {
  const reader = new FileReader();
  reader.onload = function () {
    const text = reader.result;
    fileOutput.value = text;
    submitBtn.disabled = false;
  };
  reader.readAsText(fileInput.files[0]);
});
