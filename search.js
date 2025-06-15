function searchItems() {
  const input = document.getElementById('searchBar').value.toUpperCase();
  const list = document.getElementById('itemList');
  const items = list.getElementsByTagName('li');

  let found = false;

  for (let i = 0; i < items.length; i++) {
    const text = items[i].textContent || items[i].innerText;
    if (text.toUpperCase().includes(input)) {
      items[i].style.display = '';
      found = true;
    } else {
      items[i].style.display = 'none';
    }
  }

  // Show the list only if there's a match
  list.style.display = found && input !== '' ? 'block' : 'none';
}

