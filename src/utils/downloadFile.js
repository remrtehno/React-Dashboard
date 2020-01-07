export function downloadFile(blob, fileName) {
  //const blob = new Blob([data], { type });

  if (window.navigator.appVersion.toString().indexOf('.NET') !== -1) {
    window.navigator.msSaveBlob(blob, fileName);
    return;
  }

  const link = document.createElement('a');
  const href = window.URL.createObjectURL(blob);
  link.href = href;
  link.style.display = 'none';
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(href);
  }, 100);
}
