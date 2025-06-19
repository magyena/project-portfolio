
const toggleBtn = document.getElementById('toggleBtn');
const projectItems = document.querySelectorAll('.project-item');

toggleBtn.addEventListener('click', function() {
    const isExpanded = this.dataset.expanded === "true";

    if (isExpanded) {
        // Sembunyikan item ke-4 dan seterusnya
        projectItems.forEach((item, index) => {
            if (index >= 3) item.classList.add('d-none');
        });
        this.textContent = "Show More";
        this.dataset.expanded = "false";
    } else {
        // Tampilkan semua
        projectItems.forEach(item => item.classList.remove('d-none'));
        this.textContent = "Show Less";
        this.dataset.expanded = "true";
    }
});
