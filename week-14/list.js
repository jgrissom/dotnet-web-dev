// Week 14: your list page asks your API for data, and changes part of itself
// without a reload. Your list page's view loads this file, from wwwroot/js/list.js.
//
// ✏️ Change the four lines marked ✏️ to fit your app, and nothing else.

const API = "/api/trails";                                       // ✏️ 1. your API, from week 13
const RELATED = "reviews";                                       // ✏️ 2. the list inside one record's JSON
const describe = (row) => `${row.hiker} · ${row.comment}`;       // ✏️ 3. how one related row reads
const nameOf = (record) => record.name;                          // ✏️ 4. what a record is called

// GET one record, then list its related rows inside its element.
const showRelated = async (record) => {
    const related = record.querySelector(".related");
    related.textContent = "Loading…";

    const response = await fetch(`${API}/${record.dataset.id}`);
    if (response.status !== 200) {
        related.textContent = "That one isn't here any more.";
        return;
    }

    const data = await response.json();
    const rows = data[RELATED];
    related.textContent = rows.length === 0 ? "Nothing here yet." : "";
    for (const row of rows) {
        const item = document.createElement("li");
        item.textContent = describe(row);
        related.append(item);
    }
};

// DELETE one record. A 204 has no body, so read it back instead: once its
// address answers 404, take its element off the page.
const removeRecord = async (record) => {
    if (!confirm("Remove this one, and everything that belongs to it?")) {
        return;
    }

    const response = await fetch(`${API}/${record.dataset.id}`, { method: "DELETE" });
    if (response.status === 401 || response.status === 403) {
        alert("You need to be signed in with your role to remove anything. Sign in again.");
        return;
    }

    const check = await fetch(`${API}/${record.dataset.id}`);
    if (check.status === 404) {
        record.remove();
    }
};

// One listener for the whole page. closest() finds the record the click was in.
document.addEventListener("click", (event) => {
    const record = event.target.closest("[data-id]");
    if (!record) {
        return;
    }
    if (event.target.matches(".show-related")) {
        showRelated(record);
    }
    if (event.target.matches(".remove")) {
        removeRecord(record);
    }
});

// The form's boxes, as JSON, each under its own name. A number box sends a
// number, a checkbox true or false, and an empty date box no date at all.
const toJson = (form) => {
    const body = {};
    for (const box of form.elements) {
        if (!box.name) {
            continue;
        }
        if (box.type === "number") {
            body[box.name] = box.value === "" ? 0 : Number(box.value);
        } else if (box.type === "checkbox") {
            body[box.name] = box.checked;
        } else if (box.type === "date") {
            body[box.name] = box.value || null;
        } else {
            body[box.name] = box.value;
        }
    }
    return body;
};

// POST a new record. Only your role's page has the form.
const form = document.querySelector("#quick-add");
if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const errors = document.querySelector("#quick-add-errors");
        errors.textContent = "";

        const response = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toJson(form)),
        });

        if (response.status === 201) {
            // Read the new record back from the Location header, and say so,
            // with a link to its page.
            const saved = await (await fetch(response.headers.get("Location"))).json();
            const page = location.pathname.replace(/\/(index)?$/i, "");
            const item = document.createElement("li");
            const link = document.createElement("a");
            link.href = `${page}/Details/${saved.id}`;
            link.textContent = nameOf(saved);
            item.append("Added ", link);
            document.querySelector("#added").append(item);
            form.reset();
            return;
        }

        // Only a 400 has errors to list. A 401 or a 403 has no body at all.
        if (response.status === 400) {
            const problem = await response.json();
            for (const messages of Object.values(problem.errors)) {
                for (const message of messages) {
                    const item = document.createElement("li");
                    item.textContent = message;
                    errors.append(item);
                }
            }
            return;
        }

        errors.textContent = "You need to be signed in with your role to add anything. Sign in again.";
    });
}
