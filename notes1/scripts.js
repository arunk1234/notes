const githubApiBaseUrl = "https://api.github.com";
const repoOwner = "arunk1234";
const repoName = "notes";
const accessToken = "";



async function readFile(filePath) {
  //      url: `https://api.github.com/repos/${repoOwner}/${repoName}/`,
    const response = await fetch(
      `${githubApiBaseUrl}/repos/${repoOwner}/${repoName}/${filePath}`,
      {
        headers: {
          "Authorization": `token ${accessToken}`,
        },
      }
    );
  
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
  
    const data = await response.json();
    const content = atob(data.content);
    return content;
  }

  async function updateFile(filePath, newContent, message) {
    // First, get the current file to obtain its SHA and content
    const currentFile = await fetch(
      `${githubApiBaseUrl}/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        headers: {
          "Authorization": `token ${accessToken}`,
        },
      }
    );
  
    if (!currentFile.ok) {
      throw new Error(`Failed to fetch file: ${currentFile.statusText}`);
    }
  
    const currentFileData = await currentFile.json();
    const sha = currentFileData.sha;
    const currentContent = atob(currentFileData.content);
  
    // Compare the current content with the new content
    if (currentContent === newContent) {
      console.log("No changes to save");
      return;
    }else{
      console.log("newContent : \n " + newContent);
    }
  
    // Update the file
    const response = await fetch(
      `${githubApiBaseUrl}/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `token ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          content: btoa(newContent),
          sha: sha,
        }),
      }
    );
  
    if (!response.ok) {
      throw new Error(`Failed to update file: ${response.statusText}`);
    }
  }
   

  


const subjectsList = document.getElementById("subjects-list");
const notesTextarea = document.getElementById("notes-textarea");

const mockData = [
    { subject: "Math", filePath: "contents/math.txt" },
    { subject: "Science", filePath: "contents/science.txt" },
    { subject: "History", filePath: "contents/history.txt" },
  ];
  

function populateSubjects() {
  mockData.forEach((data, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = data.subject;
    listItem.classList.add("list-group-item");
    listItem.dataset.index = index;
    listItem.addEventListener("click", handleSubjectClick);
    subjectsList.appendChild(listItem);
  });
}

async function handleSubjectClick(e) {
    const index = e.target.dataset.index;
    const selectedSubject = mockData[index];
  
    const activeItem = subjectsList.querySelector(".list-group-item.active");
    if (activeItem) activeItem.classList.remove("active");
    e.target.classList.add("active");
  
    try {
      const content = await readFile(selectedSubject.filePath);
      notesTextarea.value = content;
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  
    notesTextarea.readOnly = false;
    notesTextarea.addEventListener("input", handleNotesChange);
  }
  
  async function handleNotesChange(e) {

    const activeItem = subjectsList.querySelector(".list-group-item.active");
    if (!activeItem) return;
    const index = activeItem.dataset.index;
    const selectedSubject = mockData[index];
  
    try {
      await updateFile(selectedSubject.filePath, e.target.value, "Update notes");
    } catch (error) {
      console.error("Error updating file:", error);
    }
  }
  

populateSubjects();
