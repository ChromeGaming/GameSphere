function copyLink(shareIcon) {
    var linkInput = shareIcon.querySelector('input[type="hidden"]');
    var link = linkInput.value;
  
    // Create a temporary input element
    var tempInput = document.createElement('input');
    tempInput.setAttribute('value', link);
    document.body.appendChild(tempInput);
  
    // Copy the value from the input element to the clipboard
    tempInput.select();
    document.execCommand('copy');
  
    // Remove the temporary input element
    document.body.removeChild(tempInput);
  
    // Provide visual feedback or show a message indicating that the link has been copied
    alert('Link copied to clipboard!');
  }
  