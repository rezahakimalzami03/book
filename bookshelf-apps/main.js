/**
 * [
 *    {
 *      id: string | number
 *      book : string
 *      bookAuthor: string
 *      bookYear: number
 *      isCompleted: boolean
 *    }
 * ]
 */
const racks = [];
const RENDER_EVENT = 'render-rack';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function generateId() {
    return +new Date();
  }

function generateRackObject(id, book, bookAuthor, bookYear, isComplete) {
    return {
      id,
      book,
      bookAuthor,
      bookYear, 
      isComplete
    };
  }

  function findBook(bookId) {
    for (const bookItem of racks) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }

  function findBookIndex(bookId) {
    for (const index in racks) {
      if (racks[index].id === bookId) {
        return index;
      }
    }
    return -1;
  }

  function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }

  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(racks);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        racks.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function makeList(rackObject) {

    const {id, book, bookAuthor, bookYear, isComplete} = rackObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = book;
   
    const textAuthor = document.createElement('p');
    textAuthor.innerText = "Penulis : " + bookAuthor;

    const textYear = document.createElement('p');
    textYear.innerText = "Tahun : " + bookYear;

    const buttonAction = document.createElement('div');
    buttonAction.classList.add('button')
  
   // container
    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textTitle, textAuthor, textYear, buttonAction);

    if (isComplete) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
     
        undoButton.addEventListener('click', function () {
          undoTaskFromComplete(id);
        });
     
        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
     
        trashButton.addEventListener('click', function () {
          removeTaskFromComplete(id);
        });
     
        container.append(undoButton, trashButton);
      } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function () {
          addBookToComplete(id);
        });

        const trashButton2 = document.createElement('button');
        trashButton2.classList.add('trash-button');
     
        trashButton2.addEventListener('click', function () {
          removeTaskFromComplete2(id);
        });
     

        container.append(checkButton, trashButton2);
      }

    return container;
  }

  function addBook() {
    const textTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
   
    const generatedID = generateId();
    const bookObject = generateRackObject(generatedID, textTitle, bookAuthor, bookYear, false);
    racks.push(bookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function addBookToComplete(bookId /* HTMLELement */) {

    const rackTarget = findBook(bookId);
    alert('Apakah Kamu Sudah Membacanya?')
    if (rackTarget == null) return;
    
    rackTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    
  }

  function removeTaskFromComplete(bookId) {
    const bookTarget = findBookIndex(bookId);
    alert('Apakah Kamu Yakin Ingin Menghapus Buku ini?')
   
    if (bookTarget === -1) return;
   
    racks.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert('Buku Telah Dihapus')
  }

  function removeTaskFromComplete2(bookId) {
    const bookTarget = findBookIndex(bookId);
    alert('Apakah Kamu Yakin Ingin Menghapus Buku ini?')
   
    if (bookTarget === -1) return;
   
    racks.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert('Buku Telah Dihapus')
  }

  function undoTaskFromComplete(bookId) {
    const bookTarget = findBook(bookId);
    alert('Kamu Belum Selesai Membacanya Ya?')
   
    if (bookTarget == null) return;
   
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

document.addEventListener('DOMContentLoaded', function () {
    
    const submitForm = document.getElementById('inputBook');
    
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
      alert("Buku Berhasil Dimasukkan");
    });

      if (isStorageExist()) {
        loadDataFromStorage();
      }
    });
    
    document.addEventListener(SAVED_EVENT,  () => {
      console.log('Data berhasil di simpan.');
    });

    document.addEventListener(RENDER_EVENT, function () {
      const incompleteBookList = document.getElementById('incompleteBookshelfList');
      const completeBookList = document.getElementById('completeBookshelfList');
  
      // clearing list item
      incompleteBookList.innerHTML = '';
      completeBookList.innerHTML = '';
     
      for (const bookItem of racks) {
        const bookElement = makeList(bookItem);
        if (!bookItem.isComplete) {
          incompleteBookList.append(bookElement);
        } else {
          completeBookList.append(bookElement);
      }
    }
  });

  const searchForm = document.getElementById('searchBook');

  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const searchTerm = document.getElementById('searchBookTitle').value.toLowerCase();
    const searchResults = searchBooks(searchTerm);

    // Menampilkan hasil pencarian
    renderSearchResults(searchResults);
  });
  
  

  function searchBooks(searchTerm) {
    return racks.filter((rack) => rack.book.toLowerCase().includes(searchTerm));
  }
  
  function renderSearchResults(results) {
    const incompleteBookList = document.getElementById('incompleteBookshelfList');
    const completeBookList = document.getElementById('completeBookshelfList');
  
    // Hapus semua buku yang sudah ada
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';
  
    for (const book of results) {
      const rackElement = makeList(book);
      if (book.isComplete) {
        completeBookList.appendChild(rackElement);
      } else {
        incompleteBookList.appendChild(rackElement);
      }
    }
  }
