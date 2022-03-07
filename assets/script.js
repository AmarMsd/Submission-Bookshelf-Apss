const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKS_APPS";

const generatedId=()=>{
    return + new Date();
}

const generateBookObject=(id, title, author, timestamp, isCompleted)=>{
    return{
        id,
        title,
        author,
        timestamp,
        isCompleted
    }
}

const findBook=(bookId)=>{
    for(bookItem of books){
        if(bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}

const findBookIndex=(bookId)=>{
    for(index in books){
        if(books[index].id === bookId){
            return index;
        }
    }
    return -1;
}

//mengecek local storage
const isStorageExist=()=>{
    if(typeof(Storage) === undefined){
        alert("Browser tidak mendukung local storage");
        return false;
    }
    return true;
}

//menyimpan kedalam local storage
const saveData=()=>{
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

//membuat fungsi untuk memuat data
const loadDataFromStorage=()=>{
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null) {
        for(book of data){
            books.push(book);
        } 
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const getListData=()=>{
    const data = document.getElementsByClassName("item");
    console.log(data[0]);

    const searchQuery = document.getElementById("search-query").value.toUpperCase();
    console.log(searchQuery);


    for(let i = 0 ; i < data.length ; i++){

        const data2= data[i].getElementsByClassName("inner");
        const data3 = data2[0].querySelector("h2");
        
        let nilai = data3.innerText.toUpperCase();
        if(nilai.toUpperCase().indexOf(searchQuery) > -1){
            console.log(nilai);
            data[i].style.display = "flex";
        }else{
            data[i].style.display = "none";
        }    
    }

    


}


const makeBook=(id, title, author, timestamp, isCompleted)=>{
    
    const textTitle = document.createElement("h2");
    textTitle.innerText = title;
    
    const textAuthor = document.createElement("p");
    textAuthor.innerText = author;

    const textTimeStamp = document.createElement("p");
    textTimeStamp.innerText = timestamp;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(textTitle, textAuthor, textTimeStamp);

    const container = document.createElement("div");
    container.classList.add("item", "shadow");
    container.append(textContainer);
    container.setAttribute("id", `book-{id}`);

    if(isCompleted){
        const undoButton = document.createElement("button");
        undoButton.classList.add("undo-button");
        undoButton.addEventListener("click", function(){
            undoTaskFromCompleted(id);
            loadData();
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function(){
            removeTaskFromCompleted(id);
            loadData();
        });

        container.append(undoButton, trashButton);

    }else{
        const checkButton = document.createElement("button");
        checkButton.classList.add("check-button");
        checkButton.addEventListener("click", function(){
            addTaskToCompleted(id);
            loadData();
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function(){
            removeTaskFromCompleted(id);
            loadData();
        });
        container.append(checkButton, trashButton);
    }
    return container;
}

const addBook=()=>{
    const textBook1 = document.getElementById("title").value;
    const textBook2 = document.getElementById("author").value;
    const timestamp = document.getElementById("date").value;
    const isCompleted = document.getElementById("selesai").checked;
    const generatedID = generatedId();
    const bookObject = generateBookObject(generatedID, textBook1, textBook2, timestamp, isCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const addTaskToCompleted=(bookId)=>{
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const removeTaskFromCompleted=(bookId)=>{
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1) return;
    books.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const undoTaskFromCompleted=(bookId)=>{
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const submitForm = document.getElementById("form");
submitForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    addBook();
    loadData();
});
if(isStorageExist()){
    loadDataFromStorage();
}
document.addEventListener("load", function(){
    
});

document.addEventListener(SAVED_EVENT, ()=>{
    console.log("Data berhasil disimpan");
});

const loadData=()=>{
    const uncompletedBookList = document.getElementById("books");
    const listCompleted = document.getElementById("complete");

    uncompletedBookList.innerHTML = "";
    listCompleted.innerHTML = "";

    for(bookItem of books){
        console.log(bookItem)
        const bookElement = makeBook(bookItem.id, bookItem.title, bookItem.author, bookItem.timestamp, bookItem.isCompleted);
        if(bookItem.isCompleted){
            listCompleted.append(bookElement);
        }else{
            uncompletedBookList.append(bookElement);
        }
    }
}

loadData();

getListData();

const formElement = document.getElementById("search-book");
formElement.addEventListener("submit",(event)=>{
    event.preventDefault();
    getListData();
});
