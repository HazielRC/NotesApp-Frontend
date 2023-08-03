const endpoint = "http://localhost:3500";

const contentMain = document.getElementById("content");
const createNoteContainer = document.getElementById("create-note-form");
const createNoteButton = document.getElementById("createNote");
const usernameInput = document.getElementById("username");
const noteTitleInput = document.getElementById("title");
const noteDescriptionInput = document.getElementById("description");
const notesContainer = document.getElementById("notes");
const editModal = document.getElementById("edit-modal-container");
const editTitle = document.getElementById("editTitleInput");
const editDescription = document.getElementById("editDescriptionInput");
const saveEdit = document.getElementById("edit-submit");
const cancelEdit = document.getElementById("edit-cancel");

let user = "testuser123";
let noteTitle = "Hello. World!";
let noteDescription = "just a description.";

usernameInput.addEventListener("change", async (e) => {
  user = e.target.value;
  await drawNotes();
});

noteTitleInput.addEventListener("change", (e) => {
  noteTitle = e.target.value;
});

noteDescriptionInput.addEventListener("change", (e) => {
  noteDescription = e.target.value;
});

createNoteButton.addEventListener("click", async () => {
  await createNote();
  await drawNotes();
});

const getNotes = async () => {
  try {
    const response = await fetch(`${endpoint}/notes/${user}`);
    if (!response.ok) {
      throw new Error("Network response was not ok D:");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const createNote = async () => {
  const reqBody = {
    username: user,
    title: noteTitle,
    description: noteDescription,
  };

  try {
    const response = await fetch(`${endpoint}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

const drawNotes = async () => {
  let notesHtml = "";
  const notes = await getNotes();

  if (notes.length === 0) {
    notesHtml = `<h1 class="error-message">No notes found for this user.</h1>`;
  } else {
    notes.forEach((note) => {
      const noteFormat = `
        <div class="note" id="${note.id}">
          <div class="note-controls">
            <code class="note-id">${note._id}</code>
            <div>
              <button class="edit-note" id="${note._id}">EDIT</button>
              <button class="delete-note" id="${note._id}">DEL</button>
            </div>
          </div>
          <h1 class="note-title">${note.title}</h1>
          <p class="note-description">${note.text}</p>
        </div>
      `;
      notesHtml += noteFormat + "\n";
    });
  }

  notesContainer.innerHTML = notesHtml;
};

const main = async () => {
  await drawNotes();
  notesContainer.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-note")) {
      const id = event.target.id;
      await deleteNote(id);
      await drawNotes();
    }
    if (event.target.classList.contains("edit-note")) {
      const id = event.target.id;
      startEditing(id);
    }
  });
};

const deleteNote = async (id) => {
  try {
    const response = await fetch(`${endpoint}/delete/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

const startEditing = (id) => {
  editModal.style.display = "flex";
  saveEdit.setAttribute("note-id", id);
  editTitle.value = "";
  editDescription.value = "";
  createNoteContainer.style.display = "none";
  notesContainer.style.marginTop = "0";
};

const hideEdit = () => {
  editModal.style.display = "none";
  createNoteContainer.style.display = "flex";
  notesContainer.style.marginTop = "300px";
  contentMain.style.overflow = "auto";
};

saveEdit.addEventListener("click", async (e) => {
  const note_id = e.target.getAttribute("note-id");
  const body = {
    _id: note_id,
    title: editTitle.value,
    text: editDescription.value,
  };

  await editNote(body);
  hideEdit();
  e.target.setAttribute("note-id", "null");
  await drawNotes();
});

cancelEdit.addEventListener("click", hideEdit);

const editNote = async (body) => {
  try {
    const response = await fetch(`${endpoint}/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

main();
