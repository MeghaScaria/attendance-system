async function loadAttendance() {
    const res = await fetch("http://localhost:3000/api/attendance/today");
    const data = await res.json();

    const tbody = document.querySelector("#table tbody");
    tbody.innerHTML = "";

    if (!data.success) {
        alert("Failed to load data");
        return;
    }

    data.data.forEach(emp => {
        const row = `
            <tr>
                <td>${emp.Empcode}</td>
                <td>${emp.Name}</td>
                <td>${emp.INTime}</td>
                <td>${emp.OUTTime}</td>
                <td>${emp.Status}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}
