let allIssues = [];

const labelStyles = {
  bug: { btn: "btn-error", border: "border-red-400", img: "./assets/bug.png" },
  enhancement: { btn: "btn-info", border: "border-blue-400", img: "" },
  documentation: { btn: "btn-neutral", border: "border-gray-400", img: "" },
  "help wanted": {
    btn: "btn-warning",
    border: "border-yellow-400",
    img: "./assets/help.png",
  },
  "good first issue": {
    btn: "btn-success",
    border: "border-green-400",
    img: "",
  },
};

const priorityStyles = {
  high: "btn-error",
  medium: "btn-warning",
  low: "btn-success",
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function createCard(issue) {
  const borderColor =
    issue.status === "open" ? "border-[#00A96E]" : "border-[#A855F7]";
  const statusImg =
    issue.status === "open"
      ? "./assets/Open-Status.png"
      : "./assets/Closed-Status.png";
  const priorityClass = priorityStyles[issue.priority] || "btn-neutral";

  const labelsHTML = issue.labels
    .map((label) => {
      const style = labelStyles[label] || {
        btn: "btn-neutral",
        border: "border-gray-400",
        img: "",
      };
      const imgTag = style.img
        ? `<img src="${style.img}" class="w-[12px] h-[12px]" />`
        : "";
      return `<button class="btn btn-soft ${style.btn} text-[12px] mr-2 p-2 rounded-full h-[24px] ${style.border}">
                    ${imgTag} ${label.toUpperCase()}
                  </button>`;
    })
    .join("");

  return `
          <div class="Card w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] min-h-[256px] bg-white rounded-lg shadow-md border-t-4 ${borderColor} p-4 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-center">
                <img src="${statusImg}" />
                <button class="btn btn-soft ${priorityClass} w-[80px] h-[24px] rounded-full text-[12px]">
                  ${issue.priority.toUpperCase()}
                </button>
              </div>
              <div class="my-2">
                <h3 class="font-semibold text-[14px] line-clamp-2">${issue.title}</h3>
                <p class="text-[12px] text-gray-400 line-clamp-2">${issue.description}</p>
              </div>
              <div class="flex flex-wrap gap-1">${labelsHTML}</div>
            </div>
            <div>
              <hr class="border-t-2 border-gray-200 my-2 -mx-4" />
              <p class="text-[12px] text-gray-400">#${issue.id} by ${issue.author}<br>${formatDate(issue.createdAt)}</p>
            </div>
          </div>`;
}

function renderCards(issues) {
  const container = document.getElementById("Cards");
  document.getElementById("issueAmount").textContent =
    `${issues.length} issues`;
  container.innerHTML = issues.map(createCard).join("");
}

function filterIssues(status) {
  document.getElementById("filterAllBtn").classList.remove("active");
  document.getElementById("filterOpenBtn").classList.remove("active");
  document.getElementById("filterClosedBtn").classList.remove("active");

  if (status === "all") {
    document.getElementById("filterAllBtn").classList.add("active");
    renderCards(allIssues);
  } else if (status === "open") {
    document.getElementById("filterOpenBtn").classList.add("active");
    renderCards(allIssues.filter((i) => i.status === status));
  } else if (status === "closed") {
    document.getElementById("filterClosedBtn").classList.add("active");
    renderCards(allIssues.filter((i) => i.status === status));
  }
}

async function loadIssues() {
  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const data = await res.json();
  allIssues = data.data;
  renderCards(allIssues);
}

loadIssues();
