
function searchItems() {
  const input = document.getElementById('searchBar').value.toUpperCase(); // Get the value from the search bar and convert it to uppercase for case-insensitive comparison
  const list = document.getElementById('itemList'); // Get the entire list element that contains the list items
  const items = list.getElementsByTagName('li'); // Get all <li> elements within the list

  let found = false;  // Flag to check if any item matches the search

  for (let i = 0; i < items.length; i++) { // Loop through each list item
    const text = items[i].textContent || items[i].innerText; // Get the text content of the current list item
    if (text.toUpperCase().includes(input)) { // Check if the item's text includes the input (case-insensitive)
      items[i].style.display = ''; // If it matches, show the item
      found = true; // Mark that at least one match was found
    } else {
      items[i].style.display = 'none';  // If it doesn't match, hide the item
    }
  }

  // Show the list only if there's a match,meaning a matching item was found and the user typed something (i.e., the input is not empty).
  list.style.display = found && input !== '' ? 'block' : 'none';
}

